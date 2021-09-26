<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <b-jumbotron class="text-center">
                    <h4>
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
                    </h4>
                </b-jumbotron>
            </b-col>
        </b-row>
        <!-- TODO: Handle no threat models -->
        <b-row>
            <b-col md=6 offset=3>
                <b-list-group>
                    <b-list-group-item
                        v-for="(threatModel, idx) in threatModels"
                        :key="idx"
                        href="javascript:void(0)"
                        @click="onThreatmodelClick(threatModel)"
                    >{{ threatModel }}</b-list-group-item>
                </b-list-group>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { mapState } from 'vuex';

import branchActions from '@/store/actions/branch.js';
import { getProviderType } from '@/service/provider/providers.js';
import providerActions from '@/store/actions/provider.js';
import repoActions from '@/store/actions/repository.js';
import threatmodelActions from '@/store/actions/threatmodel.js';

export default {
    name: 'ThreatModelSelect',
    computed: mapState({
        branch: state => state.branch.selected,
        provider: state => state.provider.selected,
        providerType: state => getProviderType(state.provider.selected),
        repoName: state => state.repo.selected,
        threatModels: state => state.threatmodel.all
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
        onThreatmodelClick(threatmodel) {
            this.$store.dispatch(threatmodelActions.selected, threatmodel);
            const params = Object.assign({}, this.$route.params, { threatmodel });
            this.$router.push({ name: `${this.providerType}ThreatModel` , params });
        }
    }
};
</script>
