<template>
  <div>
        <b-button variant="primary" pill size="lg" @click="disableAudio" v-if="audioStatus" >
            <i class="fas fa-microphone"></i>
        </b-button>

        <b-button variant="primary" pill size="lg" @click="enableAudio" v-else >
            <i class="fas fa-microphone-slash"></i>
        </b-button>
  </div>
</template>

<script>
export default {
    props: {
        audioStatus: {
            type: Boolean,
            default: true
        }
    },

    methods: {
        disableAudio() {
            this.$parent.disableAudio();
        },

        enableAudio() {
            this.$parent.enableAudio();
        }
    },
}
</script>