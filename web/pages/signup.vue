<template>
  <div class="signup-testimonials mx-auto mt-5 px-3">
    <b-card title="Try Study Hunt free for 14 days.">
        <p class="small">Send automated messages people like to receive. No credit card required, cancel anytime.</p>

      <div class="my-4">
        <b-form-group id="input-group-2" label="Your Name:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.name"
          placeholder="Enter name"
          required
        ></b-form-input>
      </b-form-group>

        <b-form-group
        id="input-group-1"
        label="Work email:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="form.email"
          type="email"
          placeholder="example@gmail.com"
          required
        ></b-form-input>
      </b-form-group>

       <b-form-group id="input-group-2" label="Password:" label-for="input-2">
        <b-form-input
          id="input-2"
          type="password"
          v-model="form.password"
          placeholder="Enter password"
          required
        ></b-form-input>
      </b-form-group>
      </div>

      <b-button variant="success" class="ml-auto d-block" @click="signup" :disabled="busy">Start free trial <i :class="busy? 'ml-2 fas fa-circle-notch fa-spin' : 'ml-2 fas fa-chevron-right'"></i></b-button>
    </b-card>

    <div class="my-4 p-3 bg-dark rounded  panel-bg">
      <strong class="d-block">Don't have an account yet?</strong>
      <nuxt-link to="/login">Sign in</nuxt-link> or <nuxt-link to="/forget-password">Forget password</nuxt-link> to start your free trial.
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
      signup() {
        this.busy = true;
        setTimeout(()=>{
          this.$router.push('/admin/dashboard')
          this.busy = false;
        }, 2000)
      }
    },
}
</script>