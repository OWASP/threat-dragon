<template>
    <td-selection-page
        :items="branches"
        :page="page"
        :page-next="pageNext"
        :page-prev="pagePrev"
        :on-item-click="onBranchClick"
        :paginate="paginate"
    >
        {{ t('branch.select') }}
        <!-- Fixme: The href should get the configured hostname from env -->
        <a
            id="repo_link"
            :href="`${providerUri}/${repoName}`"
            target="_blank"
            rel="noopener noreferrer"
        >{{ repoName
        }}</a>
        {{ t('branch.from') }}
        <a id="return-to-repo" href="javascript:void(0)" @click="selectRepoClick">
            {{ t('branch.chooseRepo') }}
        </a>
        {{ t('branch.or') }}
        <a id="new-branch" href="javascript:void(0)" @click="toggleNewBranchDialog()">{{
            t('branch.addNew')
        }}</a>

        <add-branch-modal v-if="showNewBranchDialog" :branches="branches" @close-dialog="toggleNewBranchDialog()" />
    </td-selection-page>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from '@/i18n';

import branchActions from '@/store/actions/branch.js';
import { getProviderType } from '@/service/provider/providers.js';
import _providerActions from '@/store/actions/provider.js';
import repoActions from '@/store/actions/repository.js';
import TdSelectionPage from '@/components/SelectionPage.vue';
import AddBranchModal from '@/components/AddBranchDialog.vue';
import logger from '@/utils/logger.js';

// Create a logger instance for this component
const log = logger.getLogger('views:git:BranchAccess');

export default {
    name: 'BranchAccess',
    components: {
        AddBranchModal,
        TdSelectionPage
    },
    setup() {
        const store = useStore();
        const route = useRoute();
        const router = useRouter();
        const { t } = useI18n();

        const showNewBranchDialog = ref(false);

        // Computed properties
        const branches = computed(() =>
            store.state.branch.all.map((branch) => {
                if (branch['protected']) {
                    return {
                        value: branch.name,
                        icon: 'lock',
                        iconTooltip: 'branch.protectedBranch'
                    };
                }
                return branch.name;
            })
        );

        const provider = computed(() => store.state.provider.selected);
        const providerType = computed(() => getProviderType(store.state.provider.selected));
        const providerUri = computed(() => store.state.provider.providerUri);
        const repoName = computed(() => store.state.repo.selected);
        const page = computed(() => Number(store.state.branch.page));
        const pageNext = computed(() => store.state.branch.pageNext);
        const pagePrev = computed(() => store.state.branch.pagePrev);

        onMounted(() => {
            log.debug('BranchAccess component mounted', {
                routeParams: route.params,
                routeQuery: route.query,
                currentRepoName: repoName.value,
                routeRepoName: route.params.repository,
                provider: provider.value,
                providerType: providerType.value
            });
            
            // Provider is now managed via meta.provider in the route configuration
            // and router navigation guard will set it in the store

            if (repoName.value !== route.params.repository) {
                log.debug('Repository name mismatch, updating store', {
                    current: repoName.value,
                    new: route.params.repository
                });
                store.dispatch(repoActions.selected, route.params.repository);
            }

            log.debug('Fetching branches', {
                repository: repoName.value,
                page: 1
            });
            
            // Fetch branches with error handling
            store.dispatch(branchActions.fetch, 1)
                .then(() => {
                    log.debug('Branches fetched successfully', {
                        branchCount: branches.value.length
                    });
                })
                .catch(error => {
                    log.error('Error fetching branches', {
                        error: error.message,
                        stack: error.stack
                    });
                });
        });

        // Methods
        const selectRepoClick = () => {
            store.dispatch(repoActions.clear);
            router.push({ name: `${providerType.value}Repository` });
        };

        const onBranchClick = (branch) => {
            store.dispatch(branchActions.selected, branch);
            const params = Object.assign({}, route.params, {
                branch
            });

            const routeName = `${providerType.value}${route.query.action === 'create' ? 'NewThreatModel' : 'ThreatModelSelect'
            }`;

            router.push({ name: routeName, params });
        };

        const paginate = (pg) => {
            store.dispatch(branchActions.fetch, pg);
        };

        const toggleNewBranchDialog = () => {
            showNewBranchDialog.value = !showNewBranchDialog.value;
        };

        return {
            branches,
            provider,
            providerType,
            providerUri,
            repoName,
            page,
            pageNext,
            pagePrev,
            showNewBranchDialog,
            selectRepoClick,
            onBranchClick,
            paginate,
            toggleNewBranchDialog,
            t
        };
    }
};
</script>
