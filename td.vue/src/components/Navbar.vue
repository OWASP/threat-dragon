<template>
  <b-navbar toggleable="lg" fixed="top" id="navbar">
    <b-navbar-brand :to="username ? '/dashboard' : '/'" class="td-brand">
      <b-img :src="threatDragonLogo" class="td-brand-img" alt="Threat Dragon Logo" />
      Threat Dragon v{{ this.$store.state.packageBuildVersion }}{{ this.$store.state.packageBuildState }}
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item>
          <td-locale-select />
        </b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ms-auto">
        <b-nav-text v-show="username" class="logged-in-as">{{ $t('nav.loggedInAs') }} {{ username }}</b-nav-text>
        <b-nav-item v-show="username" @click="onLogOut" id="nav-sign-out">
          <font-awesome-icon icon="sign-out-alt" class="td-fa-nav" v-b-tooltip.hover
            :title="$t('nav.logOut')"></font-awesome-icon>
        </b-nav-item>
        <!-- This is the dropdown from admin actions(manage tempaltes) -->
        <b-nav-item-dropdown v-if="isAdmin" id="my-nav-dropdown" toggle-class="nav-link-custom" right >
          <!-- Custom toggle content -->
          <template #button-content>
            <font-awesome-icon icon="cog" class="td-fa-nav text-white" v-b-tooltip.hover
              :title="$t('nav.contentManagement')" />
          </template>

          <!-- Dropdown items -->
          <b-dropdown-item @click="onManageTemplates">
            Manage Templates
          </b-dropdown-item>
        </b-nav-item-dropdown>


        <b-nav-item href="https://www.threatdragon.com/docs/" target="_blank" rel="noopener noreferrer" id="nav-docs">
          <font-awesome-icon icon="question-circle" class="td-fa-nav" v-b-tooltip.hover
            :title="$t('desktop.help.docs')"></font-awesome-icon>
        </b-nav-item>
        <b-nav-item href="https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html"
          target="_blank" rel="noopener noreferrer" id="nav-tm-cheat-sheet">
          <font-awesome-icon icon="gift" class="td-fa-nav" v-b-tooltip.hover
            :title="$t('desktop.help.sheets')"></font-awesome-icon>
        </b-nav-item>
        <b-nav-item href="https://owasp.org/www-project-threat-dragon/" target="_blank" rel="noopener noreferrer"
          id="nav-owasp-td">
          <b-img :src="owaspLogo" class="td-fa-nav td-owasp-logo" :title="$t('desktop.help.visit')" />
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
  font-family: Ubuntu, Tahoma, "Helvetica Neue", Helvetica, Arial, sans-serif;
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
  color: $white;
}

.td-brand {
  align-items: center;
  color: $white !important;
  display: flex;
  gap: 0.4rem;
  margin-left: 4px;
  padding-bottom: 0;
  padding-top: 0;

  .td-brand-img {
    display: block;
    max-height: ($header-height - 10);
    width: auto;
  }
}

.td-owasp-logo {
  display: block;
  width: auto;
}

@media (max-width: 576px) {
  .logged-in-as {
    background-color: $orange;
    border-radius: 5px;
    padding: 10px;
  }
}
</style>

<script>
import { mapGetters } from 'vuex';

import owaspLogo from '@/assets/owasp.svg';
import threatDragonLogo from '@/assets/threatdragon_logo_image.svg';
import { LOGOUT } from '@/store/actions/auth.js';
import TdLocaleSelect from './LocaleSelect.vue';

export default {
    name: 'TdNavbar',
    components: {
        TdLocaleSelect
    },
    data() {
        return {
            owaspLogo,
            threatDragonLogo
        };
    },
    computed: {
        ...mapGetters([
            'username',
            'isAdmin'
        ])
    },
    methods: {
        async onLogOut(evt) {
            evt.preventDefault();
            await Promise.resolve(this.$router.push('/')).catch(error => {
                if (error.name != 'NavigationDuplicated') {
                    throw error;
                }
            });
            await this.$store.dispatch(LOGOUT);
        },
        onManageTemplates() {
            this.$router.push('/admin/templates').catch(error => {
                if (error.name != 'NavigationDuplicated') {
                    throw error;
                }
            });
        }
    }
};
</script>
