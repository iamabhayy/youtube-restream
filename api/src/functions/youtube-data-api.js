import axios from 'axios';

export default async function getOptions(days) {
    // Load from database
    const channelId = 'UCj3Eqiob8ju1Z3RCJpNMdig';
    const youtubeApi = 'AIzaSyDMMUdLMnw-lqZrbSsIBlJZulF7HbdNAww';
    const limit = 20;

    const {data} = await axios.get(`https://www.googleapis.com/youtube/v3/search?key=${youtubeApi}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${limit}`)

    var dte = new Date();
    dte.setDate(dte.getDate() - days);
    const dateBefore = Date.parse(dte);

    var list = [];

    data.items.forEach((item)=>{
        var publishedAt = Date.parse(item.snippet.publishedAt);
        if(publishedAt >= dateBefore){
            list.push(`https://www.youtube.com/watch?v=${item.id.videoId}`);
        }
    })

    return (['-i', '-f' ,'bestvideo+bestaudio[ext=m4a]/bestvideo+bestaudio/best', '-o', 'videos/%(id)s.%(ext)s',].concat(...list))
}