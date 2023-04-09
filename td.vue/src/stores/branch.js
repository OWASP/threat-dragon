import { defineStore } from 'pinia';

import threatmodelApi from '../service/api/threatmodelApi.js';
import {useRepositoryStore} from '@/stores/repository';

export const useBranchStore = defineStore('branchStore', {
  state: () => ({
    all: [],
    selected: ''
  }),
  actions: {
    async fetch() {
      this.$reset();
      const repositoryStore = useRepositoryStore();
      const resp = await threatmodelApi.branchesAsync(repositoryStore.repo.selected);
      resp.data.branches.forEach((branch, idx) => this.all[idx] = branch);
    },
    selected(repo) {
      this.selected = repo;
    }
  }
});
