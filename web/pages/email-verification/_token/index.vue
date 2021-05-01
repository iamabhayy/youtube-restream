<template>
  <div class="signup-testimonials mx-auto mt-5 px-3">
    <b-card title="Welcome back! Log in to Customer.io">
      <b-button variant="success" class="ml-auto d-block">Email verified <i class="fas fa-chevron-right ml-2"></i></b-button>
    </b-card>

    <div class="my-4 p-3 bg-dark rounded  panel-bg">
      <strong class="d-block">Don't have an account yet?</strong>
      <nuxt-link to="sign-up">Sign up</nuxt-link> or <nuxt-link to="/forget-password">Forget password</nuxt-link> to start your free trial.
    </div>
  </div>
</template>

<script>
export default {
    layout: 'main',
    data() {
      return {
        form: {
          email: '',
          password: ''
        }
      }
    },
}
</script>