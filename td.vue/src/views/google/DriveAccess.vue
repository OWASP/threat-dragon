<template>
    <td-selection-page
        :items="folders"
        :page="page"
        :pageNext="pageNext"
        :pagePrev="pagePrev"
        :onItemClick="onFolderClick"
        :onBackClick="navigateBack"
        :paginate="paginate"
        :showBackItem="!!parentId"
        isGoogleProvider
        :emptyStateText="`${$t('folder.noneFound')}`">
        {{ $t('folder.select') }} {{ $t(`providers.${provider}.displayName`) }} {{ $t('folder.from') }}
        {{ $t('threatmodelSelect.or') }}
        <a href="javascript:void(0)" id="new-threat-model" @click="newThreatModel(selected)">{{ $t('threatmodelSelect.newThreatModel') }}</a>
    </td-selection-page>
</template>

<script>
import { mapState } from 'vuex';

import { getProviderType } from '@/service/provider/providers.js';
import providerActions from '@/store/actions/provider.js';
import folderActions from '@/store/actions/folder.js';
import TdSelectionPage from '@/components/SelectionPage.vue';
import tmActions from '@/store/actions/threatmodel.js';

export default {
    name: 'DriveAccess',
    components: {
        TdSelectionPage
    },
    computed: mapState({
        provider: (state) => state.provider.selected,
        providerType: (state) => getProviderType(state.provider.selected),
        folders: (state) => state.folder.all,
        selected: (state) => state.folder.selected,
        page: (state) => state.folder.page,
        pageNext: (state) => state.folder.pageNext,
        pagePrev: (state) => state.folder.pagePrev,
        parentId: (state) => state.folder.parentId,
        selectedModel: (state) => state.threatmodel.data
    }),
    mounted() {
        if (this.provider !== this.$route.params.provider) {
            this.$store.dispatch(providerActions.selected, this.$route.params.provider);
        }
        let page = 1;
        if (this.$route.query.page) {
            page = this.$route.query.page;
        }

        this.$store.dispatch(folderActions.fetch, { page });
    },
    methods: {
        async onFolderClick(folder) {
            const prevfolder = this.selected;
            this.$store.dispatch(folderActions.selected, folder);
            if (folder.mimeType == 'application/json') {
                await this.$store.dispatch(tmActions.fetch, folder.id);
                const params = Object.assign({}, this.$route.params, { folder: prevfolder, threatmodel: folder.name });
                this.$store.dispatch(tmActions.selected, this.selectedModel);
                this.$router.push({ name: `${this.providerType}ThreatModel`, params });
            }
        },
        paginate(page) {
            this.$store.dispatch(folderActions.fetch, { page });
        },
        navigateBack() {
            this.$store.dispatch(folderActions.navigateBack);
        },
        newThreatModel(folderId) {
            const params = Object.assign({}, this.$route.params, {
                folder: folderId
            });

            const routeName = `${this.providerType}${this.$route.query.action === 'create' ? 'NewThreatModel' : 'ThreatModelSelect'}`;

            this.$router.push({ name: routeName, params });
        }
    }
};
</script>