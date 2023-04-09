<script>
export default {
  name: 'OAuthReturn'
};
</script>
<script setup>
import { useAuthStore } from '@/stores/auth';
import { useProviderStore } from '@/stores/provider';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import loginApi from '@/service/api/loginApi.js';

const authStore = useAuthStore();
const providerStore = useProviderStore();
const router = useRouter();

const provider = computed(() => providerStore.selected);

onMounted(async () => {
  try {
    const resp = await loginApi.completeLoginAsync(provider, router.currentRoute.value.query.code);
    authStore.setJWT(resp.data);
    await this.router.push('/dashboard');
  } catch (ex) {
    console.error('Error getting token');
    console.error(ex);
    throw ex;
  }
});
</script>

<template>
  <div />
</template>
