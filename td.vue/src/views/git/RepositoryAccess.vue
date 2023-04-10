<script>
export default {
  name: 'RepositoryAccess'
};
</script>
<script setup>
import TdSelectionPage from '@/components/SelectionPage.vue';
import { useProviderStore } from '@/stores/provider';
import { useRepositoryStore } from '@/stores/repository';
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { getProviderType } from '@/service/provider/providers.js';

const providerStore = useProviderStore();
const repositoryStore = useRepositoryStore();

const router = useRouter();
const { t } = useI18n();

const provider = computed(() => providerStore.selected);
const providerType = computed(() => getProviderType(providerStore.selected));
const repositories = computed(() => repositoryStore.all);

onMounted(async () => {
  if (provider.value !== router.currentRoute.value.params.provider) {
    providerStore.setSelected(router.currentRoute.value.params.provider);
  }

  await repositoryStore.fetch();
});

const onRepoClick = (repoName) => {
  repositoryStore.setSelected(repoName);
  const params = Object.assign({}, router.currentRoute.value.params, {
    repository: repoName
  });
  router.push({ name: `${providerType.value}Branch`, params, query: router.currentRoute.value.query });
};
</script>

<template>
  <td-selection-page
    :items="repositories"
    :on-item-click="onRepoClick"
    :empty-state-text="`${t('repository.noneFound')} ${t('providers.' + provider + '.displayName')}`"
  >
    {{ t('repository.select') }} {{ t(`providers.${provider}.displayName`) }} {{ t('repository.from') }}
  </td-selection-page>
</template>
