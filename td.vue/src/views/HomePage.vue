<template>
    <b-container fluid>
        <td-hero id="welcome-jumbotron">
            <b-row class="text-center mb-2">
                <b-col md="12">
                    <h1 class="display-3 text-center">{{ $t("home.title") }}</h1>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="4">
                    <td-image
                        class="td-cupcake"
                        id="home-td-logo"
                        :alt="$t('home.imgAlt')"
                        :src="threatDragonLogo"
                    />
                </b-col>
                <b-col md="8">
                    <b-row v-if="!ready">
                        <b-col class="text-center" style="margin-top: 10rem;">
                            <b-spinner variant="primary" label="Loading" style="width: 7em; height: 7em; border-width: 1em;"></b-spinner>
                        </b-col>
                    </b-row>
                    <template v-if="ready">
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
                    </template>
                </b-col>
            </b-row>
        </td-hero>
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
import threatDragonLogo from '@/assets/threatdragon_logo_image.svg';
import TdHero from '@/components/Hero.vue';
import TdImage from '@/components/Image.vue';
import TdProviderLoginButton from '@/components/ProviderLoginButton.vue';
import configActions from '@/store/actions/config.js';
import { RESOLVE_LOCALE } from '@/store/actions/locale';
import { mapState } from 'vuex';

// Pure function: resolves available providers from server config.
// Extracted for testability — no component mounting needed.
export const resolveProviders = (serverConfig, isElectronEnv) => {
    if (isElectronEnv) {
        return { desktop: allProviders.desktop };
    }
    if (!serverConfig) {
        return { local: allProviders.local };
    }
    const providers = {};
    if (serverConfig.githubEnabled) providers.github = allProviders.github;
    if (serverConfig.bitbucketEnabled) providers.bitbucket = allProviders.bitbucket;
    if (serverConfig.gitlabEnabled) providers.gitlab = allProviders.gitlab;
    if (serverConfig.googleEnabled) providers.google = allProviders.google;
    if (serverConfig.localEnabled) providers.local = allProviders.local;
    return providers;
};

export default {
    name: 'HomePage',
    data() {
        return {
            threatDragonLogo,
            ready: false
        };
    },
    computed:
        mapState({
<<<<<<< HEAD
            config: state => {
    computed:
        mapState({
            config: state => state.config?.config ?? null,
            configError: state => state.config?.configError ?? null,
            providers: (state) => resolveProviders(state.config?.config, isElectron()),
        }),
            },
            providers: (state) => {
                if (isElectron()) {
                    return {desktop: allProviders.desktop};
                }
                const providers = {};
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
=======
            config: state => state.config?.config ?? null,
            configError: state => state.config?.configError ?? null,
            providers: (state) => resolveProviders(state.config?.config, isElectron()),
>>>>>>> 1447b4b3 (feat(ui): add HomePage loading state and config errors)
        }),
    async mounted() {

        if (isElectron()) {
            await this.$store.dispatch(RESOLVE_LOCALE);
        } else {
            await this.$store.dispatch(configActions.fetch);
            if (this.configError) {
                this.$toast.error(this.$t('home.errors.configLoadFailed'));
            }
        }
        this.ready = true;
    },
    components: {
        TdHero,
        TdImage,
        TdProviderLoginButton,
    },};
</script>

