import { defineStore } from 'pinia';

export const useLoaderStore = defineStore('loaderStore', {
  state: () => ({
    loading: false
  }),
  actions: {
    started() {
      this.loading = true;
    },
    finished() {
      this.loading = false;
    }
  }
});
