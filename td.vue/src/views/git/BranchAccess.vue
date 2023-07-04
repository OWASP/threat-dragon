<template>
    <td-selection-page
        :items="branches"
        :page="page"
        :pageNext="pageNext"
        :pagePrev="pagePrev"
        :onItemClick="onBranchClick"
        :paginate="paginate">
        
        {{ $t('branch.select') }}
        <!-- Fixme: The href should get the configured hostname from env -->
        <a
            id="repo_link"
            :href="`${providerUri}/${repoName}`"
            target="_blank"
            rel="noopener noreferrer"
        >{{ repoName }}</a>
        {{ $t('branch.from') }}
        <a href="javascript:void(0)" id="return-to-repo" @click="selectRepoClick">
            {{ $t('branch.chooseRepo') }}
        </a>
    </td-selection-page>
</template>

<script>
import { mapState } from 'vuex';

import branchActions from '@/store/actions/branch.js';
import { getProviderType } from '@/service/provider/providers.js';
import providerActions from '@/store/actions/provider.js';
import repoActions from '@/store/actions/repository.js';
import TdSelectionPage from '@/components/SelectionPage.vue';

export default {
    name: 'BranchAccess',
    components: {
        TdSelectionPage
    },
    computed: mapState({
        branches: (state) => state.branch.all,
        provider: (state) => state.provider.selected,
        providerType: (state) => getProviderType(state.provider.selected),
        providerUri: (state) => state.provider.providerUri,
        repoName: (state) => state.repo.selected,
        page: (state) => state.branch.page,
        pageNext: (state) => state.branch.pageNext,
        pagePrev: (state) => state.branch.pagePrev
    }),
    mounted() {
        if (this.provider !== this.$route.params.provider) {
            this.$store.dispatch(providerActions.selected, this.$route.params.provider);
        }
        
        if (this.repoName !== this.$route.params.repository) {
            this.$store.dispatch(repoActions.selected, this.$route.params.repository);
        }

        this.$store.dispatch(branchActions.fetch, 1);
    },
    methods: {
        selectRepoClick() {
            this.$store.dispatch(repoActions.clear);
            this.$router.push({ name: `${this.providerType}Repository` });
        },
        onBranchClick(branch) {
            this.$store.dispatch(branchActions.selected, branch);
            const params = Object.assign({}, this.$route.params, {
                branch
            });

            const routeName = `${this.providerType}${this.$route.query.action === 'create' ? 'NewThreatModel' : 'ThreatModelSelect'}`;

            this.$router.push({ name: routeName, params });
        },
        paginate(page) {
            this.$store.dispatch(branchActions.fetch, page);
        }
    }
};
</script>
