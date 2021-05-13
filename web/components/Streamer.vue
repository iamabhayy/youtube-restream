<template>
  <b-card no-body  style="overflow: hidden;">
      <video src="http://localhost:4000/output.mp4" controls></video>
      <small class="text-muted px-3 pt-3">Downloaded 3 mins ago</small>
      <hr>
      <div class="px-3 pb-3">
        <b-form-group
            id="input-group-1"
            label="RTMP url:"
            label-for="input-1">

            <b-form-input
                id="input-1"
                v-model="form.rtmpUrl"
                type="text" disabled />
        </b-form-group>

        <b-form-group
            id="input-group-1"
            label="Streaming Key:"
            label-for="input-1"
            description="We'll never share your email with anyone else.">

            <b-form-input
                id="input-1"
                v-model="form.streamingKey"
                type="text" disabled readonly />
        </b-form-group>

        <div class="mt-4" v-if="!streaming">
            <b-button block size="lg" variant="danger" @click="startStreaming">Start Streaming</b-button>
            <hr data-content="OR" class="hr-text my-4">
            <b-button block size="lg" to="/admin/broadcast">Live Broadcasting</b-button>
        </div>
        <div v-else>
            <b-button block size="lg" variant="danger" @click="stopStreaming">Stop Streaming</b-button>
        </div>
      </div>
  </b-card>
</template>

<script>
import socket from '~/plugins/socket.io';

export default {
    props: {
        streaming: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            form: {
                channelId: '',
                rtmpUrl: 'rtmp://a.rtmp.youtube.com/live2',
                streamingKey: this.$store.state.setting.rtmpKey
            }
        }
    },

    methods: {
        startStreaming(){
            socket.emit('startStream', { isBroadcasting: false });
        },
        
        stopStreaming(){
            socket.emit('stopStream');
        }
    },
}
</script>

<style>
hr.solid {
    border-top: 1px solid #999;
}

hr.hr-text {
  position: relative;
    border: none;
    height: 1px;
    background: #999;
}

hr.hr-text::before {
    content: attr(data-content);
    display: inline-block;
    background: #fff;
    font-weight: bold;
    font-size: 0.85rem;
    color: #999;
    border-radius: 30rem;
    padding: 0.2rem 2rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>