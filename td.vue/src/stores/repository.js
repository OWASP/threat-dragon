import { defineStore } from 'pinia';

import threatmodelApi from '../service/api/threatmodelApi.js';

export const useRepositoryStore = defineStore('repositoryStore', {
  state: () => ({
    all: [],
    selected: ''
  }),
  actions: {
    async fetch() {
      this.$reset();
      const resp = await threatmodelApi.reposAsync();
      resp.data.repos.forEach((repo, idx) => this.all[idx] = repo);
    },
    selected(state, repo) {
      state.selected = repo;
    }
  }
});
