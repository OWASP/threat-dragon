<template>
    <td-selection-page
        :items="threatModels"
        :onItemClick="onThreatmodelClick"
        :emptyStateText="$t('threatmodelSelect.newThreatModel')"
        :onEmptyStateClick="newThreatModel">
            {{ $t('threatmodelSelect.select') }}
            <a
                :href="`https://www.github.com/${repoName}`"
                target="_blank"
                rel="noopener noreferrer"
            >{{ `${repoName}/${branch}` }}</a>
            {{ $t('threatmodelSelect.from') }}
            <a href="javascript:void(0)" id="return-to-branch" @click="selectBranchClick">{{ $t('threatmodelSelect.branch') }}</a>
            {{ $t('threatmodelSelect.or') }}
            <a href="javascript:void(0)" id="return-to-repo" @click="selectRepoClick">{{ $t('threatmodelSelect.repo') }}</a>
            {{ $t('threatmodelSelect.or') }}
            <a href="javascript:void(0)" id="new-threat-model" @click="newThreatModel">{{ $t('threatmodelSelect.newThreatModel') }}</a>
    </td-selection-page>
</template>

<script>
import { mapState } from 'vuex';

import branchActions from '@/store/actions/branch.js';
import { getProviderType } from '@/service/provider/providers.js';
import providerActions from '@/store/actions/provider.js';
import repoActions from '@/store/actions/repository.js';
import TdSelectionPage from '@/components/SelectionPage.vue';
import threatmodelActions from '@/store/actions/threatmodel.js';

export default {
    name: 'ThreatModelSelect',
    components: {
        TdSelectionPage
    },
    computed: mapState({
        branch: state => state.branch.selected,
        provider: state => state.provider.selected,
        providerType: state => getProviderType(state.provider.selected),
        repoName: state => state.repo.selected,
        threatModels: state => state.threatmodel.all,
        selectedModel: state => state.threatmodel.data
    }),
    mounted() {
        if (this.provider !== this.$route.params.provider) {
            this.$store.dispatch(providerActions.selected, this.$route.params.provider);
        }
        
        if (this.repoName !== this.$route.params.repository) {
            this.$store.dispatch(repoActions.selected, this.$route.params.repository);
        }

        if (this.branch !== this.$route.params.branch) {
            this.$store.dispatch(branchActions.selected, this.$route.params.branch);
        }

        this.$store.dispatch(threatmodelActions.fetchAll);
    },
    methods: {
        selectBranchClick() {
            this.$store.dispatch(branchActions.clear);
            this.$router.push({ name: 'gitBranch', params: { provider: this.provider, repository: this.repoName }});
        },
        selectRepoClick() {
            this.$store.dispatch(repoActions.clear);
            this.$router.push({ name: 'gitRepository', params: { provider: this.provider }});
        },
        async onThreatmodelClick(threatmodel) {
            await this.$store.dispatch(threatmodelActions.fetch, threatmodel);
            const params = Object.assign({}, this.$route.params, { threatmodel });
            this.$store.dispatch(threatmodelActions.selected, this.selectedModel);
            this.$router.push({ name: `${this.providerType}ThreatModel`, params });
        },
        newThreatModel() {
            this.$store.dispatch(threatmodelActions.clear);
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
                    reviewer: ''
                }
            };
            this.$store.dispatch(threatmodelActions.create, newTm);
            const params = Object.assign({}, this.$route.params, {
                threatmodel: newTm.summary.title
            });
            this.$router.push({ name: `${this.providerType}ThreatModelEdit`, params });
        }
    }
};
</script>
