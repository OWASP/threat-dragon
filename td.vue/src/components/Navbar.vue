<template>
  <b-navbar toggleable="lg" fixed="top">
    <b-navbar-brand :to="username ? '/dashboard' : '/'">
      <b-img src="@/assets/threatdragon_logo.svg" alt="Threat Dragon Logo" />
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-text v-show="username" class="logged-in-as">Logged in as {{ username }}</b-nav-text>
        <b-nav-item v-show="username" href="#" id="nav-sign-out">
          <font-awesome-icon
            icon="sign-out-alt"
            class="td-fa-nav"
            size="2x"
          ></font-awesome-icon>
        </b-nav-item>
        <b-nav-item
          href="https://docs.threatdragon.org/"
          target="_blank"
          id="nav-docs"
        >
          <font-awesome-icon
            icon="question-circle"
            class="td-fa-nav"
            size="2x"
          ></font-awesome-icon>
        </b-nav-item>
        <b-nav-item
          href="https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html"
          target="_blank"
          id="nav-tm-cheat-sheet"
        >
          <font-awesome-icon
            icon="gift"
            class="td-fa-nav"
            size="2x"
          ></font-awesome-icon>
        </b-nav-item>
        <b-nav-item
          href="https://owasp.org/www-project-threat-dragon/"
          target="_blank"
          id="nav-owasp-td"
        >
          <b-img src="@/assets/owasp.svg" class="td-fa-nav" />
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<style lang="scss" scoped>
.navbar {
  background-color: $theme-primary;
  border-color: $theme-secondary;
}

.nav-link,
.logged-in-as {
  color: #ffffff !important;
}

.logged-in-as {
  margin-right: 10px;
}

.td-fa-nav {
  font-size: 1.5rem;
  margin: 0 5px 0 5px;
}
</style>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'TdNavbar',
    computed: {
        ...mapGetters([
            'username',
            'isLoggedIn'
        ])
    }
};
</script>
