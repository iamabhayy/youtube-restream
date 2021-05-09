<template>
  <div>
    <MainNavBar />
    <div class="container mt-5">
      <b-row>
        <div class="col-7">
          <DownloaderForm channelId="UCMn-zv1SE-2y6vyewscfFqw" :downloading="false" />
          <Logger class="mt-3"/>
        </div>
        <div class="col-5">
          <Streamer/>
        </div>
      </b-row>
  </div>
  </div>
</template>

<script>
import socket from '~/plugins/socket.io';
export default {
  methods: {
    

    startStreaming(){
      socket.emit('startStream', { isBroadcasting: false });
    },
    stopStreaming(){
      socket.emit('stopStream');
    }
  },

  mounted(){
    socket.on('ffmpeg_stderr', (data)=>{
      console.log(data);
    })
  }

}
</script>