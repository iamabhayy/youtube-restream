import expressJwt from 'express-jwt';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import low from 'lowdb';

import { createServer } from "http";
import { Server } from "socket.io";
import { spawn } from 'child_process';

const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)


import mergeVideo from './functions/video-merge';
import getOptions from './functions/youtube-data-api';

const app = express();
const server = createServer(app);

app.use(cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }))

app.use(
    expressJwt({
        secret: 'superSecret',
        algorithms: ["HS256"],
        credentialsRequired: false
    })
);

app.use(bodyParser.json())
app.use(express.static('stream'));

app.post('/login', (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;

    const user = db.get('users').find({ email: email }).value();
    const matchPasswords = bcrypt.compareSync(password, user.password);

    console.log(matchPasswords, user);

    if (matchPasswords) {
        const token = jwt.sign(
            {
                payload: { role: user.role, email: user.email, name: user.name}
            },
            'superSecret',
            {
                algorithm: "HS256",
                subject: user.email,
                expiresIn: "365d"
            }
        );

        const setting = db.get('setting').value();
        res.send({token, user, setting});
    }else{
        res.status(401).send('invalid email or password')
    }
});

app.get('/user', ({user}, res) => {
    if(user){
        const userData = db.get('users').find({ email: user.sub }).value();
        const setting = db.get('setting').value();
        res.send({user: userData, setting})
    }else {
        res.status(401).send('not authenticated')
    }
});

app.get('/setting', ({user}, res) => {
    if(user){
        const config = db.get('setting').value();
        res.send(config)
    }else{
        res.status(401).send('not authenticated')
    }
});

app.post('/setting', async ({user, body}, res) => {
    if(user && user.payload.role == 'admin'){
        const config = await db.set('setting', body).write();
        res.send(config.setting)
    }else {
        res.status(401).send('not authenticated')
    }
});



const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

var status = {
    downloading: false,
    streaming: false,
    source: null,
};


var ffmpegProcess;
var downloaderProcess;

io.on("connection", (socket) => {
    console.log('Socket connected');

    socket.on('startStream', (data) => {

        if (status.streaming) {
            console.log('oops');
            socket.emit('fatal', 'stream already started.');
            return;
        }

        // Check that rtmpKey exiest
        // Load setting data from database

        var setting = db.get('setting').value();

        var rtmpUrl = `rtmp://a.rtmp.youtube.com/live2/${setting.rtmpKey}`;

        // TODO Get reStreaming settings from database

        var options = [
            '-re',
            '-stream_loop',
            '-1', '-i', 'stream/output.mp4',
            '-vf', setting.resolution, '-b:v', setting.videoBitrate, '-b:a', setting.audioBitrate,
            '-preset', 'veryfast', '-g', '30', '-r', '30',
            '-flvflags',
            'no_duration_filesize',
            '-f', 'flv',
            rtmpUrl
        ];

        status.source = "RTMP";

        if (data.isBroadcasting) {
            status.source = "WebRTC";
            options = [
                '-i', '-',
                '-c:v', 'libx264', '-preset', 'veryfast', '-tune', 'zerolatency',
                '-c:a', 'aac', '-ar', '44100', '-b:a', '64k',
                '-y',
                '-use_wallclock_as_timestamps', '1',
                '-async', '1',
                '-bufsize', '3000',
                '-f', 'flv',
                rtmpUrl
            ];
        }

        console.log(options, data);
        // Start streaming from video file on server to youtube with ffmpeg new settings

        ffmpegProcess = spawn('ffmpeg', options);

        // Change streaming status to true and streaming source to RTMP
        status.streaming = true;
        io.emit('status', { ...status });

        ffmpegProcess.stderr.on('data', (res) => {
            socket.emit('ffmpeg_stderr', '' + res);
        });

        // ffmpegProcess.stdout.on('data', (res) => {
        // 	console.log(res);
        // });

        ffmpegProcess.on('error', (err) => {
            console.log('child process error' + err);
            socket.emit('fatal', 'ffmpeg error!' + err);

            status.streaming = false;
            io.emit('status', { ...status });
        });

        ffmpegProcess.on('exit', (err) => {
            console.log('child process exit' + err);
            socket.emit('fatal', 'ffmpeg exit!' + err);

            status.streaming = false;
            io.emit('status', { ...status });
        });

    });

    socket.on('broadcastStream', (data) => {
        if (Buffer.isBuffer(data)) {
            console.log('this is some video data');
            ffmpegProcess.stdin.write(data);
        } else {
            console.log('not blob');
        }
    });

    socket.on('stopStream', function () {
        console.log("socket disconnected!");
        if (ffmpegProcess)
            try {
                ffmpegProcess.stdin.end();
                ffmpegProcess.kill('SIGINT');

                console.log("ffmpeg process ended!");
                status.streaming = false;
                io.emit('status', { ...status });
            } catch (e) { console.warn('killing ffmoeg process attempt failed...'); }
    });


    //TODO! Video downloader socket connection

    socket.on('startDownloading', async (data) => {

        if (status.downloading) {
            socket.emit('fatal', 'Previous downloading in progress.');
            return;
        }

        console.log('Downloading start');

        status.downloading = true;
        io.emit('status', { ...status });

        const options = await getOptions(data.days);

        console.log(options);

        // Start downloading videos from youtube url
        downloaderProcess = spawn('youtube-dl', options);
        
        
        downloaderProcess.stderr.on('data', function (d) {
            console.log(d);
            socket.emit('ffmpeg_stderr', '' + d);
        });

        downloaderProcess.on('close', (code) => {
            console.log(code);
            if (code == 0) {
                console.log('Downloading complete');
                mergeVideo();

                status.downloading = false;
                io.emit('status', { ...status });
            } else {
                console.log('Downloading failled');
                status.downloading = false;
                io.emit('status', { ...status });
            }
        });

        downloaderProcess.on('error', function (e) {
            console.log('child process error' + e);
            socket.emit('fatal', 'ffmpeg error!' + e);
        });

        downloaderProcess.on('exit', function (e) {
            console.log('child process exit' + e);
            socket.emit('fatal', 'ffmpeg exit!' + e);
        });
    });

    socket.on('stopDownloading', function () {
        if (downloaderProcess)
            try {
                downloaderProcess.stdin.end();
                downloaderProcess.kill('SIGINT');
            } catch (e) { console.warn('killing downloading process attempt failed...', e); }
    });

    io.emit('status', { ...status });
});


server.listen(4000, () => {
    console.log('Server is live on port 4000');
});