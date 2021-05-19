<template>
  <b-container>
    <b-jumbotron  id="welcome-jumbotron">
      <b-row class="text-center mb-2">
        <b-col md=12>
          <h1 class="display-3 text-center">OWASP Threat Dragon</h1>
        </b-col>
      </b-row>
      <b-row>
        <b-col md=4>
          <b-img id="home-td-logo" alt="Threat Dragon Logo" src="@/assets/threatdragon_logo_image.svg" />
        </b-col>
        <b-col md=8>
          <b-row>
            <p class="td-description">
              Threat Dragon is a free, open-source threat modeling tool from OWASP. It can be used
              as a standalone desktop app for Windows, MacOS and Linux or as a web application. The
              desktop app is great if you want to try the application without giving it access to
              your GitHub repos, but if you choose the online version you get to unleash the awesome
              power of GitHub on your threat models! Obviously, to do this you need to log in first.
            </p>
          </b-row>
          <b-row>
            <b-col class="mt-5 mr-5 text-right">
              <!-- TODO: Load providers based on server config -->
              <td-provider-login-button
                v-for="(provider, idx) in allProviders"
                :key="idx"
                :provider="provider" />
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
}
</style>

<script>


import { allProviders } from '@/service/provider/providers.js';
import TdProviderLoginButton from '@/components/ProviderLoginButton.vue';

export default {
    name: 'Home',
    components: {
        TdProviderLoginButton
    },
    data() {
        return {
            allProviders
        };
    }
};
</script>
