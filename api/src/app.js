import express from 'express';
import dateFormat from 'dateformat';
import { createServer } from "http";
import { Server } from "socket.io";
import { fork, spawn} from 'child_process';

const app = express();
const server = createServer(app);

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

var downloaderInfo = {
    downloading: false, 
};


var ffmpegProcess;
var downloaderProcess;

io.on("connection", (socket) => {
    console.log('Socket connected');

    socket.on('startRtmpStream', (data)=>{
        if(streamInfo.live){
            console.log('oops');
            socket.emit('fatal','stream already started.');
			return;
        }

        // Check that video file exiest
        var file = 'test.mkv'

        // Check that rtmpKey exiest
        var rtmpUrl = 'rtmp://localhost/live/test';

        // TODO Get reStreaming settings from database

        // Change ffmpeg args acording to restream settings
        var options = [
            '-re', 
            '-stream_loop', 
            '-1', '-i', '/stream/test.mkv', 
            '-vf', 'scale=1280:720', '-b:v', '1M', '-b:a', '64k', 
            '-preset', 'veryfast', '-g', '30', '-r', '30', 
            '-flvflags', 
            'no_duration_filesize', 
            '-f', 'flv',
            rtmpUrl
        ];

        // Start streaming from video file on server to youtube with ffmpeg new settings

        ffmpegProcess = spawn('ffmpeg', options);

        // Change streaming status to true and streaming source to RTMP
        streamInfo.source = "RTMP";
        streamInfo.live = true;

        ffmpegProcess.stderr.on('data',function(d){
			socket.emit('ffmpeg_stderr',''+d);
		});

        ffmpegProcess.stdout.on('data',function(d){
			console.log(d);
		});


		ffmpegProcess.on('error',function(e){
			console.log('child process error'+e);
			socket.emit('fatal','ffmpeg error!'+e);
			streamInfo.live=false;
			socket.disconnect();
		});

		ffmpegProcess.on('exit',function(e){
			console.log('child process exit'+e);
			socket.emit('fatal','ffmpeg exit!'+e);
            streamInfo.live=false;
			socket.disconnect();
		});
        
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
        console.log('Downloading start');

        const channelId = 'UCMn-zv1SE-2y6vyewscfFqw';
        const youtubeUrl = `https://www.youtube.com/channel/${channelId}`
        const dayCount = 6;

        const dateBefore = dateFormat(Date.now(), 'yyyymmdd');
        const date = new Date();
        const dateAfter = dateFormat(date.setDate(date.getDate()-6), 'yyyymmdd');


        // Change ffmpeg args acording to restream settings
        var options = [
            '-i',
            '--dateafter', dateAfter,
            '--datebefore', dateBefore,
            youtubeUrl
        ];

        // Start streaming from video file on server to youtube with ffmpeg new settings
        downloaderProcess = spawn('youtube-dl', options);

        // Change streaming status to true and streaming source to RTMP
        downloaderInfo.downloading = true;

        downloaderProcess.stderr.on('data',function(d){
            console.log(d);
			socket.emit('ffmpeg_stderr',''+d);
		});

		downloaderProcess.on('error',function(e){
			console.log('child process error'+e);
			socket.emit('fatal','ffmpeg error!'+e);
			downloaderInfo.downloading = false;
			socket.disconnect();
		});

		downloaderProcess.on('exit',function(e){
			console.log('child process exit'+e);
			socket.emit('fatal','ffmpeg exit!'+e);
            downloaderInfo.downloading = false;
			socket.disconnect();
		});
    });

    socket.on('stopDownloading', function () {
		console.log("socket disconnected!");
		if(downloaderProcess)
		try{
            downloaderProcess.stdin.end();
			downloaderProcess.kill('SIGINT');
            streamInfo.live=false;
			console.log("ffmpeg process ended!");
		}catch(e){console.warn('killing ffmoeg process attempt failed...');}
	});
});

server.listen(4000, () => {
    console.log('Server is live on port 4000');
});