import { defineStore } from 'pinia';

import threatmodelApi from '../service/api/threatmodelApi.js';
import {useRepositoryStore} from '@/stores/repository';

export const useBranchStore = defineStore('branchStore', {
  state: () => ({
    all: [],
    selected: ''
  }),
  actions: {
    $reset() {
      this.all = [];
      this.selected = '';
    },
    async fetch() {
      this.$reset();
      const repositoryStore = useRepositoryStore();
      const resp = await threatmodelApi.branchesAsync(repositoryStore.selected);
      resp.data.branches.forEach((branch, idx) => this.all[idx] = branch);
    },
    setSelected(repo) {
      this.selected = repo;
    }
  }
});
