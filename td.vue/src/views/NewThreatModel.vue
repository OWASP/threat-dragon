<script>
export default {
  name: 'NewThreatModel'
};
</script>
<script setup>
import {useAppStore} from '@/stores/app';
import {useProviderStore} from '@/stores/provider';
import {useThreatModelStore} from '@/stores/threatmodel';

import {computed, onMounted} from 'vue';
import {useRouter} from 'vue-router';

import isElectron from 'is-electron';
import { getProviderType } from '@/service/provider/providers.js';

const providerStore = useProviderStore();
const appStore = useAppStore();
const threatModelStore = useThreatModelStore();
const router = useRouter();

const providerType = computed(() => getProviderType(providerStore.selected));
const version = computed(() => appStore.packageBuildVersion);

onMounted(() => {
  threatModelStore.clearState();
  const newTm = {
    version: version.value,
    summary: {
      title: 'New Threat Model',
      owner: '',
      description: '',
      id: 0
    },
    detail: {
      contributors: [],
      diagrams: [],
      diagramTop: 0,
      reviewer: '',
      threatTop: 0
    }
  };

  threatModelStore.selected(newTm);
  const params = Object.assign({}, router.currentRoute.value.params, {
    threatmodel: newTm.summary.title
  });
  if (isElectron()) {
    // tell the desktop server that the model has changed
    window.electronAPI.modelOpened(newTm.summary.title);
  }
  if (providerType.value === 'local') {
    router.push({ name: `${providerType.value}ThreatModelEdit`, params });
  } else {
    router.push({ name: `${providerType.value}ThreatModelCreate`, params });
  }
});
</script>

<template>
  <div />
</template>
