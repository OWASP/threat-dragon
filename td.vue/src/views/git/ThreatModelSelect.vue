<template>
    <td-selection-page
        :items="threatModels"
        :on-item-click="onThreatmodelClick"
        :empty-state-text="t('threatmodelSelect.newThreatModel')"
        :on-empty-state-click="newThreatModel"
        :page="1"
    >
        {{ t('threatmodelSelect.select') }}
        <!-- Fixme: The href should get the configured hostname from env -->
        <a :href="`${providerUri}/${repoName}`" target="_blank" rel="noopener noreferrer">{{
            `${repoName}/${branch}`
        }}</a>
        {{ t('threatmodelSelect.from') }}
        <a id="return-to-branch" href="javascript:void(0)" @click="selectBranchClick">{{
            t('threatmodelSelect.branch')
        }}</a>
        {{ t('threatmodelSelect.or') }}
        <a id="return-to-repo" href="javascript:void(0)" @click="selectRepoClick">{{
            t('threatmodelSelect.repo')
        }}</a>
        {{ t('threatmodelSelect.or') }}
        <a id="new-threat-model" href="javascript:void(0)" @click="newThreatModel">{{
            t('threatmodelSelect.newThreatModel')
        }}</a>
    </td-selection-page>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from '@/i18n';

import branchActions from '@/store/actions/branch.js';
import { getProviderType } from '@/service/provider/providers.js';
import _providerActions from '@/store/actions/provider.js';
import repoActions from '@/store/actions/repository.js';
import TdSelectionPage from '@/components/SelectionPage.vue';
import tmActions from '@/store/actions/threatmodel.js';

export default {
    name: 'ThreatModelSelect',
    components: {
        TdSelectionPage
    },
    setup() {
        const store = useStore();
        const route = useRoute();
        const router = useRouter();
        const { t } = useI18n();

        // Computed properties
        const branch = computed(() => store.state.branch.selected);
        const provider = computed(() => store.state.provider.selected);
        const providerType = computed(() => getProviderType(store.state.provider.selected));
        const providerUri = computed(() => store.state.provider.providerUri);
        const repoName = computed(() => store.state.repo.selected);
        const threatModels = computed(() => store.state.threatmodel.all);
        const selectedModel = computed(() => store.state.threatmodel.data);

        onMounted(() => {
            // Provider is now managed via meta.provider in the route configuration
            // and router navigation guard will set it in the store

            if (repoName.value !== route.params.repository) {
                store.dispatch(repoActions.selected, route.params.repository);
            }

            if (branch.value !== route.params.branch) {
                store.dispatch(branchActions.selected, route.params.branch);
            }

            store.dispatch(tmActions.fetchAll);
        });

        // Methods
        // Simplified branch selection click handler
        const selectBranchClick = () => {
            console.log('Branch selection clicked');
            store.dispatch(branchActions.clear);
            router.push({
                name: 'gitBranch',
                params: { provider: provider.value, repository: repoName.value }
            });
        };

        // Simplified repository selection click handler
        const selectRepoClick = () => {
            console.log('Repository selection clicked');
            store.dispatch(repoActions.clear);
            router.push({ name: 'gitRepository', params: { provider: provider.value } });
        };

        // Simplified threat model click handler
        const onThreatmodelClick = async (threatmodel) => {
            // Convert the threatmodel to a proper string, handling various formats
            let modelName;
            
            if (typeof threatmodel === 'string') {
                // If it's already a string, use it directly
                modelName = threatmodel;
            } else if (threatmodel && typeof threatmodel === 'object') {
                if (threatmodel.name || threatmodel.title) {
                    // If it has a name or title property, use that
                    modelName = threatmodel.name || threatmodel.title;
                } else if (Object.keys(threatmodel).some(key => !isNaN(parseInt(key)))) {
                    // If it has numeric keys (character-by-character object), join them
                    // Sort the keys numerically to ensure correct order
                    const keys = Object.keys(threatmodel).sort((a, b) => parseInt(a) - parseInt(b));
                    const chars = keys.map(key => threatmodel[key]);
                    modelName = chars.join('');
                } else {
                    // Fallback: convert to string
                    modelName = String(threatmodel);
                }
            } else {
                // Final fallback
                modelName = String(threatmodel || '');
            }
            
            // Log what we're using to help with debugging
            console.log('Using model name for fetch:', modelName);
            
            try {
                // Dispatch actions in sequence
                await store.dispatch(tmActions.fetch, modelName);
                
                // Create params with the model name
                const params = Object.assign({}, route.params, { threatmodel: modelName });
                
                // Set the selected model
                store.dispatch(tmActions.selected, selectedModel.value);
                
                // Navigate to the threat model page
                router.push({ name: `${providerType.value}ThreatModel`, params });
            } catch (error) {
                console.error('Error loading threat model:', error);
                
                // Don't navigate if there was an error loading the model
                // The error toast will be shown by the store action
                
                // If we need to handle specific errors differently, we can check error.response.data.code here
            }
        };

        // Simplified new threat model handler
        const newThreatModel = () => {
            console.log('Creating new threat model');
            
            // Clear any existing threat model
            store.dispatch(tmActions.clear);
            
            // Create a new threat model template
            const newTm = {
                version: '2.3.0',
                summary: {
                    title: 'New Threat Model',
                    owner: '',
                    description: '',
                    id: 0
                },
                detail: {
                    contributors: [],
                    diagrams: [],
                    diagramTop: 0,
                    reviewer: '',
                    threatTop: 0
                }
            };
            
            // Create the threat model
            store.dispatch(tmActions.create, newTm);
            
            // Create a clean params object with only the parameters needed for the route
            const params = { ...route.params };
            
            // Add the threatmodel parameter
            params.threatmodel = newTm.summary.title;
            
            // Remove any parameters that might cause issues
            if (providerType.value === 'git') {
                // For git providers, ensure we don't have a folder parameter
                delete params.folder;
            }
            
            // Navigate to the edit page
            router.push({ name: `${providerType.value}ThreatModelEdit`, params });
        };

        return {
            branch,
            provider,
            providerType,
            providerUri,
            repoName,
            threatModels,
            selectedModel,
            selectBranchClick,
            selectRepoClick,
            onThreatmodelClick,
            newThreatModel,
            t
        };
    }
};
</script>
