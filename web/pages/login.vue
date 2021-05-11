<template>
  <div class="signup-testimonials mx-auto mt-5 px-3">
    <b-card title="Welcome back! Log in to Customer.io">
      <div class="my-4">
        <b-form-group
        id="input-group-1"
        label="Email address:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="form.email"
          type="email"
          placeholder="Enter email"
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

      <b-button variant="success" class="ml-auto d-block" @click="login()" :disabled="busy">Login in to Streamer <i :class="busy? 'ml-2 fas fa-circle-notch fa-spin' : 'ml-2 fas fa-chevron-right'"></i></b-button>

    </b-card>

    <div class="my-4 p-3 bg-dark rounded  panel-bg">
      <strong class="d-block">Don't have an account yet?</strong>
      Contact admin to create a new account for yourself.
    </div>
  </div>
</template>

<script>
import axios from 'axios';

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
      login() {
        if(this.form.email && this.form.password){
          this.busy = true;
          axios.post('http://localhost:4000/login', {
            email: this.form.email,
            password: this.form.password
          }).then((response)=> {
            console.log(response);
            this.busy = false;

            this.$cookies.set('token', response.data.token, {
              path: '/',
              maxAge: 60 * 60 * 24 * 7
            });

            this.$store.commit('setUser', {user: response.data.user});

            this.$router.push('/admin/dashboard')
          })
          .catch((error) => {
            console.log(error);
            this.busy = false;
          });
        }
      },
    },
}
</script>