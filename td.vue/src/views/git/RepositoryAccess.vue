<template>
    <td-selection-page
        :filter.sync="searchQuery"
        :items="repositories"
        :page="page"
        :pageNext="pageNext"
        :pagePrev="pagePrev"
        :onItemClick="onRepoClick"
        :paginate="paginate"
        :emptyStateText="`${$t('repository.noneFound')} ${$t('providers.' + provider + '.displayName')}`">
        {{ $t('repository.select') }} {{ $t(`providers.${provider}.displayName`) }} {{ $t('repository.from') }}
    </td-selection-page>
</template>

<script>
import { mapState } from 'vuex';

import { getProviderType } from '@/service/provider/providers.js';
import providerActions from '@/store/actions/provider.js';
import repoActions from '@/store/actions/repository.js';
import TdSelectionPage from '@/components/SelectionPage.vue';

export default {
    name: 'RepositoryAccess',
    components: {
        TdSelectionPage
    },
    data() {
        return {
            searchQuery: '',
            searchTimeout: null,
        };
    },
    computed: mapState({
        provider: (state) => state.provider.selected,
        providerType: (state) => getProviderType(state.provider.selected),
        repositories: (state) => state.repo.all,
        page: (state) => Number(state.repo.page),
        pageNext: (state) => state.repo.pageNext,
        pagePrev: (state) => state.repo.pagePrev
    }),
    watch: {
        searchQuery(newQuery) {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                console.log('Suche nach:', newQuery);
                this.$store.dispatch(repoActions.fetch, {
                    page: 1,
                    searchQuery: newQuery,
                });
            }, 500);
        },
    },
    mounted() {
        if (this.provider !== this.$route.params.provider) {
            this.$store.dispatch(providerActions.selected, this.$route.params.provider);
        }
        let page = 1;
        if (this.$route.query.page) {
            page = this.$route.query.page;
        }

        this.$store.dispatch(repoActions.fetch, page);
    },
    methods: {
        onRepoClick(repoName) {
            this.$store.dispatch(repoActions.selected, repoName);
            const params = Object.assign({}, this.$route.params, {
                repository: repoName
            });
            this.$router.push({ name: `${this.providerType}Branch`, params, query: this.$route.query });
        },
        paginate(page) {
            this.$store.dispatch(repoActions.fetch, page, this.searchQuery);
        }
    }
};
</script>
