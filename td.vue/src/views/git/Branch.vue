<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <b-jumbotron class="text-center">
                    <h4>
                        {{ $t('branch.select') }}
                        <a
                            id="repo_link"
                            :href="`https://www.github.com/${repoName}`"
                            target="_blank"
                            rel="noopener noreferrer"
                        >{{ repoName }}</a>
                        {{ $t('branch.from') }}
                        <a href="javascript:void(0)" id="return-to-repo" @click="selectRepoClick">
                            {{ $t('branch.chooseRepo') }}
                        </a>
                    </h4>
                </b-jumbotron>
            </b-col>
        </b-row>
        <b-row>
            <b-col md=6 offset=3>
                <b-list-group>
                    <b-list-group-item
                        v-for="(branch, idx) in branches"
                        :key="idx"
                        href="javascript:void(0)"
                        @click="onBranchClick(branch)"
                    >{{ branch }}</b-list-group-item>
                </b-list-group>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { mapState } from 'vuex';

import branchActions from '@/store/actions/branch.js';
import providerActions from '@/store/actions/provider.js';
import repoActions from '@/store/actions/repository.js';

export default {
    name: 'Branch',
    computed: mapState({
        branches: state => state.branch.all,
        provider: state => state.provider.selected,
        repoName: state => state.repo.selected
    }),
    mounted() {
        if (this.provider !== this.$route.params.provider) {
            this.$store.dispatch(providerActions.selected, this.$route.params.provider);
        }
        
        if (this.repoName !== this.$route.params.repository) {
            this.$store.dispatch(repoActions.selected, this.$route.params.repository);
        }

        this.$store.dispatch(branchActions.fetch);
    },
    methods: {
        selectRepoClick() {
            this.$store.dispatch(repoActions.clear);
            this.$router.push({ name: 'gitRepository' });
        },
        onBranchClick(branch) {
            this.$store.dispatch(branchActions.selected, branch);
            this.$router.push({ name: 'gitThreatModelSelect', params: { provider: this.provider, repository: this.repoName, branch }});
        }
    }
};
</script>
