<template>
  <div>
        <b-button variant="warning" pill size="lg" class="mx-3 px-4" @click="startBroadcasting" v-if="!streamingStatus">Publish</b-button>
        <b-button variant="danger" pill size="lg" class="mx-3 px-4" @click="stopBroadcasting" v-else>Stop</b-button>
  </div>
</template>

<script>
export default {
    props: {
        streamingStatus: {
            type: Boolean,
            default: false
        }
    },

    methods: {
        startBroadcasting() {
            this.$parent.startRecording();
        },

        stopBroadcasting() {
            this.$parent.stopRecording();
        }
    },
}
</script>