<template>
  <section>
    <nav class="navbar navbar-light bg-light justify-content-between border-bottom">
        <a class="navbar-brand">Brodcast</a>
        <BrodcastSettings />
    </nav>

    <div class="container my-5">
        <div class="position-relative">
            <video playsinline autoplay width="100%" id="myStream" height="56.25%" class="border" muted></video>
            <span class="badge badge-danger m-4 p-2 stream-status">Live</span>
            <div class="d-flex justify-content-center align-items-center my-4 action">
                <AudioButton :audioStatus="constraints.audio" />
                <BroadcastButton :streamingStatus="streamingStatus"/>
                <VideoButton :videoStatus="true" />
            </div>
        </div>

        <div class="card mt-4">
            <div class="card-body">
                <h6 class="card-title">Your live streaming rtmp url</h6>
                <div class="input-group mb-3">
                    <input type="text" class="form-control" disabled v-model="url" aria-describedby="basic-addon2">
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary" type="button">Copy</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </section>
</template>

<script>
// import 'webrtc-adapter';
import socket from '~/plugins/socket.io';
export default {
    middleware: 'auth',

    data() {
        return {
            videoEl: null,
            streamingStatus: false,
            mediaRecorder: null,
            url: `rtmp://a.rtmp.youtube.com/live2/${this.$store.state.setting.rtmpKey}`,
            constraints :{
                audio: true,
                video: {
                    width: {exact: 1920}, 
                    height: {exact: 1080},
                }
            }
        }
    },

    methods: {
        startRecording() {
            const mimeType = 'video/webm;codecs=vp9,opus';
            const options = {mimeType};

            try {
                this.mediaRecorder = new MediaRecorder(window.stream, options);
                this.streamingStatus = true;
            } catch (e) {
                console.error('Exception while creating MediaRecorder:', e);
                errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
                return;
            }

            console.log('Created MediaRecorder', this.mediaRecorder, 'with options', options);

            this.mediaRecorder.onstop = (event) => {
                console.log('Recorder stopped: ', event);
                this.streamingStatus = false;
            };

            this.mediaRecorder.ondataavailable = this.handleDataAvailable;
            this.mediaRecorder.start(1000);

            socket.emit('startStream', {isBroadcasting: true});
            
            console.log('MediaRecorder started', this.mediaRecorder);
        },

        stopRecording(){
            this.mediaRecorder.stop();
        },

        enableAudio(){
            this.constraints.audio = true;
            console.log(this.mediaRecorder);
        },

        disableAudio(){
            this.constraints.audio = false;
            console.log(this.constraints);
        },

        enableVideo(){
            this.constraints.video = true;
            console.log(this.constraints);
        },

        disableVideo(){
            this.constraints.video = false;
            console.log(this.constraints);
        },


        // Calback function for webrtc

        handleSuccess(stream) {
            window.stream = stream; // make stream available to browser console
            this.videoEl.srcObject = stream;
        },

        handleError(error) {
            console.log(error);
            console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
        },

        handleDataAvailable(event) {
            console.log('handleDataAvailable', event);
            if (event.data && event.data.size > 0) {
                socket.emit('broadcastStream', event.data)
            }
        },
    },

    mounted() {
        this.videoEl = document.querySelector('#myStream');
        navigator.mediaDevices.getUserMedia(this.constraints).then(this.handleSuccess).catch(this.handleError);
    }
}
</script>

<style scoped>
    video{
        border: 1px solid #EEFBFB;
        overflow: hidden;
        border-radius: 8px;
    }

    .stream-status{
        position: absolute;
        top: 0px;
        left: 0px;
    }

    .action{
        position: absolute;
        bottom: 0px;
        width: 100%;
        background-color: transparent;
    }
</style>