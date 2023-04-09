<script>
export default {
  name: 'TdProviderLoginButton'
};
</script>
<script setup>
import { useAuthStore } from '@/stores/auth';
import { useProviderStore } from '@/stores/provider';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { providerNames } from '@/service/provider/providers.js';
import loginApi from '@/service/api/loginApi.js';

const props = defineProps({
  provider: {
    type: Object,
    required: true
  }
});

const authStore = useAuthStore();
const providerStore = useProviderStore();
const router = useRouter();
const { t } = useI18n();

const onProviderClick = async () => {
  providerStore.selected = props.provider.key;

  if (props.provider.key === providerNames.local) {
    authStore.setLocal();
    return router.push('/dashboard');
  }

  const resp = await loginApi.loginAsync(props.provider.key);
  window.location.href = resp.data;
};
</script>

<template>
  <b-btn
    :id="`${provider.key}-login-btn`"
    class="m-1"
    variant="secondary"
    @click="onProviderClick()"
  >
    <span class="login-btn-icon">
      <font-awesome-icon
        :icon="provider.icon"
        size="2x"
        color="white"
        class="mr-2"
      />
    </span>
    <span>
      {{ t('home.loginWith') }} {{ t('providers.' + provider.key + '.displayName') }}
    </span>
  </b-btn>
</template>

<style lang="scss" scoped>
.login-btn-icon {
  display: block;
}
</style>
