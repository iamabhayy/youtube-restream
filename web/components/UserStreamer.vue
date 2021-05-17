<template>
  <div>

  </div>
</template>

<script>
export default {
    props: {
        streaming: {
            type: Boolean,
            default: false,
        },
    },

    methods: {
        startStreaming(){
            socket.emit('startStream', { isBroadcasting: false });
        },
    },
}
</script>

<style>

</style>