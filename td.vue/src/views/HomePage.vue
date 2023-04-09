<script>
export default {
  name: 'HomePage'
};
</script>
<script setup>
import TdProviderLoginButton from '@/components/ProviderLoginButton.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import isElectron from 'is-electron';
import { allProviders } from '@/service/provider/providers.js';

const { t } = useI18n();

const providers = computed(() => {
  if (isElectron()) {
    return { local: allProviders.local };
  }
  return allProviders;
});
</script>

<template>
  <b-container>
    <b-jumbotron id="welcome-jumbotron">
      <b-row class="text-center mb-2">
        <b-col md="12">
          <h1 class="display-3 text-center">
            {{ t("home.title") }}
          </h1>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="4">
          <b-img
            id="home-td-logo"
            class="td-cupcake"
            :alt="t('home.imgAlt')"
            src="images/threatdragon_logo_image.svg"
          />
        </b-col>
        <b-col md="8">
          <b-row>
            <p class="td-description">
              {{ t("home.description") }}
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
  margin: 10px 20px 20px;
}
</style>
