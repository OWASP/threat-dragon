import { defineStore } from 'pinia';

import providers from '../service/provider/providers.js';

export const useProviderStore = defineStore('providerStore', {
  state: () => ({
    all: [],
    selected: ''
  }),
  actions: {
    fetch(providers) {
      this.$reset();
      providers.forEach((provider, idx) => this.all[idx] = provider);
    },
    selected(provider) {
      if (!provider || !providers.providerNames[provider]) {
        throw new Error(`Unknown provider: ${provider}`);
      }
      this.selected = provider;
    }
  }
});
