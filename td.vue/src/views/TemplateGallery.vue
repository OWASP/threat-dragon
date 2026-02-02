<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <b-jumbotron class="text-center">
                    <h4>{{ $t('template.select') }}</h4>
                    <p class="lead">{{ $t('template.selectDescription') }}</p>
                </b-jumbotron>
            </b-col>
        </b-row>

        <!-- Import from Local button - always visible -->
        <b-row>
            <b-col md="6" offset-md="3">
                <b-button variant="primary" @click="onImportFromLocal" block class="mb-3">
                    <font-awesome-icon icon="cloud-upload" class="mr-2"></font-awesome-icon>
                    {{ $t('template.startFromLocalTemplate') }}
                </b-button>
            </b-col>
        </b-row>

        <!-- Scenario: NOT_CONFIGURED -->
        <b-row v-if="contentRepoStatus === 'NOT_CONFIGURED'">
            <b-col md="6" offset-md="3">
                <b-alert show variant="info" class="text-center">
                    <h5>{{ $t('template.repo.notConfigured.title') }}</h5>
                    <p>{{ $t('template.repo.notConfigured.userMessage') }}</p>
                </b-alert>
            </b-col>
        </b-row>

        <!-- Scenario: REPO_NOT_FOUND -->
        <b-row v-else-if="contentRepoStatus === 'REPO_NOT_FOUND'">
            <b-col md="6" offset-md="3">
                <b-alert show variant="danger" class="text-center">
                    <h5>{{ $t('template.repo.notFound.title') }}</h5>
                    <p>{{ $t('template.repo.notFound.userMessage', { repoName: contentRepoName }) }}</p>
                </b-alert>
            </b-col>
        </b-row>

        <!-- Scenario: NOT_INITIALIZED - Regular User -->
        <b-row v-else-if="contentRepoStatus === 'NOT_INITIALIZED' && !canInitializeRepo">
            <b-col md="6" offset-md="3">
                <b-alert show variant="warning" class="text-center">
                    <h5>{{ $t('template.repo.notInitialized.title') }}</h5>
                    <p>{{ $t('template.repo.notInitialized.userMessage') }}</p>
                </b-alert>

            </b-col>
        </b-row>

        <!-- Scenario: NOT_INITIALIZED - Admin -->
        <b-row v-else-if="contentRepoStatus === 'NOT_INITIALIZED' && canInitializeRepo">
            <b-col md="6" offset-md="3">
                <b-alert show variant="info" class="text-center">
                    <h5>{{ $t('template.repo.notInitialized.title') }}</h5>
                    <p>{{ $t('template.repo.notInitialized.adminMessage') }}</p>
                    <b-button variant="success" :to="{ name: 'ManageTemplates' }">
                        <font-awesome-icon icon="cog" class="mr-2"></font-awesome-icon>
                        {{ $t('template.manage') }}
                    </b-button>
                </b-alert>

            </b-col>
        </b-row>

        <!-- Normal operation (status === null) -->
        <template v-else>
            <!-- Search bar (hidden for local/desktop providers) -->
            <b-row v-if="!isLocalProvider">
                <b-col md="6" offset-md="3">
                    <div class="d-flex mb-3">
                        <!-- Search bar -->
                        <b-form-input v-model="searchQuery" :placeholder="$t('template.search')"
                            class="flex-grow-1" />
                    </div>
                </b-col>
            </b-row>

            <!-- Template list -->
            <b-row>
                <b-col md="6" offset-md="3">
                    <b-list-group v-if="templates.length > 0">
                        <b-list-group-item v-for="template in filteredTemplates" :key="template.id" 
                            @click="onTemplateClick(template)" :data-template-id="template.id">
                            <h5>{{ template.name }}</h5>
                            <p class="mb-1 text-muted">{{ template.description }}</p>
                            <b-badge v-for="tag in template.tags" :key="tag" variant="primary" class="mr-1">
                                {{ tag }}
                            </b-badge>
                        </b-list-group-item>
                    </b-list-group>

                    <b-alert v-else show variant="info">
                        {{ isLocalProvider ? $t('template.templatesLocalSession') : $t('template.noTemplates') }}
                    </b-alert>
                </b-col>
            </b-row>
        </template>
    </b-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import templateActions from '@/store/actions/template.js';
import tmActions from '@/store/actions/threatmodel.js';
import schema from '@/service/schema/ajv.js';
import { getProviderType } from '@/service/provider/providers';
import { providerTypes } from '@/service/provider/providerTypes';

export default {
    name: 'TemplateGallery',
    data() {
        return {
            searchQuery: ''
        };
    },
    computed: {
        ...mapGetters({
            templates: 'templates',
            contentRepoStatus: 'contentRepoStatus',
            canInitializeRepo: 'canInitializeRepo',
            contentRepoName: 'contentRepoName'
        }),
        ...mapState({
            selectedProvider: state => state.provider.selected
        }),
        providerType() {
            return getProviderType(this.selectedProvider);
        },
        isLocalProvider() {
            return this.providerType === providerTypes.local || this.providerType === providerTypes.desktop;
        },
        filteredTemplates() {
            if (!this.searchQuery) return this.templates;
            const search = this.searchQuery.toLowerCase();
            return this.templates.filter(t =>
                (t.name || '').toLowerCase().includes(search) ||
                (t.description || '').toLowerCase().includes(search) ||
                (t.tags || []).some(tag => tag.toLowerCase().includes(search))
            );
        }
    },
    mounted() {
        this.$store.dispatch(templateActions.clear);
        // Only fetch templates for git providers (requires authentication)
        // Local/desktop providers use file picker only
        if (!this.isLocalProvider) {

            this.$store.dispatch(templateActions.fetchAll);
           
        }
    },
    methods: {
        async onImportFromLocal() {
            if ('showOpenFilePicker' in window) {
                try {
                    const [handle] = await window.showOpenFilePicker({
                        types: [{
                            description: 'JSON Files',
                            accept: { 'application/json': ['.json'] }
                        }],
                        multiple: false
                    });

                    const file = await handle.getFile();
                    const text = await file.text();

                    let templateData;
                    try {
                        templateData = JSON.parse(text);
                    } catch (e) {
                        this.$toast.error(this.$t('template.errors.invalidJson'));
                        console.error('JSON parse error:', e);
                        return;
                    }

                    const validation = schema.validateTemplateFormat(templateData);
                    if (!validation.valid) {
                        console.warn('Template validation failed:', validation.errors);
                        this.$toast.error(this.$t('template.errors.invalidTemplate'));
                        return;
                    }

                    // Load template (regenerates IDs and sets as current model, current model set in the action)
                    await this.$store.dispatch(tmActions.templateLoad, {
                        templateData: templateData.model
                    });

                    // Get model from state (templateLoad already committed it)
                    const model = this.$store.state.threatmodel.data;

                    const params = Object.assign({}, this.$route.params, {
                        threatmodel: model.summary.title
                    });

                    // Route based on provider type, repo for git and folder for google drive
                    if (this.isLocalProvider) {
                        this.$router.push({ name: `${this.providerType}ThreatModel`, params });
                    } else {
                        const routeName = this.providerType === providerTypes.google
                            ? `${this.providerType}Folder`
                            : `${this.providerType}Repository`;

                        //route to create model in selected repo/folder
                        this.$router.push({
                            name: routeName,
                            params: { provider: this.selectedProvider },
                            query: { action: 'create' }
                        });
                    }
                } catch (e) {
                    console.warn('File picker cancelled or error:', e);
                }
            } else {
                this.$toast.error('File picker not supported on this browser');
            }
        },
        async onTemplateClick(template) {
            try {
                // Fetch the  threat model part of the template from backend
                const templateData = await this.$store.dispatch(
                    templateActions.fetchModelById,
                    template.id
                );

                // Load template (regenerates IDs and sets as current model, current model set in the action)
                await this.$store.dispatch(tmActions.templateLoad, {
                    templateData: templateData.content
                });

                // Route to repository/folder selection based on provider type, repo for git and folder for google drive
                const routeName = this.providerType === providerTypes.google
                    ? `${this.providerType}Folder`
                    : `${this.providerType}Repository`;

                this.$router.push({
                    name: routeName,
                    params: { provider: this.selectedProvider },
                    query: { action: 'create' }
                });

            } catch (error) {
                console.error('Error loading template:', error);
                this.$toast.error(this.$t('template.errors.loadFailed'));
            }
        }
    }
};
</script>
<style scoped>
.list-group-item {
    cursor: pointer;
}
</style>