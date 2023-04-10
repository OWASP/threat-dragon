import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

export const useLocaleStore = defineStore('localeStore',{
  state: () => ({
    locale: useStorage('pinia/locale/locale', 'eng'),
  }),
  actions: {
    setSelectedLocale(newLocale) {
      this.locale = newLocale;
    }
  }
});
