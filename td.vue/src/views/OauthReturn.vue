<template>
    <div>
        <!-- Add loading indicator -->
    </div>
</template>

<script>
import { mapState } from 'vuex';

import { AUTH_SET_JWT } from '@/store/actions/auth.js';
import loginApi from '@/service/loginApi.js';
import router from '@/router/index.js';

export default {
    name: 'OAuthReturn',
    computed: mapState({
        provider: state => state.provider.selected
    }),
    async mounted() {
        try {
            console.log('Provider: ', this.provider);
            console.log('Code: ', this.$route.query.code);
            const resp = await loginApi.completeLoginAsync(this.provider, this.$route.query.code);
            console.log('After login api call');
            this.$store.dispatch(AUTH_SET_JWT, resp.data);
            console.log('After dispatching');
            router.push('/dashboard');
        } catch (ex) {
            console.error('Error getting token');
            console.error(ex);
            throw ex;
        }
    }
};
</script>
