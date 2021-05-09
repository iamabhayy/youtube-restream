<template>
    <b-card no-body>
        <div class="p-4">
            <h5 class="card-title mb-0">Download youtube videos</h5>
            <p class="card-text my-0 py-0">With supporting text below as a natural lead-in to additional content.</p>
            <div class="py-4">
                <b-input-group>
                    <b-form-input :value="`https://www.youtube.com/channel/${channelId}`" disabled readonly />
                    <b-input-group-append>
                        <b-button variant="info">Open</b-button>
                    </b-input-group-append>
                </b-input-group>
            </div>
            <div class="d-flex justify-content-between">
                <b-input-group append="Days" style="width:120px">
                    <b-form-input v-model="days" type="number" min="1" :disabled="downloading" />
                </b-input-group>
                
                <div class="d-flex">
                    <b-button variant="success" class="mr-2" @click="startDownloading()" :disabled="downloading">{{ downloading? 'Downloading' : 'Start Downloading' }}<i :class="downloading? 'ml-2 fas fa-circle-notch fa-spin' : ''"></i></b-button>
                    <b-button variant="danger" @click="stopDownloading()" v-if="downloading">Cancel</b-button>
                </div>
            </div>
        </div>
    </b-card>
</template>

<script>
import socket from '~/plugins/socket.io';

export default {
    props: {
        channelId: String,
        downloading: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            days: 2,
        }
    },

    methods: {
        startDownloading() {
            // socket.emit('startDownloading');
            this.downloading = true;
        },
        stopDownloading(){
            // socket.emit('stopDownloading');
            this.downloading = false;
        },
    },
}
</script>