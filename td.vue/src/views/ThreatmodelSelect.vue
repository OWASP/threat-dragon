<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <b-jumbotron class="text-center">
                    <h4>
                        Select a Threat Model from <a href="javascript:void(0)" target="_blank">{{ `${repoName}/${branch}` }}</a>
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
                        @click="onThreatmodelClick(threatModel.value)"
                    >{{ threatModel.name }}</b-list-group-item>
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
    DATASOURCE_THREATMODEL_SELECTED
} from '@/store/actions/datasource.js';
import router from '@/router/index.js';

export default {
    name: 'ThreatmodelSelect',
    computed: mapState({
        repoName: state => state.datasource[state.datasource.provider].repositoryName,
        branch: state => state.datasource[state.datasource.provider].branch
    }),
    data: () => {
        return {
            threatModels: [
                { name: 'item1', value: 'item1' },
                { name: 'item2', value: 'item2' },
                { name: 'item3', value: 'item3' },
                { name: 'item4', value: 'item4' },
                { name: 'item5', value: 'item5' },
                { name: 'item6', value: 'item6' },
                { name: 'item7', value: 'item7' },
                { name: 'item8', value: 'item8' }
            ]
        };
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
            this.$store.dispatch(DATASOURCE_THREATMODEL_SELECTED, threatModel);
            router.push('/threatmodel');
        }
    }
};
</script>
