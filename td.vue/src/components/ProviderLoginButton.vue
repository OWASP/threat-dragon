<template>
    <BButton
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
            {{ $t('providers.' + provider.key + '.loginWith') }}
            {{ $t('providers.' + provider.key + '.displayName') }}
        </span>
    </BButton>
</template>

<script>
import { useI18nMigration } from '@/i18n';
import { providerNames } from '@/service/provider/providers.js';
import { AUTH_SET_LOCAL } from '@/store/actions/auth.js';
import loginApi from '@/service/api/loginApi.js';
import { PROVIDER_SELECTED } from '@/store/actions/provider.js';
import logger from '@/utils/logger.js';

// Create a context-specific logger
const log = logger.getLogger('components:ProviderLoginButton');

export default {
    name: 'TdProviderLoginButton',
    props: {
        provider: {
            type: Object,
            default: () => ({})
        }
    },
    // Add setup to gradually migrate to Composition API
    setup() {
        // Get composition API translations, but don't use them in template yet
        return useI18nMigration();
    },
    // Keep Options API for test compatibility
    methods: {
        async onProviderClick() {
            log.debug('login with provider: ' + this.provider.key);
            await this.$store.dispatch(PROVIDER_SELECTED, this.provider.key);

            if (
                this.provider.key === providerNames.local ||
                this.provider.key === providerNames.desktop
            ) {
                this.$store.dispatch(AUTH_SET_LOCAL);
                return this.$router.push('/dashboard');
            }

            const resp = await loginApi.loginAsync(this.provider.key);
            window.location.href = resp.data;
        }
    }
};
</script>

<style lang="scss" scoped>
    .login-btn-icon {
        display: block;
    }
</style>
