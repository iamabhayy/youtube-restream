import axios from 'axios';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const adapter = new FileSync('db.json')
const db = low(adapter)

export default async function getOptions(days) {
    
    // Load from database
    const setting = db.get('setting').value();

    const channelId = setting.channelId;
    const youtubeApi = setting.apiKey;
    const limit = 20;

    console.log(setting, youtubeApi);

    const {data} = await axios.get(`https://www.googleapis.com/youtube/v3/search?key=${youtubeApi}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${limit}`)

    console.log(data);

    var dte = new Date();
    dte.setDate(dte.getDate() - days);
    const dateBefore = Date.parse(dte);

    var list = [];

    data.items.forEach((item)=>{
        var publishedAt = Date.parse(item.snippet.publishedAt);
        if(publishedAt >= dateBefore && item.snippet.liveBroadcastContent != "live"){
            list.push(`https://www.youtube.com/watch?v=${item.id.videoId}`);
        }
    })

    return (['-i', '-f' , '22', '-o', 'videos/%(id)s.%(ext)s',].concat(...list))
}