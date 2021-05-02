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
                        @click="onRepoClick(repo.value)"
                    >{{ repo.name }}</b-list-group-item>
                </b-list-group>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { mapState } from 'vuex';

import { getDisplayName } from '@/service/providers.js';
import { DATASOURCE_REPOSITORY_SELECTED } from '@/store/actions/datasource.js';
import router from '@/router/index.js';

export default {
    name: 'Repository',
    computed: mapState({
        provider: state => getDisplayName(state.datasource.provider)
    }),
    data: () => {
        return {
            repositories: [
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
        onRepoClick(repoName) {
            this.$store.dispatch(DATASOURCE_REPOSITORY_SELECTED, repoName);
            router.push('/branch');
        }
    }
};
</script>
