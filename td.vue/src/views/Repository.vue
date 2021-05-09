<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <b-jumbotron class="text-center">
                    <h4>Select a {{ provider }} repository from the list below</h4>
                </b-jumbotron>
            </b-col>
        </b-row>
        <b-row>
            <b-col md=6 offset=3>
                <b-list-group>
                    <b-list-group-item
                        v-for="(repo, idx) in repositories"
                        :key="idx"
                        href="javascript:void(0)"
                        @click="onRepoClick(repo)"
                    >{{ repo }}</b-list-group-item>
                </b-list-group>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { mapState } from 'vuex';

import { getDisplayName } from '@/service/providers.js';
import { DATASOURCE_REPOSITORY_FETCH, DATASOURCE_REPOSITORY_SELECTED } from '@/store/actions/datasource.js';
import router from '@/router/index.js';

export default {
    name: 'Repository',
    computed: mapState({
        provider: state => getDisplayName(state.datasource.provider),
        repositories: state => state.datasource.repos
    }),
    mounted() {
        this.$store.dispatch(DATASOURCE_REPOSITORY_FETCH);
    },
    methods: {
        onRepoClick(repoName) {
            this.$store.dispatch(DATASOURCE_REPOSITORY_SELECTED, repoName);
            router.push('/branch');
        }
    }
};
</script>
