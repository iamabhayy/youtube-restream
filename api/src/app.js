import express from 'express';
import dateFormat from 'dateformat';
import { createServer } from "http";
import { Server } from "socket.io";
import { fork, exec, spawn} from 'child_process';

import mergeVideo from './functions/video-merge';

const app = express();
const server = createServer(app);


app.use(express.static('stream'));

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

var streamInfo = {
    live: false, 
    source: null,
}; 

var downloading = false;


var ffmpegProcess;
var downloaderProcess;

io.on("connection", (socket) => {
    console.log('Socket connected');

    socket.on('startStream', (data) => {

        if(streamInfo.live){
            console.log('oops');
            socket.emit('fatal','stream already started.');
			return;
        }

        // Check that rtmpKey exiest
        var rtmpUrl = 'rtmp://a.rtmp.youtube.com/live2/dexv-s07x-50cu-z7r1-3aaq';

        // TODO Get reStreaming settings from database

        var options = [
            '-re', 
            '-stream_loop', 
            '-1', '-i', 'stream/output.mp4', 
            '-vf', 'scale=1280:720', '-b:v', '1M', '-b:a', '64k', 
            '-preset', 'veryfast', '-g', '30', '-r', '30', 
            '-flvflags', 
            'no_duration_filesize', 
            '-f', 'flv',
            rtmpUrl
        ];
        
        streamInfo.source = "RTMP";

        if(data.isBroadcasting){
            streamInfo.source = "WebRTC";
            options = [
                '-i','-',
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
        streamInfo.live = true;

        ffmpegProcess.stderr.on('data', (res) => {
			socket.emit('ffmpeg_stderr',''+res);
		});

        ffmpegProcess.stdout.on('data', (res) => {
			console.log(res);
		});

		ffmpegProcess.on('error', (err) => {
			console.log('child process error'+err);
			socket.emit('fatal','ffmpeg error!'+err);

			streamInfo.live=false;
			socket.disconnect();
		});

		ffmpegProcess.on('exit', (err) => {
			console.log('child process exit'+err);
			socket.emit('fatal','ffmpeg exit!'+err);

            streamInfo.live=false;
			socket.disconnect();
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
		if(ffmpegProcess)
		try{
            ffmpegProcess.stdin.end();
			ffmpegProcess.kill('SIGINT');
            streamInfo.live=false;
			console.log("ffmpeg process ended!");
		}catch(e){console.warn('killing ffmoeg process attempt failed...');}
	});


    //TODO! Video downloader socket connection

    socket.on('startDownloading', (data)=>{

        if(downloading){
            socket.emit('fatal','Previous downloading in progress.');
            return;
        }

        console.log('Downloading start');

        const channelId = 'UCMn-zv1SE-2y6vyewscfFqw';
        const youtubeUrl = `https://www.youtube.com/channel/${channelId}`
        const dayCount = 6;

        const dateBefore = dateFormat(Date.now(), 'yyyymmdd');
        const date = new Date();
        const dateAfter = dateFormat(date.setDate(date.getDate()-dayCount), 'yyyymmdd');


        // Change ffmpeg args acording to restream settings
        var options = [
            '-i',
            '-o', 'videos/%(title)s.%(ext)s',
            '--dateafter', dateAfter,
            '--datebefore', dateBefore,
            youtubeUrl
        ];

        // Start streaming from video file on server to youtube with ffmpeg new settings
        downloaderProcess = spawn('youtube-dl', options);

        // Change streaming status to true and streaming source to RTMP
        downloading = true;

        downloaderProcess.stderr.on('data',function(d){
            console.log(d);
			socket.emit('ffmpeg_stderr',''+d);
		});

        downloaderProcess.on('close', (code)=>{
            console.log(code);
            if(code==0){
                console.log('Downloading complete');
                mergeVideo();
            }else{
                console.log('Downloading failled');
            }
        });

		downloaderProcess.on('error',function(e){
			console.log('child process error'+e);
			socket.emit('fatal','ffmpeg error!'+e);
			downloading = false;
			socket.disconnect();
		});

		downloaderProcess.on('exit',function(e){
			console.log('child process exit'+e);
			socket.emit('fatal','ffmpeg exit!'+e);
            downloading = false;
			socket.disconnect();
		});
    });

    socket.on('stopDownloading', function () {
		console.log("socket disconnected!");
		if(downloaderProcess)
		try{
            downloaderProcess.stdin.end();
			downloaderProcess.kill('SIGINT');
            downloading = false;
			console.log("Downloading stop");
		}catch(e){console.warn('killing downloading process attempt failed...', e);}
	});
});

server.listen(4000, () => {
    console.log('Server is live on port 4000');
});