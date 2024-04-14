<template>
  <div :class=" themeClass" class="jump pt-4">
    <td-navbar />
    <b-container fluid id="app">
      <b-overlay style="max-height: 100vh;" :show="isLoading" spinner-variant="primary">
        <router-view />
      </b-overlay>
    </b-container>
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Ubuntu:400,700");

body.dark {
  background-color: $dark-bg !important;
  border-color: $dark-border !important;
}

#app {
  font-size: 20px;
  line-height: 1.42857143;
  margin-top: ($header-height + 15px);
}
</style>

<script>
import { mapState, mapGetters } from 'vuex';

import { LOADER_FINISHED } from '@/store/actions/loader.js';
import TdNavbar from '@/components/Navbar.vue';

export default {
    name: 'TdApp',
    components: {
        TdNavbar
    },
    computed: {
        ...mapState({
            isLoading: (state) => state.loader.loading
        }),
        ...mapGetters({
            themeClass: 'theme/currentTheme' // Adjust based on your actual store path
        })
    },
    watch: {
        themeClass(newVal) {
            document.body.className = newVal; // Or manage class addition/removal more granularly
        }
    },
    mounted() {
        this.$store.dispatch(LOADER_FINISHED);
        this.$toast.warning(this.$t('nav.v2Warning'), { timeout: false });
        document.body.className = this.themeClass; // Or manage class addition/removal more granularly
    }
};
</script>
