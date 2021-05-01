<template>
  <div class="signup-testimonials mx-auto mt-5 px-3">
    <b-card title="Reset your password">
      <b-form-group
        id="input-group-1"
        class="my-4"
        label="Email address:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="form.email"
          type="email"
          placeholder="example@gmail.com"
          required>
        </b-form-input>
      </b-form-group>

      <b-button variant="success" class="ml-auto d-block" @click="resetPassword" :disabled="busy">Send reset instructions <i :class="busy? 'ml-2 fas fa-circle-notch fa-spin' : 'ml-2 fas fa-chevron-right'"></i></b-button>
    </b-card>

    <div class="my-4 p-3 bg-dark rounded  panel-bg">
      <strong class="d-block">Don't have an account yet?</strong>
      <nuxt-link to="/signup">Sign up</nuxt-link> or <nuxt-link to="/login">Sign in</nuxt-link> to start your free trial.
    </div>
  </div>
</template>

<script>
export default {
    layout: 'main',
    data() {
      return {
        busy: false,
        form: {
          email: '',
          password: ''
        }
      }
    },
    methods: {
      resetPassword() {
        this.busy = true;
        setTimeout(()=>{
          this.$router.push('/admin/dashboard')
          this.busy = false;
        }, 2000)
      }
    },
}
</script>