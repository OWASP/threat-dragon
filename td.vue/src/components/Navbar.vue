<template>
  <nav class="navbar fixed-top">
    <a class="navbar-brand" href="#">
      <b-img src="@/assets/threatdragon_logo.svg" alt="Threat Dragon Logo" />
    </a>
  </nav>
</template>

<style lang="scss" scoped>
.navbar {
    background-color: $theme-primary;
    border-color: $theme-secondary;
}
</style>

<script>
export default {
  name: 'TdNavbar'
}
</script>
