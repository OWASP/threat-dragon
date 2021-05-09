<template>
  <div>
    <td-navbar />
    <b-container fluid id="app">
      <router-view />
    </b-container>
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Ubuntu:400,700");

#app {
  font-family: "Ubuntu", Tahoma, "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 20px;
  line-height: 1.42857143;
  color: $font-color;
  background-color: #ffffff;
  margin-top: 10vh;
}
</style>

<script>
import TdNavbar from '@/components/Navbar.vue';

export default {
    name: 'TdApp',
    components: {
        TdNavbar
    }
};
</script>
