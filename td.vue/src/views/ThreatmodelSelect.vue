<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <b-jumbotron class="text-center">
                    <h4>
                        Select a Threat Model from
                        <a :href="`https://www.github.com/${repoName}`" target="_blank">{{ `${repoName}/${branch}` }}</a>
                        from the list below, or choose another
                        <a href="javascript:void(0)" id="return-to-branch" @click="selectBranchClick">branch</a>
                        or
                        <a href="javascript:void(0)" id="return-to-repo" @click="selectRepoClick">repo</a>
                    </h4>
                </b-jumbotron>
            </b-col>
        </b-row>
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

import {
    DATASOURCE_BRANCH_CLEAR,
    DATASOURCE_REPOSITORY_CLEAR,
    DATASOURCE_THREATMODELS_FETCH,
    DATASOURCE_THREATMODEL_SELECTED
} from '@/store/actions/datasource.js';
import router from '@/router/index.js';

export default {
    name: 'ThreatmodelSelect',
    computed: mapState({
        repoName: state => state.datasource[state.datasource.provider].repositoryName,
        branch: state => state.datasource[state.datasource.provider].branch,
        threatModels: state => state.datasource.models
    }),
    mounted() {
        const deets = {
            repoName: this.repoName,
            branch: this.branch
        };
        this.$store.dispatch(DATASOURCE_THREATMODELS_FETCH, deets);
    },
    methods: {
        selectBranchClick() {
            this.$store.dispatch(DATASOURCE_BRANCH_CLEAR);
            router.push('/branch');
        },
        selectRepoClick() {
            this.$store.dispatch(DATASOURCE_REPOSITORY_CLEAR);
            router.push('/repository');
        },
        onThreatmodelClick(threatModel) {
            const deets = {
                repoName: this.repoName,
                branch: this.branch,
                threatModel
            };
            this.$store.dispatch(DATASOURCE_THREATMODEL_SELECTED, deets);
            router.push('/threatmodel');
        }
    }
};
</script>
