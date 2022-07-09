<template>
    <td-selection-page
        :items="repositories"
        :onItemClick="onRepoClick"
        :emptyStateText="`${$t('repository.noneFound')} ${$t('providers.' + provider + '.displayName')}`">
        {{ $t('repository.select') }} {{ $t(`providers.${provider}.displayName`) }} {{ $t('repository.from') }}
    </td-selection-page>
</template>

<script>
import { mapState } from 'vuex';

import { getProviderType } from '@/service/provider/providers.js';
import providerActions from '@/store/actions/provider.js';
import repoActions from '@/store/actions/repository.js';
import TdSelectionPage from '@/components/SelectionPage.vue';

export default {
    name: 'RepositoryAccess',
    components: {
        TdSelectionPage
    },
    computed: mapState({
        provider: state => state.provider.selected,
        providerType: state => getProviderType(state.provider.selected),
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
            const params = Object.assign({}, this.$route.params, {
                repository: repoName
            });
            this.$router.push({ name: `${this.providerType}Branch`, params, query: this.$route.query });
        },
    }
};
</script>
