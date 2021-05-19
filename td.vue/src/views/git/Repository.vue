<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <b-jumbotron class="text-center">
                    <h4>Select a {{ providerDisplayName }} repository from the list below</h4>
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

import { getDisplayName } from '@/service/provider/providers.js';
import providerActions from '@/store/actions/provider.js';
import repoActions from '@/store/actions/repository.js';

export default {
    name: 'Repository',
    computed: mapState({
        provider: state => state.provider.selected,
        providerDisplayName: state => getDisplayName(state.provider.selected),
        repositories: state => state.repo.all
    }),
    mounted() {
        if (this.provider !== this.$route.params.provider) {
            this.$store.dispatch(providerActions.selected, this.$route.params.provider);
        }

        this.$store.dispatch(repoActions.fetch);
    },
    methods: {
        onRepoClick(repoName) {
            this.$store.dispatch(repoActions.selected, repoName);
            this.$router.push({ name: 'gitBranch', params: { provider: this.provider, repository: repoName } });
        },
    }
};
</script>
