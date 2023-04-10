<script>
export default {
  name: 'TdLocalSelect'
};
</script>
<script setup>
import { useLocaleStore } from '@/stores/locale';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import isElectron from 'is-electron';

const localeStore = useLocaleStore();
const i18n = useI18n();

const currentLocale = computed(() => { return localeStore.locale; });

const updateLocale = (locale) => {
  localeStore.setSelectedLocale(locale);

  if (i18n.locale.value !== localeStore.locale) {
    i18n.locale.value = localeStore.locale;
  }

  if (isElectron()) {
    // tell the electron main process that the locale has changed
    window.electronAPI.updateMenu(locale);
  }
};
</script>

<template>
  <div class="locale-changer">
    <b-dropdown
      right
      :text="currentLocale"
      variant="primary"
    >
      <b-dropdown-item
        v-for="locale in $i18n.availableLocales"
        :key="`locale-${locale}`"
        :value="locale"
        @click="updateLocale(locale)"
      >
        {{ locale }}
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>
