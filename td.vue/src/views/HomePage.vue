<template>
  <b-container>
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
            <p class="td-description">
              {{ $t("home.description") }}
            </p>
          </b-row>
          <b-row>
            <b-col class="mt-5 mr-5 text-right">
              <!-- TODO: Load providers based on server config -->
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
import { allProviders } from '@/service/provider/providers.js';
import isElectron from 'is-electron';
import TdProviderLoginButton from '@/components/ProviderLoginButton.vue';

export default {
    name: 'HomePage',
    computed: {
        providers: () => {
            if (isElectron()) {
                return { desktop: allProviders.desktop };
            }
            return { github: allProviders.github, bitbucket: allProviders.bitbucket, local: allProviders.local };
        },
    },
    components: {
        TdProviderLoginButton,
    },
};
</script>
