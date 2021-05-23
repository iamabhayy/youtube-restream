import fs from 'fs';
import {spawn} from 'child_process';

var list = [];
const videoDirectory = 'videos/';
var outputFilePath = 'stream/output.mp4'

export default function mergeVideo() {
    fs.readdir(videoDirectory, (err, files) => {
        if(err) return;

        files.forEach((file, idx) => {
            list.push('-i');
            list.push((videoDirectory+file).toString());
        });

        var filterComplex = "";

        for (let index = 0; index < list.length/2; index++) {
            filterComplex = filterComplex+`[${index}:v:0][${index}:a:0]`;
        }

        filterComplex = filterComplex+`concat=n=${list.length/2}:v=1:a=1[video_out][audio_out]`;
        const command = [...list, '-filter_complex', filterComplex, '-map', "[video_out]", '-map', "[audio_out]", outputFilePath]
        console.log(command);

        const merg_process = spawn('ffmpeg', command)

        merg_process.stderr.on('data', (res) => {
            console.log(res);
        });

        merg_process.on('close', (code) => {
            if (code == 0) {
                console.log("videos are successfully merged")

                fs.readdir(videoDirectory, (err, files) => {
                    if (err) throw err;
                    for (const file of files) {
                        fs.unlinkSync(path.join(videoDirectory, file));
                    }
                    console.log('Directory clened');
                });

            } else {
                console.log('Video merge failled');
            }
        });

        merg_process.on('error', (error) => {
            console.log('child process error' + error);
        });

        merg_process.on('exit', (error) => {
            console.log('child process exit' + error);
        });
    });
}

