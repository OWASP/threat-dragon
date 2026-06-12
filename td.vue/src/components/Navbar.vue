<template>
  <nav id="navbar" class="navbar navbar-expand-lg navbar-light fixed-top">
    <router-link :to="username ? '/dashboard' : '/'" class="navbar-brand td-brand">
      <img :src="threatDragonLogo" class="td-brand-img" alt="Threat Dragon Logo" />
      Threat Dragon v{{ this.$store.state.packageBuildVersion }}{{ this.$store.state.packageBuildState }}
    </router-link>

    <button
      class="navbar-toggler"
      type="button"
      aria-controls="nav-collapse"
      :aria-expanded="isNavExpanded.toString()"
      aria-label="Toggle navigation"
      @click="toggleNav"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div id="nav-collapse" class="navbar-collapse collapse" :class="{ show: isNavExpanded }">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" href="#" @click.prevent>
            <td-locale-select />
          </a>
        </li>
      </ul>

      <ul class="navbar-nav ml-auto">
        <li v-show="username" class="navbar-text logged-in-as">{{ $t('nav.loggedInAs') }} {{ username }}</li>
        <li v-show="username" class="nav-item" id="nav-sign-out">
          <a class="nav-link" href="#" @click="onLogOut">
            <font-awesome-icon icon="sign-out-alt" class="td-fa-nav" v-b-tooltip.hover
              :title="$t('nav.logOut')"></font-awesome-icon>
          </a>
        </li>
        <!-- This is the dropdown from admin actions(manage templates) -->
        <li v-if="isAdmin" class="nav-item td-admin-nav-dropdown">
          <td-dropdown id="my-nav-dropdown" class="nav-link-custom" variant="link" right no-caret>
            <template #button-content>
              <font-awesome-icon icon="cog" class="td-fa-nav text-white" v-b-tooltip.hover
                :title="$t('nav.contentManagement')" />
            </template>

            <template #default="{ close }">
              <button type="button" class="td-dropdown-item" @click="onManageTemplates(); close()">
                Manage Templates
              </button>
            </template>
          </td-dropdown>
        </li>

        <li class="nav-item" id="nav-docs">
          <a class="nav-link" href="https://www.threatdragon.com/docs/" target="_blank" rel="noopener noreferrer">
            <font-awesome-icon icon="question-circle" class="td-fa-nav" v-b-tooltip.hover
              :title="$t('desktop.help.docs')"></font-awesome-icon>
          </a>
        </li>
        <li class="nav-item" id="nav-tm-cheat-sheet">
          <a class="nav-link"
            href="https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html"
            target="_blank" rel="noopener noreferrer">
            <font-awesome-icon icon="gift" class="td-fa-nav" v-b-tooltip.hover
              :title="$t('desktop.help.sheets')"></font-awesome-icon>
          </a>
        </li>
        <li class="nav-item" id="nav-owasp-td">
          <a class="nav-link" href="https://owasp.org/www-project-threat-dragon/" target="_blank"
            rel="noopener noreferrer">
            <img :src="owaspLogo" class="td-fa-nav td-owasp-logo" :title="$t('desktop.help.visit')"
              alt="OWASP Threat Dragon" />
          </a>
        </li>
      </ul>
    </div>
  </nav>
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
  color: $white;
}

.td-brand {
  color: $white !important;

  .td-brand-img {
    max-height: ($header-height - 10);
  }
}

.td-admin-nav-dropdown {
  display: flex;
  align-items: center;
}

.td-admin-nav-dropdown :deep(.td-dropdown-toggle) {
  padding: 0;
}

.td-admin-nav-dropdown :deep(.td-dropdown-toggle-link:hover),
.td-admin-nav-dropdown :deep(.td-dropdown-toggle-link:focus) {
  background-color: transparent;
}

@media (max-width: 576px) {

  /* This is the typical breakpoint for phones */
  .nav-link {
    color: red !important;
  }

  .logged-in-as {
    background-color: $orange;
    border-radius: 5px;
    padding: 10px;
  }
}

@media (max-width: 576px) {
  .td-owasp-logo {
    /* Target the OWASP logo */
    background-color: red;
    border-radius: 50%;
    padding: 5px;
  }
}
</style>

<script>
import { mapGetters } from 'vuex';

import threatDragonLogo from '@/assets/threatdragon_logo_image.svg';
import owaspLogo from '@/assets/owasp.svg';
import { LOGOUT } from '@/store/actions/auth.js';
import TdDropdown from './Dropdown.vue';
import TdLocaleSelect from './LocaleSelect.vue';

export default {
    name: 'TdNavbar',
    components: {
        TdDropdown,
        TdLocaleSelect
    },
    data() {
        return {
            isNavExpanded: false,
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
        toggleNav() {
            this.isNavExpanded = !this.isNavExpanded;
        },
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
