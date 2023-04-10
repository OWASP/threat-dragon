<script>
export default {
  name: 'ThreatModelSelect'
};
</script>
<script setup>
import TdSelectionPage from '@/components/SelectionPage.vue';
import { useProviderStore } from '@/stores/provider';
import { useRepositoryStore } from '@/stores/repository';
import { useBranchStore } from '@/stores/branch';
import { useThreatModelStore } from '@/stores/threatmodel';
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { getProviderType } from '@/service/provider/providers.js';

const providerStore = useProviderStore();
const branchStore = useBranchStore();
const repositoryStore = useRepositoryStore();
const threatModelStore = useThreatModelStore();

const router = useRouter();
const { t } = useI18n();

const provider = computed(() => providerStore.selected);
const providerType = computed(() => getProviderType(providerStore.selected));
const repoName = computed(() => repositoryStore.selected);
const branch = computed(() => branchStore.selected);
const threatModels = computed(() => threatModelStore.all);

onMounted(async () => {
  if (provider.value !== router.currentRoute.value.params.provider) {
    providerStore.setSelected(router.currentRoute.value.params.provider);
  }

  if (repoName.value !== router.currentRoute.value.params.repository) {
    repositoryStore.setSelected(router.currentRoute.value.params.repository);
  }

  if (branch.value !== router.currentRoute.value.params.branch) {
    branchStore.setSelected(router.currentRoute.value.params.branch);
  }

  await threatModelStore.fetchAll();
});

const selectRepoClick = () => {
  repositoryStore.$reset();
  router.push({ name: `${providerType.value}Repository`, params: { provider: provider.value }});
};
const selectBranchClick = () => {
  branchStore.$reset();
  router.push({ name: `${providerType.value}Branch`, params: { provider: provider.value, repository: repoName.value }});
};
const onThreatModelClick = async (threatmodel) => {
  await threatModelStore.fetch(threatmodel);
  const params = Object.assign({}, router.currentRoute.value.params, { threatmodel });
  await router.push({ name: `${providerType.value}ThreatModel`, params });
};
const newThreatModel = () => {
  threatModelStore.clearState();
  const newTm = {
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
  threatModelStore.create(newTm);
  const params = Object.assign({}, router.currentRoute.value.params, {
    threatmodel: newTm.summary.title
  });
  router.push({ name: `${providerType.value}ThreatModelEdit`, params });
};
</script>

<template>
  <td-selection-page
    :items="threatModels"
    :on-item-click="onThreatModelClick"
    :empty-state-text="t('threatmodelSelect.newThreatModel')"
    :on-empty-state-click="newThreatModel"
  >
    {{ t('threatmodelSelect.select') }}
    <!-- Fixme: The href should get the configured hostname from env -->
    <a
      :href="`https://www.github.com/${repoName}`"
      target="_blank"
      rel="noopener noreferrer"
    >{{ `${repoName}/${branch}` }}</a>
    {{ t('threatmodelSelect.from') }}
    <a
      id="return-to-branch"
      href="javascript:void(0)"
      @click="selectBranchClick"
    >{{ t('threatmodelSelect.branch') }}</a>
    {{ t('threatmodelSelect.or') }}
    <a
      id="return-to-repo"
      href="javascript:void(0)"
      @click="selectRepoClick"
    >{{ t('threatmodelSelect.repo') }}</a>
    {{ t('threatmodelSelect.or') }}
    <a
      id="new-threat-model"
      href="javascript:void(0)"
      @click="newThreatModel"
    >{{ t('threatmodelSelect.newThreatModel') }}</a>
  </td-selection-page>
</template>
