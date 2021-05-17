<template>
  <div>
    <MainNavBar />
    <h3>Profile</h3>
  </div>
</template>

<script>
export default {
  middleware: "admin-auth",
}
</script>

<style>

</style>