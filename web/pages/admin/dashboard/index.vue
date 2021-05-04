<template>
  <div class="container mt-5">
      <div>
        <b-button variant="success" @click="startDownloading">Start Downloading</b-button>
        <b-button variant="danger" @click="stopDownloading">Stop Downloading</b-button>
        <b-button variant="success" class="ml-5" @click="startStreaming">Start Stream</b-button>
        <b-button variant="danger" @click="stopStreaming">Stop Stream</b-button>
      </div>
  </div>
</template>

<script>
import socket from '~/plugins/socket.io';
export default {
  methods: {
    startDownloading() {
      socket.emit('startDownloading');
    },
    stopDownloading(){
      socket.emit('stopDownloading');
    },

    startStreaming(){
      socket.emit('startRtmpStream');
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