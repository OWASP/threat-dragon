<template>
    <b-container fluid>
        <b-jumbotron id="welcome-jumbotron">
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
                           src="@/assets/threatdragon_logo_image.svg"
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
        </b-jumbotron>
    </b-container>
</template>

<style lang="scss" scoped>
.login-btn-icon {
    display: block;
}

.td-description {
    font-size: 20px;
    margin-right: 20px;
    margin-left: 170px;
}

.td-cupcake {
    margin-top: 10px;
    margin-bottom: 20px;
    margin-right: 20px;
    margin-left: 20px;
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
