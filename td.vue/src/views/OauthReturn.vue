<template>
    <div>
        <!-- TODO: Please wait or something -->
    </div>
</template>

<script>
import { mapState } from 'vuex';

import { AUTH_SET_JWT } from '@/store/actions/auth.js';
import router from '@/router/index.js';

export default {
    name: 'OAuthReturn',
    computed: mapState({
        provider: state => state.datasource.provider
    }),
    async mounted() {
        // TODO: Add error handling
        const tokenReq = await fetch(`/api/oauth/${this.provider}?code=${this.$route.query.code}`);
        const tokenResp = await tokenReq.json();
        this.$store.dispatch(AUTH_SET_JWT, tokenResp.data);
        router.push('/dashboard');
    }
}
</script>
