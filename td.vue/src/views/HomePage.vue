<template>
    <div>
        <b-container fluid data-testid="home-page">
            <div class="welcome-jumbotron" data-testid="welcome-jumbotron">
                <b-row class="text-center mb-2">
                    <b-col md="12">
                        <h1 class="display-3 text-center" data-testid="home-title">
                            {{ $t('home.title') }}
                        </h1>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col md="4">
                        <b-img
                            id="home-td-logo"
                            class="td-cupcake"
                            data-testid="home-logo"
                            :alt="$t('home.imgAlt')"
                            :src="require('@/assets/threatdragon_logo_image.svg')"
                        />
                    </b-col>
                    <b-col md="8">
                        <b-row>
                            <p class="td-description mt-5" data-testid="home-description">
                                {{ $t('home.description') }}
                            </p>
                        </b-row>
                        <b-row>
                            <b-col class="mt-5 ml-5 text-center" data-testid="login-buttons">
                                <td-provider-login-button
                                    v-for="(provider, idx) in providers"
                                    :key="idx"
                                    :provider="provider"
                                    data-testid="provider-login-button"
                                />
                            </b-col>
                        </b-row>
                    </b-col>
                </b-row>
            </div>
        </b-container>
        <td-footer />
    </div>
</template>

<script>
import { allProviders } from '@/service/provider/providers.js';
import { isElectronMode } from '@/utils/environment';
import TdProviderLoginButton from '@/components/ProviderLoginButton.vue';
import TdFooter from '@/components/Footer.vue';
import configActions from '@/store/actions/config.js';
import { mapState } from 'vuex';
export default {
    name: 'HomePage',
    components: {
        TdProviderLoginButton,
        TdFooter
    },
    computed: mapState({
        config: (state) => {
            return state.config.config;
        },
        providers: (state) => {
            // Always use desktop provider in Electron mode
            if (state.config.isElectronMode) {
                return { desktop: allProviders.desktop };
            }

            const providers = {};
            if (state.config.config) {
                // Only add providers that are enabled in config
                if (state.config.config.githubEnabled) {
                    providers.github = allProviders.github;
                }
                if (state.config.config.bitbucketEnabled) {
                    providers.bitbucket = allProviders.bitbucket;
                }
                if (state.config.config.gitlabEnabled) {
                    providers.gitlab = allProviders.gitlab;
                }
                if (state.config.config.googleEnabled) {
                    providers.google = allProviders.google;
                }
                if (state.config.config.localEnabled) {
                    providers.local = allProviders.local;
                }
            } else {
                // default if no backend server running
                providers.local = allProviders.local;
            }
            return providers;
        }
    }),
    mounted() {
        // Config is already loaded in main.js, no need to fetch it again
        if (!isElectronMode()) {
            // Double check that config is loaded
            if (!this.$store.state.config.config) {
                this.$store.dispatch(configActions.fetch);
            }
        }
    }
};
</script>

<style lang="scss" scoped>
    /* Recreating BootstrapVue's b-jumbotron styling */
    .welcome-jumbotron {
        background-color: #f8f9fa;
        /* Light grey background like BootstrapVue jumbotron */
        padding: 3rem 2rem;
        /* Increase padding to match BootstrapVue */
        border-radius: 0.3rem;
        /* Add rounded corners */
        box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
        /* Light shadow */
        margin-bottom: 1.5rem;
        /* Space below jumbotron */
        text-align: center;
        /* Ensure text alignment */
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    /* Additional existing styles */
    .login-btn-icon {
        display: block;
    }

    .td-cupcake {
        width: 100%;
        max-width: 480px;
        /* Ensure image size matches */
        margin: 40px auto;
        /* Center image */
    }

    .td-description {
        font-size: 20px;
        max-width: 80%;
        margin: 10px auto;
        /* Ensure description stays centered */
    }
</style>
