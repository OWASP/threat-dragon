<template>
  <div>Processing OAuth callback...</div>
</template>

<script>
import { useStore } from 'vuex'; // Import the Vuex store
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import loginAPI from '@/service/api/loginApi.js';

export default {
    setup() {
        const store = useStore(); // Initialize the store
        const router = useRouter();
        const route = useRoute();

        onMounted(async () => {
            console.log('OAuthCallback.vue mounted');
            const code = new URLSearchParams(window.location.search).get('code');
            const provider = store.state.provider.selected; // Retrieve provider from Vuex

            if (!provider) {
                console.error('Missing provider in Vuex store.');
                router.push({ name: 'HomePage' });
                return;
            }

            if (code) {
                try {
                    // Send the provider and authorization code to the backend
                    const response = await loginAPI.completeLoginAsync(provider, code);

                    // Dispatch the AUTH_SET_JWT action to set the tokens in the store
                    store.dispatch('AUTH_SET_JWT', response); 

                    // Redirect to a secure page or dashboard
                    router.push({ name: 'MainDashboard' });
                } catch (error) {
                    console.error('Error completing login:', error);
                    // Handle error
                }
            } else {
                console.error('Authorization code not found.');
                router.push({ name: 'HomePage' });
            }
        });
    },
};
</script>
