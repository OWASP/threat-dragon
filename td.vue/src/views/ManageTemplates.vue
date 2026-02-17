<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <b-jumbotron class="text-center">
                    <h4>{{ $t('template.manage') }}</h4>
                    <p class="lead">{{ $t('template.manageDescription') }}</p>
                </b-jumbotron>
            </b-col>
        </b-row>

        <!-- Scenario: NOT_INITIALIZED - Show Bootstrap -->
        <b-row v-if="contentRepoStatus === 'NOT_INITIALIZED'">
            <b-col md="6" offset-md="3">
                <b-card class="bootstrap-card text-center p-4">
                    <font-awesome-icon icon="cloud-upload" size="3x" class="text-primary mb-3"></font-awesome-icon>
                    <h4>{{ $t('template.repo.bootstrap.title') }}</h4>
                    <p class="text-muted">{{ $t('template.repo.bootstrap.description') }}</p>
                    <b-button
                        variant="primary"
                        size="lg"
                        @click="handleBootstrap"
                        :disabled="isBootstrapping"
                    >
                        <b-spinner small v-if="isBootstrapping" class="mr-2"></b-spinner>
                        {{ isBootstrapping ? $t('template.repo.bootstrap.bootstrapping') : $t('template.repo.bootstrap.action') }}
                    </b-button>
                </b-card>
            </b-col>
        </b-row>

        <!-- Normal operation (status === null) -->
        <template v-else>
            <b-row>
                <b-col md="6" offset-md="3">
                    <b-form-group>
                        <b-input-group>
                            <b-input-group-prepend>
                                <b-button variant="primary" @click="onAddTemplateClick" id="add-template-btn" class="mr-3">
                                    <font-awesome-icon icon="plus" class="mr-2"></font-awesome-icon>
                                    {{ $t('template.addNew') }}
                                </b-button>
                            </b-input-group-prepend>
                            <b-form-input v-model="searchQuery" :placeholder="$t('template.search')" />
                        </b-input-group>
                    </b-form-group>
                </b-col>
            </b-row>

            <!-- Template list -->
            <b-row>
                <b-col md="6" offset-md="3">
                    <b-list-group v-if="templates.length > 0">
                        <b-list-group-item v-for="template in filteredTemplates" :key="template.id" :data-template-id="template.id"
                            class="d-flex justify-content-between align-items-start">
                            <div class="flex-grow-1">
                                <h5>{{ template.name }}</h5>
                                <p class="mb-1 text-muted">{{ template.description }}</p>
                                <b-badge v-for="tag in template.tags" :key="tag" variant="primary" class="mr-1">
                                    {{ tag }}
                                </b-badge>
                            </div>

                            <!-- Burger menu -->
                            <b-dropdown right variant="link" class="template-actions">
                                <template #button-content>
                                    <font-awesome-icon icon="ellipsis-v"></font-awesome-icon>
                                </template>
                                <b-dropdown-item @click="onEditTemplate(template)">
                                    <font-awesome-icon icon="edit" class="mr-2"></font-awesome-icon>
                                    {{ $t('forms.edit') }}
                                </b-dropdown-item>
                                <b-dropdown-divider></b-dropdown-divider>
                                <b-dropdown-item @click="onDeleteTemplate(template)" variant="danger">
                                    <font-awesome-icon icon="trash" class="mr-2"></font-awesome-icon>
                                    {{ $t('forms.delete') }}
                                </b-dropdown-item>
                            </b-dropdown>
                        </b-list-group-item>
                    </b-list-group>

                    <b-alert v-else show variant="info">
                        {{ $t('template.noTemplates') }}
                    </b-alert>
                </b-col>
            </b-row>
        </template>
        <b-modal id="edit-template-modal" :title="$t('template.editTemplate')" @ok="onSaveEdit">
            <b-form>
                <b-form-group :label="$t('template.name')" label-for="edit-name">
                    <b-form-input id="edit-name" v-model="editForm.name" required></b-form-input>
                </b-form-group>

                <b-form-group :label="$t('template.description')" label-for="edit-description">
                    <b-form-textarea id="edit-description" v-model="editForm.description" rows="3"></b-form-textarea>
                </b-form-group>

                <b-form-group :label="$t('template.tags')" label-for="edit-tags">
                    <b-form-tags id="edit-tags" v-model="editForm.tags" :placeholder="$t('template.addTagsPlaceholder')"
                        separator=",;"></b-form-tags>
                </b-form-group>
            </b-form>
        </b-modal>
    </b-container>
</template>

<script>
import { mapGetters } from 'vuex';
import { v4 } from 'uuid';
import templateActions from '@/store/actions/template.js';
import schema from '@/service/schema/ajv.js';

export default {
    name: 'ManageTemplates',
    data() {
        return {
            searchQuery: '',
            editingTemplate: null,
            editForm: {
                name: '',
                description: '',
                tags: []
            },
            isBootstrapping: false
        };
    },
    computed: {
        ...mapGetters({
            templates: 'templates',
            contentRepoStatus: 'contentRepoStatus',
            canInitializeRepo: 'canInitializeRepo',
            contentRepoName: 'contentRepoName'
        }),
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
    
        this.$store.dispatch(templateActions.fetchAll);
          
          
    },
    methods: {
        async handleBootstrap() {
            this.isBootstrapping = true;

            try {
                await this.$store.dispatch(templateActions.bootstrap);
                this.$toast.success(this.$t('template.repo.bootstrap.success'));
            } catch (error) {
                console.error('Bootstrap failed:', error);
                this.$toast.error(error.message || this.$t('template.repo.bootstrap.error'));
            } finally {
                this.isBootstrapping = false;
            }
        },

        onEditTemplate(template) {
            // Populate the edit form
            this.editingTemplate = template;
            this.editForm.name = template.name;
            this.editForm.description = template.description;
            this.editForm.tags = [...template.tags]; // Copy array

            // Show modal
            this.$bvModal.show('edit-template-modal');
        },

        async onSaveEdit() {
            try {
                await this.$store.dispatch(templateActions.update, {
                    name: this.editForm.name,
                    description: this.editForm.description,
                    tags: this.editForm.tags,
                    id: this.editingTemplate.id
                });

                this.$toast.success(this.$t('template.updateSuccess'));

                this.$bvModal.hide('edit-template-modal');
            } catch (error) {
                console.error('Error updating template:', error);
                this.$toast.error(this.$t('template.errors.updateFailed'));
            }
        },

        async onAddTemplateClick() {
            if ('showOpenFilePicker' in window) {
                try {
                    const [handle] = await window.showOpenFilePicker({
                        types: [{
                            description: 'Template Files',
                            accept: { 'application/json': ['.json'] }
                        }],
                        multiple: false
                    });

                    const file = await handle.getFile();
                    await this.importTemplate(file);

                } catch (e) {
                    // User cancelled - benign
                    console.warn('File picker cancelled');
                }
            } else {
                this.$toast.error('File picker not supported on this browser');
            }
        },

        async importTemplate(file) {
            let templateData;

            // Check for JSON syntax errors
            try {
                const text = await file.text();
                templateData = JSON.parse(text);
            } catch (e) {
                this.$toast.error(this.$t('template.errors.invalidJson'));
                console.error('JSON parse error:', e);
                return;
            }

            // Validate template format against schema
            // Schema already validates: templateMetadata, model, and all required fields
            const validation = schema.validateTemplateFormat(templateData);

            if (!validation.valid) {
                // Log detailed errors for developers
                console.warn('Template validation failed:', validation.errors);
                // Show generic message to users
                this.$toast.error(this.$t('template.errors.invalidTemplate'));
                return;
            }

            // Template is valid, save it
            try {
                templateData.templateMetadata.id = v4();
                templateData.templateMetadata.modelRef = v4();
                await this.$store.dispatch(templateActions.create, {
                    template: templateData
                });
                this.$toast.success(this.$t('template.importSuccess'));
            } catch (error) {
                console.error('Error saving template:', error);
                
                // Check for duplicate template error
                if (error.response?.status === 400 ) {
                    this.$toast.error(this.$t('template.errors.duplicateTemplate'));
                } else {
                    this.$toast.error(this.$t('template.warnings.templateSave'));
                }
            }
        },

        async onDeleteTemplate(template) {
            // Confirm before delete
            const confirmed = await this.$bvModal.msgBoxConfirm(
                this.$t('template.deleteConfirm', { name: template.name }),
                {
                    title: this.$t('template.deleteTitle'),
                    okVariant: 'danger',
                    okTitle: this.$t('forms.delete'),
                    cancelTitle: this.$t('forms.cancel'),
                    centered: true
                }
            );

            if (confirmed) {
                try {
                    await this.$store.dispatch(templateActions.delete, template.id);
                    this.$toast.success(this.$t('template.deleteSuccess'));
                } catch (error) {
                    this.$toast.error(this.$t('template.errors.deleteFailed'));
                }
            }
        }
    }
};
</script>
<style scoped>
.list-group-item {
    cursor: pointer;
}

.template-actions>>>.btn::after,
.template-actions>>>.dropdown-toggle::after {
    display: none !important;
}
</style>