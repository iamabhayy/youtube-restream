import fs from 'fs';
import path from 'path';
import {exec} from 'child_process';
import fileExtension from 'file-extension'; 

const videoDirectory = 'videos/';

var list = ""
var listFilePath = 'src/functions/list.txt'
var outputFilePath = 'stream/output.mp4'

export default function mergeVideo() {
    fs.readdir(videoDirectory, (err, files) => {
        files.forEach((file, idx) => {
            fs.renameSync(`${videoDirectory+file}`, `${videoDirectory+idx+'.'+fileExtension(file)}`)
            list += `file ../../${videoDirectory+idx+'.'+fileExtension(file)}`
            list += "\n"
        });
    
        var writeStream = fs.createWriteStream(listFilePath);
        writeStream.write(list);
        writeStream.end();
    
        exec(`ffmpeg -y -safe 0 -f concat -i ${listFilePath} -c copy ${outputFilePath}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            else {
                console.log("videos are successfully merged")
                fs.readdir(videoDirectory, (err, files) => {
                    if (err) throw err;
                    for (const file of files) {
                        fs.unlinkSync(path.join(videoDirectory, file));
                    }
                    console.log('Directory clened');
                });
            }
        })
    });
}

