import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

import { useBranchStore } from '@/stores/branch';
import { useCellStore } from '@/stores/cell';
import { useProviderStore } from '@/stores/provider';
import { useRepositoryStore } from '@/stores/repository';
import { useThreatModelStore } from '@/stores/threatmodel';
import loginApi from '../service/api/loginApi.js';
import providers from '../service/provider/providers.js';

export const useAuthStore = defineStore( 'authStore', {
  state: () => ({
    jwt: useStorage('pinia/auth/jwt', ''),
    refreshToken: useStorage('pinia/auth/refreshToken', ''),
    jwtBody: useStorage('pinia/auth/jwtBody', {}),
    user: useStorage('pinia/auth/user', {}),
  }),
  getters: {
    username: (state) => state.user.username || ''
  },
  actions: {
    $reset() {
      this.jwt = '';
      this.refreshToken = '';
      this.jwtBody = {};
      this.user = {};
    },
    setJWT(tokens) {
      try {
        const { accessToken, refreshToken } = tokens;
        const tokenBody = accessToken.split('.')[1];
        const decodedBody = window.atob(tokenBody);
        const jwtBody = JSON.parse(decodedBody);
        this.jwt = accessToken;
        this.jwtBody = jwtBody;
        this.user = jwtBody.user;
        this.refreshToken = refreshToken;
      } catch (e) {
        console.error('Error decoding JWT', e);
        throw e;
      }
    },
    setLocal() {
      this.user = {
        username: 'Guest'
      };
    },
    async logout() {
      const branchStore = useBranchStore();
      const cellStore = useCellStore();
      const providerStore = useProviderStore();
      const repositoryStore = useRepositoryStore();
      const threatModelStore = useThreatModelStore();
      try {
        if (providerStore.selected !== providers.allProviders.local.key) {
          await loginApi.logoutAsync(this.refreshToken);
        }
      } catch (e) {
        console.error('Error calling logout api', e);
      }
      this.$reset();
      branchStore.$reset();
      cellStore.$reset();
      providerStore.$reset();
      repositoryStore.$reset();
      threatModelStore.clearState();
    }
  }
});
