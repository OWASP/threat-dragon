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

import branchActions from '@/store/actions/branch.js';
import repoActions from '@/store/actions/repository.js';
import threatmodelActions from '@/store/actions/threatmodel.js';
import router from '@/router/index.js';

export default {
    name: 'ThreatmodelSelect',
    computed: mapState({
        repoName: state => state.repo.selected,
        branch: state => state.branch.selected,
        threatModels: state => state.threatmodel.all
    }),
    mounted() {
        this.$store.dispatch(threatmodelActions.fetchAll);
    },
    methods: {
        selectBranchClick() {
            this.$store.dispatch(branchActions.clear);
            router.push('/branch');
        },
        selectRepoClick() {
            this.$store.dispatch(repoActions.clear);
            router.push('/repository');
        },
        onThreatmodelClick(threatModel) {
            this.$store.dispatch(threatmodelActions.selected, threatModel);
            router.push('/threatmodel');
        }
    }
};
</script>
