<template>
    <div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

import { authSetJwt } from '@/store/actions/auth.js';
import analytics from '@/service/analytics.js';
import loginApi from '@/service/api/loginApi.js';
import { configFetch } from '@/store/actions/config.js';

export default {
    name: 'OAuthReturn',
    computed: mapState({
        provider: (state) => state.provider.selected
    }),
    async mounted() {
        try {
            await this.$store.dispatch(configFetch);
            const resp = await loginApi.completeLoginAsync(this.provider, this.$route.query.code);
            this.$store.dispatch(authSetJwt, resp.data);
            analytics.track('PROVIDER_AUTHENTICATION_SUCCEEDED', { provider: this.provider });
            this.$router.push('/dashboard');
        } catch (ex) {
            console.error('Error getting token');
            console.error(ex);
            throw ex;
        }
    }
};
</script>
