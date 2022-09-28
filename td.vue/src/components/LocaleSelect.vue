<template>
  <div class="locale-changer">
    <b-dropdown right :text="locale" variant="primary">
      <b-dropdown-item
        v-for="locale in $i18n.availableLocales"
        :key="`locale-${locale}`"
        :value="locale"
        @click.native="updateLocale(locale)">{{ locale }}</b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import { LOCALE_SELECTED } from '@/store/actions/locale.js';
import env from '@/service/env.js';

export default {
    name: 'TdLocalSelect',
    computed: mapState({
        locale: function (state) {
            if (this.$i18n.locale !== state.locale.locale) {
                this.$i18n.locale = state.locale.locale;
            }

            return state.locale.locale;
        }
    }),
    methods: {
        updateLocale(locale) {
            this.$store.dispatch(LOCALE_SELECTED, locale);
            if (env.isElectron()) {
                // tell the electron main process that the locale has changed
                window.electronAPI.updateMenu(locale);
            }
        }
    }
};
</script>
