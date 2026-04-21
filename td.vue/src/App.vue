<template>
  <div>
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

#app {
  font-size: 20px;
  line-height: 1.42857143;
  margin-top: ($header-height + 15px);
}

.form-check {
  align-items: flex-start;
  display: inline-flex;
  margin-bottom: 0.25rem;
  gap: 0.45rem;
}

.form-check-input[type="checkbox"] {
  accent-color: $orange;
  width: 13px;
  height: 13px;
  margin-top: 0;
  margin-right: 0.35rem;
  vertical-align: middle;
}

.form-check-label {
  line-height: 1.35;
  margin-bottom: 0;
  vertical-align: middle;
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
