<script>
export default {
  name: 'TdNavbar'
};
</script>
<script setup>
import TdLocaleSelect from './LocaleSelect.vue';
import { useAppStore } from '@/stores/app';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const appStore = useAppStore();
const authStore = useAuthStore();

const router = useRouter();
const { t } = useI18n();

const onLogOut = async (evt) => {
  evt.preventDefault();
  await authStore.logout();
  await router.push('/').catch(error => {
    if (error.name != 'NavigationDuplicated') {
      throw error;
    }
  });
};
</script>

<template>
  <b-navbar toggleable="lg" fixed="top" id="navbar">
    <b-navbar-brand :to="authStore.username ? '/dashboard' : '/'" class="td-brand">
      <b-img src="/images/threatdragon_logo_image.svg" class="td-brand-img" alt="Threat Dragon Logo" />
      Threat Dragon v{{ appStore.packageBuildVersion }}{{ appStore.packageBuildState }}
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item>
          <td-locale-select />
        </b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-text v-show="authStore.username" class="logged-in-as">{{ t('nav.loggedInAs') }} {{ authStore.username }}</b-nav-text>
        <b-nav-item v-show="authStore.username" @click="onLogOut" id="nav-sign-out">
          <font-awesome-icon
            icon="sign-out-alt"
            class="td-fa-nav"
          ></font-awesome-icon>
        </b-nav-item>
        <b-nav-item
          href="https://owasp.org/www-project-threat-dragon/docs-2/"
          target="_blank"
          rel="noopener noreferrer"
          id="nav-docs"
        >
          <font-awesome-icon
            icon="question-circle"
            class="td-fa-nav"
          ></font-awesome-icon>
        </b-nav-item>
        <b-nav-item
          href="https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html"
          target="_blank"
          rel="noopener noreferrer"
          id="nav-tm-cheat-sheet"
        >
          <font-awesome-icon
            icon="gift"
            class="td-fa-nav"
          ></font-awesome-icon>
        </b-nav-item>
        <b-nav-item
          href="https://owasp.org/www-project-threat-dragon/"
          target="_blank"
          rel="noopener noreferrer"
          id="nav-owasp-td"
        >
          <b-img src="/images/owasp.svg" class="td-fa-nav td-owasp-logo" />
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<style lang="scss" scoped>
$icon-height: 1.2rem;

.navbar {
  background-color: $orange;
  border-color: $orange-alt;
  height: $header-height+10;
  font-size: 15px;
}

.nav-link,
.logged-in-as {
  color: $white !important;
}

.logged-in-as {
  margin-right: 10px;
}

.td-fa-nav {
  font-size: $icon-height;
  max-height: $icon-height;
  margin: 0 5px 0 5px;
}

.td-brand {
  color: $white !important;
  .td-brand-img {
    max-height: ($header-height - 10);
  }
}
</style>
