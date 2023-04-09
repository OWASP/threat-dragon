import { defineStore } from 'pinia';

export const useLocaleStore = defineStore('localeStore',{
  state: () => ({
    locale: 'eng'
  }),
  actions: {
    setSelectedLocale(newLocale) {
      this.locale = newLocale;
    }
  }
});
