<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <b-jumbotron class="text-center">
                    <h4>
                        Select a branch from
                        <a :href="`https://www.github.com/${repoName}`" target="_blank">{{ repoName }}</a>
                        from the list below or
                        <a href="javascript:void(0)" id="return-to-repo" @click="selectRepoClick">choose another repo</a>
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

import { DATASOURCE_REPOSITORY_CLEAR, DATASOURCE_BRANCH_SELECTED, DATASOURCE_BRANCH_FETCH } from '@/store/actions/datasource.js';
import router from '@/router/index.js';

export default {
    name: 'Branch',
    computed: mapState({
        repoName: state => state.datasource[state.datasource.provider].repositoryName,
        branches: state => state.datasource.branches
    }),
    mounted() {
        this.$store.dispatch(DATASOURCE_BRANCH_FETCH, this.repoName);
    },
    methods: {
        selectRepoClick() {
            this.$store.dispatch(DATASOURCE_REPOSITORY_CLEAR);
            router.push('/repository');
        },
        onBranchClick(branch) {
            this.$store.dispatch(DATASOURCE_BRANCH_SELECTED, branch);
            router.push('/threatmodel-select');
        }
    }
};
</script>
