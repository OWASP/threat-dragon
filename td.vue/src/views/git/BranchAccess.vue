<script>
export default {
  name: 'BranchAccess'
};
</script>
<script setup>
import TdSelectionPage from '@/components/SelectionPage.vue';
import { useProviderStore } from '@/stores/provider';
import { useBranchStore } from '@/stores/branch';
import { useRepositoryStore } from '@/stores/repository';
import { computed, onMounted} from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { getProviderType } from '@/service/provider/providers.js';

const branchStore = useBranchStore();
const providerStore = useProviderStore();
const repositoryStore = useRepositoryStore();

const router = useRouter();
const { t } = useI18n();

const provider = computed(() => providerStore.selected);
const providerType = computed(() => getProviderType(providerStore.selected));
const repoName = computed(() => repositoryStore.selected);
const branches = computed(() => branchStore.all);

onMounted(async () => {
  if (provider.value !== router.currentRoute.value.params.provider) {
    providerStore.setSelected(router.currentRoute.value.params.provider);
  }

  if (repoName.value !== router.currentRoute.value.params.repository) {
    repositoryStore.setSelected(router.currentRoute.value.params.repository);
  }

  await branchStore.fetch();
});

const selectRepoClick = () => {
  repositoryStore.$reset();
  router.push({ name: `${providerType.value}Repository` });
};
const onBranchClick = (branch) => {
  branchStore.setSelected(branch);
  const params = Object.assign({}, router.currentRoute.value.params, {
    branch
  });

  const routeName = `${providerType.value}${router.currentRoute.value.query.action === 'create' ? 'NewThreatModel' : 'ThreatModelSelect'}`;

  router.push({ name: routeName, params });
};
</script>

<template>
  <td-selection-page
    :items="branches"
    :on-item-click="onBranchClick"
  >
    {{ t('branch.select') }}
    <!-- Fixme: The href should get the configured hostname from env -->
    <a
      id="repo_link"
      :href="`https://www.github.com/${repoName}`"
      target="_blank"
      rel="noopener noreferrer"
    >{{ repoName }}</a>
    {{ t('branch.from') }}
    <a
      id="return-to-repo"
      href="javascript:void(0)"
      @click="selectRepoClick"
    >
      {{ t('branch.chooseRepo') }}
    </a>
  </td-selection-page>
</template>
