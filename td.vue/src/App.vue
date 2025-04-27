<template>
    <div>
        <td-navbar />
        <b-container id="app" fluid>
            <b-overlay style="max-height: 100vh" :show="isLoading" spinner-variant="primary">
                <router-view />
            </b-overlay>
        </b-container>
    </div>
</template>

<script>
import { computed, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { LOADER_FINISHED } from '@/store/actions/loader.js';
import TdNavbar from '@/components/Navbar.vue';

export default {
    name: 'TdApp',
    components: {
        TdNavbar
    },
    setup() {
        const store = useStore();
        
        // Computed properties
        const isLoading = computed(() => store.state.loader.loading);
        
        // Lifecycle hooks
        onMounted(() => {
            store.dispatch(LOADER_FINISHED);
            
            // Listen for schema warnings from non-component code
            document.addEventListener('schema-warning', handleSchemaWarning);
        });
        
        onBeforeUnmount(() => {
            // Clean up event listener
            document.removeEventListener('schema-warning', handleSchemaWarning);
        });
        
        // Event handlers
        const handleSchemaWarning = (event) => {
            if (event.detail && event.detail.message) {
                // Access the global toast plugin via window._vueApp
                if (window._vueApp && window._vueApp.$toast) {
                    window._vueApp.$toast.warning(event.detail.message, { timeout: false });
                }
            }
        };
        
        return {
            isLoading
        };
    }
};
</script>

<style lang="scss">
    @use '@/styles/sizes.scss' as sizes;
    @use '@/styles/form-controls.scss';
    /* Font imports don't need to be changed - they're standard CSS imports, not Sass imports */
    @import url('https://fonts.googleapis.com/css?family=Ubuntu:400,700');

    #app {
        font-size: 20px;
        line-height: 1.42857143;
        margin-top: (sizes.$header-height + 15px);
    }
</style>
