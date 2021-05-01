const spawn = require('child_process').spawn;

function videoDownloader(url){
    const promise = new Promise((resolve, reject) => {
        const yDownloader = spawn('youtube-dl', ['-o', `test.mp4`, 'https://www.youtube.com/watch?v=q919ksBxCJA&ab_channel=CrackerMilk']);

        yDownloader.stderr.on('data', (data) => {
            console.log(`${data}`);
            reject();
        });

        yDownloader.on('close', (code) => {
            resolve();
        });
    });
    return promise;
}


process.on('message', (message)=>{
    console.log(trigger);
    videoDownloader()
    .then(
        ()=>{
            console.log('Video downloaded')
            process.send(true)
        }, 
        (err)=>{
            console.log(err);
            process.send(false);
        })
})