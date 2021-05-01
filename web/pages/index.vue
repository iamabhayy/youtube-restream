<template>
  <div class="">
    <div>
      <b-jumbotron>
        <h2>BootstrapVue</h2>

        <p>
          This is a simple hero unit, a simple jumbotron-style component for calling extra attention to
          featured content or information.
        </p>

        <hr class="my-4">

        <p>
          It uses utility classes for typography and spacing to space content out within the larger
          container.
        </p>

        <div class="mt-4">
          <b-button variant="primary" to="/login" href="#">Login</b-button>
        <b-button variant="success" to="/signup" href="#">Signup</b-button>
        </div>
      </b-jumbotron>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'main'
}
</script>