import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

// import providers from '../service/provider/providers.js';

export const useProviderStore = defineStore('providerStore', {
  state: () => ({
    all: useStorage('pinia/provider/all', []),
    selected: useStorage('pinia/provider/selected', ''),
  }),
  actions: {
    fetch(providers) {
      this.$reset();
      providers.forEach((provider, idx) => this.all[idx] = provider);
    },
    setSelected(provider) {
      // TODO: implement valid providers api on the backend
      // if (!provider || !providers.providerNames[provider]) {
      //   throw new Error(`Unknown provider: ${provider}`);
      // }
      this.selected = provider;
    }
  }
});
