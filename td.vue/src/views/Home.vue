<template>
  <b-container>
    <b-jumbotron>
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
              <b-btn variant="secondary" @click="onProviderClick(allProviders.github)" id="github-login-btn" class="m-1">
                <span class="login-btn-icon">
                <!-- TODO: Make component and load from available providers on backend -->
                <font-awesome-icon
                  :icon="['fab', 'github']"
                  size="2x"
                  color="white"
                  class="mr-2"
                ></font-awesome-icon>
                </span>
                <span>
                Login with Github
                </span>
              </b-btn>
              <b-btn variant="secondary" @click="onProviderClick(allProviders.local)" id="local-login-btn" class="m-1">
                <span class="login-btn-icon">
                <font-awesome-icon
                  :icon="['fab', 'vuejs']"
                  size="2x"
                  color="white"
                  class="mr-2"
                ></font-awesome-icon>
                </span>
                <span>
                Local Session
                </span>
              </b-btn>
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
import { allProviders } from '@/service/providers.js';
import { AUTH_SET_LOCAL } from '@/store/actions/auth.js';
import loginApi from '@/service/loginApi.js';
import providerActions from '@/store/actions/provider.js';
import router from '@/router/index.js';

export default {
    name: 'Home',
    data() {
        return {
            allProviders
        };
    },
    methods: {
        async onProviderClick(providerName) {
            this.$store.dispatch(providerActions.selected, providerName);

            if (providerName === allProviders.local) {
                this.$store.dispatch(AUTH_SET_LOCAL);
                return router.push('/dashboard');
            }
          
            const resp = await loginApi.loginAsync(providerName);
            window.location.href = resp.data;
        }
    }
};
</script>
