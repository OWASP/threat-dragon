import { defineStore } from 'pinia';

export const useAppStore = defineStore( 'appStore', {
  state: () => ({
    packageBuildVersion: require('../../package.json').version,
    packageBuildState: require('../../package.json').buildState
  })
});
