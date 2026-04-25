<template>
    <b-container fluid>
        <div id="welcome-jumbotron">
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
                           :src="threatDragonLogo"
                    />
                </b-col>
                <b-col md="8">
                    <b-row>
                        <p class="td-description mt-5">
                            {{ $t("home.description") }}
                        </p>
                    </b-row>
                    <b-row>
                        <b-col class="mt-5 ms-5 text-center">
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
#welcome-jumbotron {
    background-color: #e9ecef;
    border-radius: 0.3rem;
    margin-bottom: 2rem;
    padding: 2rem 1rem;
}

.login-btn-icon {
    display: block;
}

.display-3 {
    font-family: Ubuntu, Tahoma, "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 4.5rem;
    font-weight: 300;
    line-height: 1.2;
}

.td-description {
    font-family: Ubuntu, Tahoma, "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 20px;
    max-width: 41rem;
    margin-right: 20px;
    margin-left: 158px;
}

.td-cupcake {
    width: 400px;
    margin-top: 10px;
    margin-bottom: 20px;
    margin-right: 20px;
    margin-left: 26px;
}

:deep(#local-login-btn) {
    font-family: Ubuntu, Tahoma, "Helvetica Neue", Helvetica, Arial, sans-serif;
    left: -1px;
    position: relative;
}

@media (min-width: 576px) {
    #welcome-jumbotron {
        padding: 4rem 2rem;
    }
}
</style>

<script>
import {allProviders} from '@/service/provider/providers.js';
import isElectron from 'is-electron';
import TdProviderLoginButton from '@/components/ProviderLoginButton.vue';
import threatDragonLogo from '@/assets/threatdragon_logo_image.svg';
import configActions from '@/store/actions/config.js';
import {mapState} from 'vuex';

export default {
    name: 'HomePage',
    data() {
        return {
            threatDragonLogo
        };
    },
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
