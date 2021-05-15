<template>
  <div>
        <b-button variant="success" pill size="lg" @click="disableVideo" v-if="videoStatus" >
            <i class="fas fa-video"></i>
        </b-button>

        <b-button variant="success" pill size="lg" @click="enableVideo" v-else >
            <i class="fas fa-video-slash"></i>
        </b-button>
  </div>
</template>

<script>
export default {
    props: {
        videoStatus: {
            type: Boolean,
            default: true
        }
    },

    methods: {
        disableVideo() {
            this.$parent.disableVideo();
        },

        enableVideo() {
            this.$parent.enableVideo();
        }
    },
}
</script>