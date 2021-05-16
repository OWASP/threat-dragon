<template>
  <div>
    <td-navbar />
    <b-container fluid id="app">
    <b-alert show variant="danger">
        This is version <strong>2.0</strong> of OWASP Threat Dragon and is still under development.  Do not use this to edit existing models, as this version could break them!
    </b-alert>
      <b-overlay style="max-height: 100vh;" :show="isLoading" spinner-variant="primary">
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
import { mapState } from 'vuex';

import { LOADER_FINISHED } from '@/store/actions/loader.js';
import TdNavbar from '@/components/Navbar.vue';

export default {
    name: 'TdApp',
    components: {
        TdNavbar
    },
    computed: mapState({
        isLoading: (state) => state.loader.loading
    }),
    mounted() {
        this.$store.dispatch(LOADER_FINISHED);
    }
};
</script>
