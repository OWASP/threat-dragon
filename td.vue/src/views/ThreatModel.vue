<template>
    <div v-if="!!model && model.summary">
        <b-row id="title_row" class="mb-4">
            <b-col>
                <td-threat-model-summary-card />
            </b-col>
        </b-row>
        <!-- Description -->
        <b-row class="mb-4">
            <b-col>
                <BCard :header="$t('threatmodel.description')">
                    <b-row class="tm-card">
                        <b-col>
                            <p id="tm_description">
                                {{ model.summary.description }}
                            </p>
                        </b-col>
                    </b-row>
                </BCard>
            </b-col>
        </b-row>
        <!-- Diagrams -->
        <b-row class="mb-4">
            <b-col
                v-for="(diagram, idx) in model.detail.diagrams"
                :key="idx"
                class="tm_diagram"
                lg="3"
            >
                <BCard>
                    <template #header>
                        <h6 class="diagram-header-text">
                            <a href="javascript:void(0)" class="diagram-edit" @click="editDiagram(diagram)">
                                <font-awesome-icon icon="diagram-project" class="mr-2" />
                                {{ diagram.title }}
                            </a>
                        </h6>
                    </template>
                    <h6 v-if="diagram.description" class="diagram-description-text">
                        <a href="javascript:void(0)" class="diagram-edit" @click="editDiagram(diagram)">
                            {{ diagram.description }}
                        </a>
                    </h6>
                    <a v-else href="javascript:void(0)" @click="editDiagram(diagram)">
                        <BImg
                            class="m-auto d-block td-diagram-thumb"
                            :src="getThumbnailUrl(diagram)"
                            :alt="diagram.title"
                        />
                    </a>
                </BCard>
            </b-col>
        </b-row>
        <b-row>
            <b-col class="text-right">
                <BButtonGroup>
                    <td-form-button
                        id="td-edit-btn"
                        :is-primary="true"
                        :on-btn-click="onEditClick"
                        icon="edit"
                        :text="$t('forms.edit')"
                    />
                    <td-form-button
                        id="td-report-btn"
                        :on-btn-click="onReportClick"
                        icon="file-alt"
                        :text="$t('forms.report')"
                    />
                    <td-form-button
                        id="td-close-btn"
                        :on-btn-click="onCloseClick"
                        icon="times"
                        :text="$t('forms.closeModel')"
                    />
                </BButtonGroup>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { getProviderType } from '@/service/provider/providers.js';
import TdFormButton from '@/components/FormButton.vue';
import TdThreatModelSummaryCard from '@/components/ThreatModelSummaryCard.vue';
import tmActions from '@/store/actions/threatmodel.js';
import logger from '@/utils/logger.js';

// Create a context-specific logger
const log = logger.getLogger('views:ThreatModel');
// FontAwesome is globally registered, but we need to make sure the icon is available
export default {
    name: 'ThreatModel',
    components: {
        TdFormButton,
        TdThreatModelSummaryCard
    },
    computed: mapState({
        model: (state) => state.threatmodel.data,
        providerType: (state) => getProviderType(state.provider.selected),
        version: (state) => state.packageBuildVersion
    }),
    mounted() {
        const threatTop =
            this.model.detail.threatTop === undefined ? 100 : this.model.detail.threatTop;
        const diagramTop =
            this.model.detail.diagramTop === undefined ? 10 : this.model.detail.diagramTop;
        const update = { diagramTop: diagramTop, version: this.version, threatTop: threatTop };
        log.debug('updates: ' + JSON.stringify(update));
        this.$store.dispatch(tmActions.update, update);
        this.$store.dispatch(tmActions.notModified);
    },
    methods: {
        onEditClick(evt) {
            evt.preventDefault();
            this.$router.push({
                name: `${this.providerType}ThreatModelEdit`,
                params: this.$route.params
            });
        },
        onReportClick(evt) {
            evt.preventDefault();
            log.debug(`Generating report with provider: ${this.providerType}`);

            // Special handling for local provider
            if (this.providerType === 'local') {
                log.debug('Using local route structure for report');
                this.$router.push({
                    name: 'localReport',
                    params: {
                        threatmodel: this.$route.params.threatmodel
                    },
                    replace: true
                });
                return;
            }

            // For other providers, use the same validation logic as editDiagram
            const params = { ...this.$route.params };

            // Provider-specific validation
            if (this.providerType === 'google') {
                log.debug('Validating Google Drive params for report');
                if (!params.folder) {
                    log.error('Missing folder parameter for Google Drive route');
                    if (this.$store.state.folder && this.$store.state.folder.selected) {
                        params.folder = this.$store.state.folder.selected;
                    } else {
                        this.$router.push({ name: 'googleFolder' });
                        return;
                    }
                }
            } else if (this.providerType === 'git') {
                log.debug('Validating Git params for report');
                if (!params.repository || !params.branch) {
                    log.error('Missing required Git parameters');
                    this.$router.push({ name: 'MainDashboard' });
                    return;
                }
            }

            log.debug(`Navigating to ${this.providerType}Report with params:`, params);
            this.$router.push({
                name: `${this.providerType}Report`,
                params: params,
                replace: true
            });
        },
        onCloseClick(evt) {
            evt.preventDefault();
            this.$store.dispatch(tmActions.clear);
            this.$router.push('/dashboard');
        },
        getThumbnailUrl(diagram) {
            if (!diagram || !diagram.diagramType) {
                return require('@/assets/thumbnail.jpg');
            }
            return require(`@/assets/thumbnail.${diagram.diagramType.toLowerCase()}.jpg`);
        },
        editDiagram(diagram) {
            // Make sure the diagram has all required properties
            if (!diagram.cells) {
                diagram.cells = [];
            }

            this.$store.dispatch(tmActions.diagramSelected, diagram);

            log.debug(`Editing diagram "${diagram.title}" with provider: ${this.providerType}`);

            // When in local mode (demo models), use a simpler route structure
            // This avoids provider param issues that can cause infinite redirects
            if (this.providerType === 'local') {
                log.debug('Using local route structure for diagram edit');
                this.$router.push({
                    name: 'localDiagramEdit',
                    params: {
                        threatmodel: this.$route.params.threatmodel,
                        diagram: encodeURIComponent(diagram.title)
                    },
                    replace: true // Use replace to clean up navigation history
                });
                return;
            }

            // For other provider types, include all necessary params with validation
            const params = {
                ...this.$route.params,
                diagram: encodeURIComponent(diagram.title)
            };

            // Provider-specific validation
            if (this.providerType === 'google') {
                log.debug('Validating Google Drive params for diagram edit');
                // Special handling for Google Drive provider to ensure folder param is present
                if (!params.folder) {
                    log.error('Missing folder parameter for Google Drive route');
                    // Use a default folder ID if available in the state
                    if (this.$store.state.folder && this.$store.state.folder.selected) {
                        log.debug('Using folder ID from state:', this.$store.state.folder.selected);
                        params.folder = this.$store.state.folder.selected;
                    } else {
                        // Redirect to folder selection if we don't have a folder
                        log.debug('No folder ID available, redirecting to folder selection');
                        this.$router.push({ name: 'googleFolder' });
                        return;
                    }
                }
            } else if (this.providerType === 'git') {
                log.debug('Validating Git params for diagram edit');
                // Ensure repository and branch are set
                if (!params.repository || !params.branch) {
                    log.error('Missing required Git parameters:',
                        !params.repository ? 'repository' : 'branch');
                    // Fall back to dashboard as we can't proceed without these params
                    this.$router.push({ name: 'MainDashboard' });
                    return;
                }
            }

            log.debug(`Navigating to ${this.providerType}DiagramEdit with params:`, params);
            this.$router.push({
                name: `${this.providerType}DiagramEdit`,
                params: params,
                replace: true // Use replace to clean up navigation history
            });
        }
    }
};
</script>
<style lang="scss" scoped>
@use '@/styles/colors.scss' as colors;

/* Import the SCSS file with color variables */
.tm-card {
    font-size: 14px;
    white-space: pre-wrap;
}

.diagram-header-text a {
    color: colors.$black;
}

.diagram-description-text a {
    color: colors.$black;
}

.td-diagram-thumb {
    max-width: 200px;
    max-height: 160px;
}
</style>
