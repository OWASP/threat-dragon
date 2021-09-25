<template>
  <div class="locale-changer">
    <b-dropdown right :text="$i18n.locale" variant="primary">
      <b-dropdown-item
        v-for="locale in $i18n.availableLocales"
        :key="`locale-${locale}`"
        :value="locale"
        @click="updateLocale(locale)">{{ locale }}</b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
export default {
    name: 'TdLocalSelect',
    methods: {
        updateLocale(locale) {
            this.$i18n.locale = locale;
        }
    }
};
</script>
