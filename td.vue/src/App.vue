<template>
  <div>
    <td-navbar />
    <b-container fluid id="app">
      <td-overlay style="max-height: 100vh;" :show="isLoading">
        <router-view />
      </td-overlay>
    </b-container>
  </div>
</template>

<style lang="scss">
#app {
  margin-top: ($header-height + 15px);
}
</style>

<script>
import { mapState } from 'vuex';

import { LOADER_FINISHED } from '@/store/actions/loader.js';
import TdNavbar from '@/components/Navbar.vue';
import TdOverlay from '@/components/Overlay.vue';

export default {
    name: 'TdApp',
    components: {
        TdNavbar,
        TdOverlay
    },
    computed: mapState({
        isLoading: (state) => state.loader.loading
    }),
    mounted() {
        this.$store.dispatch(LOADER_FINISHED);
    }
};
</script>
