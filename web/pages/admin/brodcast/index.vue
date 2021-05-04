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
                <button type="button" class="btn btn-primary btn-lg btn-circle">
                    <i class="fas fa-microphone"></i>
                </button>
                <button type="button" class="btn btn-warning btn-lg btn-circle mx-3" @click="startRecording">Publish</button>
                <button type="button" class="btn btn-success btn-lg btn-circle" @click="stopRecording">
                    <i class="fas fa-video"></i>
                </button>
            </div>
        </div>

        <div class="card mt-4">
            <div class="card-body">
                <h6 class="card-title">Your live streaming youtube url</h6>
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
    data() {
        return {
            videoEl: null,
            mediaRecorder: null,
            url: 'https://www.youtube.com/channel/UCN7dywl5wDxTu1RM3eJ_h9Q/videos',
            constraints :{
                audio: true,
                video: {
                    width: {exact: 1280}, 
                    height: {exact: 720},
                }
            }
        }
    },

    methods: {
        handleSuccess(stream) {
            window.stream = stream; // make stream available to browser console
            this.videoEl.srcObject = stream;
        },

        startRecording() {
            const mimeType = 'video/webm;codecs=vp9,opus';
            const options = {mimeType};

            try {
                this.mediaRecorder = new MediaRecorder(window.stream, options);
            } catch (e) {
                console.error('Exception while creating MediaRecorder:', e);
                errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
                return;
            }

            console.log('Created MediaRecorder', this.mediaRecorder, 'with options', options);

            this.mediaRecorder.onstop = (event) => {
                console.log('Recorder stopped: ', event);
            };

            this.mediaRecorder.ondataavailable = this.handleDataAvailable;
            this.mediaRecorder.start(1000);

            console.log('MediaRecorder started', this.mediaRecorder);
        },

        stopRecording(){
            this.mediaRecorder.stop();
        },

        handleDataAvailable(event) {
            console.log('handleDataAvailable', event);
            if (event.data && event.data.size > 0) {
                socket.emit('webrtcStream', event.data)
            }
        },

        handleError(error) {
            console.log(error);
            console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
        }
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

    .btn-circle {
        border-radius: 25px;
        padding-left: 16px;
        padding-right: 16px;
        text-align: center;
    }
</style>