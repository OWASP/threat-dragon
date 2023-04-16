<script>
export default {
  name: 'TdApp'
};
</script>
<script setup>
import TdNavbar from '@/components/Navbar.vue';
import { useLoaderStore } from '@/stores/loader';
import { computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';

const loaderStore = useLoaderStore();

const toast = useToast();
const { t } = useI18n();

const isLoading = computed(() => loaderStore.loading);

onMounted(() => {
  loaderStore.loading = false;
  toast.warning(t('nav.v2Warning'), { timeout: false });
});
</script>

<template>
  <td-navbar />
  <b-container
    id="app"
    fluid
  >
    <b-overlay
      style="max-height: 100vh;"
      :show="isLoading"
      spinner-variant="primary"
    >
      <router-view />
    </b-overlay>
  </b-container>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Ubuntu:400,700");

#app {
  font-size: 20px;
  line-height: 1.42857143;
  margin-top: ($header-height + 15px);
}
</style>
