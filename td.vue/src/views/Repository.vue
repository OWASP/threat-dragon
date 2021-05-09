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
import repoActions from '@/store/actions/repository.js';
import router from '@/router/index.js';

export default {
    name: 'Repository',
    computed: mapState({
        provider: state => getDisplayName(state.provider.selected),
        repositories: state => state.repo.all
    }),
    mounted() {
        this.$store.dispatch(repoActions.fetch);
    },
    methods: {
        onRepoClick(repoName) {
            this.$store.dispatch(repoActions.selected, repoName);
            router.push('/branch');
        }
    }
};
</script>
