<template>
  <div>
    <b-button v-b-modal.modal-1>Settings</b-button>
    <b-modal @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
      id="modal-1" 
      size="lg" 
      title="BootstrapVue">

      <p class="my-4">Hello from modal!</p>
    </b-modal>
  </div>
</template>

<script>
export default {
  methods: {
      checkFormValidity() {
        const valid = this.$refs.form.checkValidity()
        this.nameState = valid
        return valid
      },
      resetModal() {
        
      },
      handleOk(bvModalEvt) {
        bvModalEvt.preventDefault()
        this.handleSubmit()
      },
      handleSubmit() {
        this.$nextTick(() => {
          this.$bvModal.hide('modal-1')
        })
      }
  },
}
</script>

<style>

</style>