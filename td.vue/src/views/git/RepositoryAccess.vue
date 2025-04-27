<template>
    <td-selection-page
        :filter="searchQuery"
        :items="repositories"
        :page="page"
        :page-next="pageNext"
        :page-prev="pagePrev"
        :on-item-click="onRepoClick"
        :paginate="paginate"
        :empty-state-text="`${t('repository.noneFound')} ${t(
            'providers.' + provider + '.displayName'
        )}`"
        @update:filter="searchQuery = $event"
    >
        {{ t('repository.select') }} {{ t(`providers.${provider}.displayName`) }}
        {{ t('repository.from') }}
    </td-selection-page>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from '@/i18n';

import { getProviderType } from '@/service/provider/providers.js';
import _providerActions from '@/store/actions/provider.js';
import repoActions from '@/store/actions/repository.js';
import TdSelectionPage from '@/components/SelectionPage.vue';
import logger from '@/utils/logger.js';

// Create a logger instance for this component
const log = logger.getLogger('views:git:RepositoryAccess');

export default {
    name: 'RepositoryAccess',
    components: {
        TdSelectionPage
    },
    setup() {
        const store = useStore();
        const route = useRoute();
        const router = useRouter();
        const { t } = useI18n();

        // Reactive data
        const searchQuery = ref('');
        const searchTimeout = ref(null);

        // Computed properties
        const provider = computed(() => store.state.provider.selected);
        const providerType = computed(() => getProviderType(store.state.provider.selected));
        const repositories = computed(() => store.state.repo.all);
        const page = computed(() => Number(store.state.repo.page));
        const pageNext = computed(() => store.state.repo.pageNext);
        const pagePrev = computed(() => store.state.repo.pagePrev);

        // Watch for search query changes
        watch(searchQuery, (newQuery) => {
            clearTimeout(searchTimeout.value);
            searchTimeout.value = setTimeout(() => {
                log.debug('Searching repositories:', { query: newQuery });
                store.dispatch(repoActions.fetch, {
                    page: 1,
                    searchQuery: newQuery
                });
            }, 500);
        });

        onMounted(() => {
            // Provider is now managed via meta.provider in the route configuration
            // and router navigation guard will set it in the store
            let initialPage = 1;
            if (route.query.page) {
                initialPage = route.query.page;
            }

            store.dispatch(repoActions.fetch, initialPage);
        });

        // Methods
        const onRepoClick = (repoName) => {
            log.debug('Repository clicked', { repoName });
            
            // Store the selected repository
            store.dispatch(repoActions.selected, repoName);
            log.debug('Repository selected action dispatched', { repoName });
            
            const params = Object.assign({}, route.params, {
                repository: repoName
            });
            
            // Log navigation attempt
            log.debug('Attempting navigation to branch page', {
                routeName: `${providerType.value}Branch`,
                params,
                query: route.query
            });
            
            // Navigate to branch selection
            router.push({
                name: `${providerType.value}Branch`,
                params,
                query: route.query
            }).catch(error => {
                log.error('Navigation error', { error: error.message, stack: error.stack });
            });
        };

        const paginate = (newPage) => {
            store.dispatch(repoActions.fetch, newPage, searchQuery.value);
        };

        return {
            searchQuery,
            provider,
            providerType,
            repositories,
            page,
            pageNext,
            pagePrev,
            onRepoClick,
            paginate,
            t
        };
    }
};
</script>
