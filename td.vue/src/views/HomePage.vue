<template>
    <b-container fluid>
        <div class="welcome-jumbotron">
            <b-row class="text-center mb-2">
                <b-col md="12">
                    <h1 class="display-3 text-center">{{ $t("home.title") }}</h1>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="4">
                    <b-img class="td-cupcake"
                           id="home-td-logo"
                           :alt="$t('home.imgAlt')"
                           :src="require('@/assets/threatdragon_logo_image.svg')"
                    />
                </b-col>
                <b-col md="8">
                    <b-row>
                        <p class="td-description mt-5">
                            {{ $t("home.description") }}
                        </p>
                    </b-row>
                    <b-row>
                        <b-col class="mt-5 ml-5 text-center">
                            <td-provider-login-button
                                v-for="(provider, idx) in providers"
                                :key="idx"
                                :provider="provider"
                            />
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
        </div>
    </b-container>
</template>

<style lang="scss" scoped>
/* Recreating BootstrapVue's b-jumbotron styling */
.welcome-jumbotron {
    background-color: #f8f9fa; /* Light grey background like BootstrapVue jumbotron */
    padding: 3rem 2rem; /* Increase padding to match BootstrapVue */
    border-radius: 0.3rem; /* Add rounded corners */
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075); /* Light shadow */
    margin-bottom: 1.5rem; /* Space below jumbotron */
    text-align: center; /* Ensure text alignment */
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
    max-width: 480px; /* Ensure image size matches */
    margin: 40px auto; /* Center image */
}
.td-description {
    font-size: 20px;
    max-width: 80%;
    margin: 10px auto; /* Ensure description stays centered */
}
</style>

<script>
import {allProviders} from '@/service/provider/providers.js';
import isElectron from 'is-electron';
import TdProviderLoginButton from '@/components/ProviderLoginButton.vue';
import configActions from '@/store/actions/config.js';
import {mapState} from 'vuex';
export default {
    name: 'HomePage',
    computed:
        mapState({
            config: state => {
                return state.config.config;
            },
            providers: (state) => {
                if (isElectron()) {
                    return {desktop: allProviders.desktop};
                }
                let providers = {};
                if (state.config.config) {
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
            },
        }),
    mounted() {
        if (!isElectron()) {
            this.$store.dispatch(configActions.fetch);
        }
    },
    components: {
        TdProviderLoginButton,
    },};
</script>