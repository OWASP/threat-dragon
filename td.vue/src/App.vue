<template>
  <div>
    <td-navbar />
    <b-container fluid id="app">
      <b-overlay :show="false" spinner-variant="primary">
        <router-view />
      </b-overlay>
    </b-container>
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Ubuntu:400,700");

#app {
  font-size: 20px;
  line-height: 1.42857143;
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
