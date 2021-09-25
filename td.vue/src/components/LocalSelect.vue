<template>
  <div class="locale-changer">
    <b-dropdown right :text="locale" variant="primary">
      <b-dropdown-item
        v-for="locale in $i18n.availableLocales"
        :key="`locale-${locale}`"
        :value="locale"
        @click="updateLocale(locale)">{{ locale }}</b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import { LOCALE_SELECTED } from '@/store/actions/locale.js';

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
        }
    }
};
</script>
