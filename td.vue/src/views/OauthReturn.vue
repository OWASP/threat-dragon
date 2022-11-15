<template>
    <div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

import { AUTH_SET_JWT } from '@/store/actions/auth.js';
import loginApi from '@/service/api/loginApi.js';

export default {
    name: 'OAuthReturn',
    computed: mapState({
        provider: (state) => state.provider.selected
    }),
    async mounted() {
        try {
            const resp = await loginApi.completeLoginAsync(this.provider, this.$route.query.code);
            this.$store.dispatch(AUTH_SET_JWT, resp.data);
            this.$router.push('/dashboard');
        } catch (ex) {
            console.error('Error getting token');
            console.error(ex);
            throw ex;
        }
    }
};
</script>
