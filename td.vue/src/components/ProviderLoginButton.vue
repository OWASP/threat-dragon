<template>
    <b-btn
        :id="`${provider.key}-login-btn`"
        class="m-1"
        variant="secondary"
        @click="onProviderClick()"> 
        <span class="login-btn-icon">
            <font-awesome-icon
                :icon="provider.icon"
                size="2x"
                color="white"
                class="mr-2"
            ></font-awesome-icon>
        </span>
        <span>
            {{ $t('providers.' + provider.key + '.loginWith') }} {{ $t('providers.' + provider.key + '.displayName') }}
        </span>
    </b-btn>
</template>

<style lang="scss" scoped>
.login-btn-icon {
  display: block;
}
</style>

<script>
import { providerNames } from '@/service/provider/providers.js';
import { AUTH_SET_LOCAL } from '@/store/actions/auth.js';
import loginApi from '@/service/api/loginApi.js';
import { PROVIDER_SELECTED } from '@/store/actions/provider.js';

export default {
    name: 'TdProviderLoginButton',
    props: {
        provider: Object
    },
    methods: {
        async onProviderClick() {
            console.debug('login with provider: ' + this.provider.key);
            await this.$store.dispatch(PROVIDER_SELECTED, this.provider.key);

            if (this.provider.key === providerNames.local || this.provider.key === providerNames.desktop) {
                this.$store.dispatch(AUTH_SET_LOCAL);
                return this.$router.push('/dashboard');
            }
          
            const resp = await loginApi.loginAsync(this.provider.key);
            window.location.href = resp.data;
        }
    }
};
</script>
