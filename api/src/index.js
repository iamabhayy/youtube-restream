import express from 'express';
import { createServer } from "http";
import { Server } from "socket.io";
import { fork, spawn} from 'child_process';


var downloading = false;
var streaming = false;

const app = express();
// const server = createServer(app);

// const io = new Server(server, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"]
//     }
// });

// io.on("connection", (socket) => {
//     console.log('Socket connected');

//     socket.on('download', (data)=>{
//         console.log(data);
//         videoDownloader(url);
//         console.log('downloaded');
//     })
// });

// server.listen(4000, () => {
//     console.log('Server is live on port 4000');
// });


function videoDownloader(url){
    const promise = new Promise((resolve, reject) => {
        downloading = true;
        const yDownloader = spawn('youtube-dl', ['-o', `test`, 'https://www.youtube.com/watch?v=q919ksBxCJA&ab_channel=CrackerMilk']);

        yDownloader.stderr.on('data', (data) => {
            console.log(`${data}`);
        });

        yDownloader.on('close', (code) => {
            downloading = false;
            resolve();
        });
    });
    return promise;
}

function streamVideo(rtmpUrl){
    const promise = new Promise((resolve, reject) => {
        streaming = true;
        const reStream = spawn('ffmpeg', ['-re', 
            '-stream_loop', 
            '-1', '-i', 'test.mkv', 
            '-vf', 'scale=1280:720', '-b:v', '1M', '-b:a', '64k', 
            '-preset', 'veryfast', '-g', '30', '-r', '30', 
            '-flvflags', 
            'no_duration_filesize', 
            '-f', 'flv', 
            rtmpUrl
        ]);

        reStream.stderr.on('data', (data) => {
            console.log(`${data}`);
        });

        reStream.on('close', (code) => {
            streaming = false;
            resolve();
        });
    });
    return promise;
}


app.get('/download', async (req, res) => {
    try {
        console.log('video downloading start');
        videoDownloader();
        res.send('video downloading start')
    } catch (error) {
        res.send(`Video downloading failed ${error}`)
    }
})

app.get('/status', async (req, res) => {
    res.send(`Video downloading is ${downloading}`)
})

app.get('/stream', async (req, res) => {
    try {
        console.log('video streaming start');
        streamVideo('rtmp://localhost/live/test')
        res.send('video start streaming')
    } catch (error) {
        res.send(`Video streaming failed ${error}`)
    }
})

app.get('/status-stream', async (req, res) => {
    res.send(`Video downloading is ${streaming}`)
})

app.listen(3000)