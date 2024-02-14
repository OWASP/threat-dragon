<template>
  <div class="locale-changer">
    <b-dropdown right :text="locale" variant="primary">
      <b-dropdown-item
        v-for="locale in $i18n.availableLocales"
        :key="`locale-${locale}`"
        :value="locale"
        @click.native="updateLocale(locale)">{{getLanguageName(locale)}}</b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import { LOCALE_SELECTED } from '@/store/actions/locale.js';
import isElectron from 'is-electron';

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
            if (isElectron()) {
                // tell the electron main process that the locale has changed
                window.electronAPI.updateMenu(locale);
            }
        },
        getLanguageName(locale) {
            switch (locale) {
            case 'ara':
                return 'العربية'; // Arabic
            case 'deu':
                return 'Deutsch'; // German
            case 'ell':
                return 'Ελληνικά'; // Greek
            case 'eng':
                return 'English';
            case 'spa':
                return 'Español'; // Spanish
            case 'fin':
                return 'Suomi'; // Finnish
            case 'fra':
                return 'Français'; // French
            case 'hin':
                return 'हिंदी'; // Hindi
            case 'id':
                return 'Bahasa Indonesia'; // Indonesia 
            case 'jpn':
                return '日本語'; // Japanese
            case 'ms':
                return 'Malay'; // Malay
            case 'por':
                return 'Português'; // Portuguese
            case 'zho':
                return '中文'; // Chinese
            default:
                return locale; // Default to the original locale code if not found
            }
        }
    },

};
</script>
