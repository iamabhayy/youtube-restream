<template>
  <div>
    <MainNavBar />
    <div class="container mt-5">
      <b-row>
        <div class="col-7">
          <DownloaderForm channelId="UCMn-zv1SE-2y6vyewscfFqw" :downloading="status.downloading" />
          <Logger class="mt-3"/>
        </div>
        <div class="col-5">
          <Streamer :streaming="status.streaming" />
        </div>
      </b-row>
  </div>
  </div>
</template>

<script>
import socket from '~/plugins/socket.io';
export default {
  data() {
    return {
      status: {}
    }
  },

  mounted(){
      socket.on('status', (data)=> {
          this.status = data;
          console.log('status', data);
      })
  }
}
</script>