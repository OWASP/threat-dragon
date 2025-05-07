<template>
    <div class="diagram-editor">
        <b-row class="main-content-row">
            <b-col cols="2" class="stencil-column">
                <div ref="stencil_container" class="stencil-container td-stencil-theme" />
            </b-col>
            <b-col cols="10" class="content-column">
                <b-row class="header-row">
                    <b-col>
                        <h3 class="td-graph-title">
                            {{ diagram.title }}
                        </h3>
                    </b-col>
                    <b-col align="right">
                        <td-graph-buttons :graph="graph" @saved="saved" @closed="closed" />
                    </b-col>
                </b-row>
                <b-row class="graph-row">
                    <b-col>
                        <div id="graph-container" ref="graph_container" class="graph-container" />
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        <td-graph-meta @threat-selected="threatSelected" @threat-suggest="threatSuggest" />

        <div>
            <td-keyboard-shortcuts />
            <td-threat-edit-dialog ref="threatEditDialog" />
            <td-threat-suggest-dialog ref="threatSuggestDialog" />
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, getCurrentInstance, nextTick, watch } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from '@/i18n';
import { useRouter, useRoute } from 'vue-router';
import logger from '@/utils/logger.js';

// Create a context-specific logger
const log = logger.getLogger('component:Graph');

import TdGraphButtons from '@/components/GraphButtons.vue';
import TdGraphMeta from '@/components/GraphMeta.vue';
import TdKeyboardShortcuts from '@/components/KeyboardShortcuts.vue';
import TdThreatEditDialog from '@/components/ThreatEditDialog.vue';
import TdThreatSuggestDialog from './ThreatSuggestDialog.vue';

import { getProviderType } from '@/service/provider/providers.js';
import diagramService from '@/service/migration/diagram.js';
import stencil from '@/service/x6/stencil.js';
import tmActions from '@/store/actions/threatmodel.js';
import diagramChangeTracker from '@/service/DiagramChangeTracker.js';

// Import stencil theme with relative path to avoid webpack chunking issues
import '../assets/css/stencil-theme.css';

export default {
    name: 'TdGraph',
    components: {
        TdGraphButtons,
        TdGraphMeta,
        TdKeyboardShortcuts,
        TdThreatEditDialog,
        TdThreatSuggestDialog
    },
    setup() {
        const store = useStore();
        const router = useRouter();
        const route = useRoute();
        const _instance = getCurrentInstance();
        // Fix for test compatibility
        let t = () => '';
        // Initialize i18n in setup function
        let i18nInstance;
        // No need for locale ref as we're using i18nInstance.locale directly

        try {
            i18nInstance = useI18n();
            if (i18nInstance && i18nInstance.t) {
                t = i18nInstance.t;
                // Don't reassign the ref, just use it directly
            }
        } catch (error) {
            log.warn('i18n not available in setup, using default', { error });
        }
        const graph = ref(null);
        const stencilInstance = ref(null);
        const graphContainer = ref(null);
        const stencilContainer = ref(null);
        const threatEditDialog = ref(null);
        const threatSuggestDialog = ref(null);

        // Computed state
        const diagram = computed(() => store.state.threatmodel.selectedDiagram);
        const providerType = computed(() => getProviderType(store.state.provider.selected));

        // Track original diagram state for change detection
        const originalDiagramState = ref(null);

        // Initialize the graph
        const init = () => {
            // Initialize the graph first
            graph.value = diagramService.edit(graphContainer.value, diagram.value);

            // Make sure stencil container is properly sized before initializing
            if (stencilContainer.value) {
                // Stencil container height should be handled by CSS
            }

            // Stencil initialization moved to onMounted -> nextTick

            // Store a deep copy of the initial diagram state
            originalDiagramState.value = JSON.parse(JSON.stringify({
                selectedDiagram: store.state.threatmodel.selectedDiagram
            }));
            log.debug('Stored original diagram state for change detection');

            // Notify store that the diagram is in its initial state
            store.dispatch(tmActions.notModified);

            // Listen for graph changes
            graph.value.getPlugin('history').on('change', () => {
                const updated = Object.assign({}, diagram.value);
                updated.cells = graph.value.toJSON().cells;
                store.dispatch(tmActions.diagramModified, updated);
            });
        };

        // Event handlers
        const threatSelected = (threatId, state) => {
            log.debug('Graph component received threatSelected event', { threatId, state });

            // Check if we're in a test environment
            const isTestEnv = process.env.NODE_ENV === 'test';

            if (isTestEnv) {
                // In test environment, call showDialog directly without timeouts
                if (threatEditDialog.value) {
                    threatEditDialog.value.showDialog(threatId, state);
                } else {
                    log.error('threatEditDialog ref is not available');
                }
            } else {
                // In production, use timeouts to ensure the ref is available
                // This is especially important for the "Add New Threat" button
                setTimeout(() => {
                    if (threatEditDialog.value) {
                        // Use the new public showDialog method
                        log.debug('Showing threat edit dialog for', { threatId, state });
                        threatEditDialog.value.showDialog(threatId, state);
                    } else {
                        log.error('threatEditDialog ref is not available');

                        // Try again after a longer delay as a fallback
                        setTimeout(() => {
                            if (threatEditDialog.value) {
                                log.debug('Retry showing threat edit dialog for', { threatId, state });
                                threatEditDialog.value.showDialog(threatId, state);
                            } else {
                                log.error('threatEditDialog ref still not available after retry');
                            }
                        }, 100);
                    }
                }, 0);
            }
        };

        // Add a document-level event listener as a backup mechanism
        const documentThreatSelectedHandler = (event) => {
            if (event.detail && event.detail.id) {
                log.debug('Graph component received document-level threat-selected event', { detail: event.detail });
                if (threatEditDialog.value) {
                    threatEditDialog.value.showDialog(event.detail.id, event.detail.state || 'old');
                }
            }
        };

        const threatSuggest = (type) => {
            if (threatSuggestDialog.value) {
                threatSuggestDialog.value.showModal(type);
            }
        };

        const saved = () => {
            log.debug('Save diagram');
            const updated = Object.assign({}, diagram.value);
            updated.cells = graph.value.toJSON().cells;
            store.dispatch(tmActions.diagramSaved, updated);
            store.dispatch(tmActions.saveModel);

            // Update the original diagram state after saving to prevent unnecessary "discard changes" dialog
            originalDiagramState.value = JSON.parse(JSON.stringify({
                selectedDiagram: store.state.threatmodel.selectedDiagram
            }));
            log.debug('Updated original diagram state after saving');
        };

        const getConfirmModal = async () => {
            try {
                // Use the modal helper with t function from setup scope
                const { showConfirmDialog } = await import('@/utils/modal-helper.js');

                return await showConfirmDialog(null, {
                    title: t('forms.discardTitle'),
                    message: t('forms.discardMessage'),
                    okTitle: t('forms.ok'),
                    cancelTitle: t('forms.cancel'),
                    okVariant: 'danger',
                    hideHeaderClose: true,
                    centered: true
                });
            } catch (error) {
                log.error('Error showing confirm modal', { error });
                return false;
            }
        };
        const closed = async () => {
            // Get current state for comparison
            const currentState = {
                selectedDiagram: store.state.threatmodel.selectedDiagram
            };

            // Use our comprehensive change tracker to detect actual changes
            const hasActualChanges = diagramChangeTracker.hasActualChanges(
                originalDiagramState.value,
                currentState
            );

            // Also check the store's modified flag
            const isModified = store.getters.modelChanged;

            log.debug('Diagram closing', { isModified, hasActualChanges });

            // Show confirmation if either the store says it's modified or our change tracker detects changes
            if ((!hasActualChanges && !isModified) || (await getConfirmModal())) {
                await store.dispatch(tmActions.diagramClosed);
                await store.dispatch(tmActions.diagramClosed);

                // Use setTimeout to ensure state is updated before navigation
                setTimeout(() => {
                    try {
                        log.debug('Closing diagram with provider', { provider: providerType.value });
                        const routeParams = { ...route.params };

                        // Remove diagram param as we're going back to the model view
                        if ('diagram' in routeParams) {
                            delete routeParams.diagram;
                        }

                        // Special handling for local provider
                        if (providerType.value === 'local') {
                            log.debug('Using local route structure for diagram close');
                            router.push({
                                name: 'localThreatModel',
                                params: {
                                    threatmodel: routeParams.threatmodel
                                },
                                replace: true
                            });
                            return;
                        }

                        // Provider-specific validation
                        if (providerType.value === 'google' && !routeParams.folder) {
                            log.error('Missing folder parameter for Google Drive route');
                            if (store.state.folder && store.state.folder.selected) {
                                routeParams.folder = store.state.folder.selected;
                            } else {
                                router.push({ name: 'googleFolder' });
                                return;
                            }
                        } else if (providerType.value === 'git' &&
                            (!routeParams.repository || !routeParams.branch)) {
                            log.error('Missing required Git parameters');
                            router.push({ name: 'MainDashboard' });
                            return;
                        }

                        log.debug('Navigating to ThreatModel', { provider: providerType.value, params: routeParams });
                        router.push({
                            name: `${providerType.value}ThreatModel`,
                            params: routeParams,
                            replace: true
                        });
                    } catch (error) {
                        log.error('Error during navigation', { error });
                        // Fallback to dashboard if navigation fails
                        router.push({ name: 'MainDashboard' });
                    }
                }, 0);
            }
        };

        // Lifecycle hooks
        onMounted(() => {
            init(); // Initializes graph, state, listeners

            // Add document-level event listener for threat selection
            document.addEventListener('threat-selected', documentThreatSelectedHandler);

            // Initialize stencil after DOM updates and graph is ready
            nextTick(() => {
                if (graph.value && stencilContainer.value) {
                    log.debug('Initializing stencil within nextTick');
                    stencilInstance.value = stencil.get(graph.value, stencilContainer.value);
                } else {
                    log.error('Graph or stencil container not ready for stencil initialization in nextTick');
                }
            });

            // Watch for locale changes and re-initialize stencil
            // Use i18nInstance?.locale?.value or a ref to ensure it's watchable
            const localeToWatch = i18nInstance?.locale || ref('eng');
            watch(localeToWatch, (newLocale, oldLocale) => {
                log.debug('Locale changed, reinitializing stencil', { from: oldLocale, to: newLocale });

                // Completely clean up the stencil container
                if (stencilContainer.value) {
                    // First dispose the stencil instance properly
                    if (stencilInstance.value && typeof stencilInstance.value.dispose === 'function') {
                        stencilInstance.value.dispose();
                        stencilInstance.value = null;
                    }

                    // Then clear the container's HTML content
                    stencilContainer.value.innerHTML = '';

                    // Re-initialize stencil with new localized strings
                    if (graph.value) {
                        log.debug('Reinitializing stencil with new locale');
                        nextTick(() => {
                            stencilInstance.value = stencil.get(graph.value, stencilContainer.value);
                        });
                    } else {
                        log.error('Graph not ready for stencil reinitialization');
                    }
                } else {
                    log.error('Stencil container not available for reinitialization');
                }
            });
        });

        onUnmounted(() => {
            // Remove document-level event listener
            document.removeEventListener('threat-selected', documentThreatSelectedHandler);

            // Dispose stencil instance if it exists
            if (stencilInstance.value && typeof stencilInstance.value.dispose === 'function') {
                stencilInstance.value.dispose();
            }
            diagramService.dispose(graph.value);
        });

        return {
            // Refs
            graph,
            graph_container: graphContainer,
            stencil_container: stencilContainer,
            threatEditDialog,
            threatSuggestDialog,

            // Computed state
            diagram,
            providerType,

            // Methods
            threatSelected,
            threatSuggest,
            saved,
            closed,

            // i18n
            t
        };
    }
};
</script>

<style lang="scss" scoped>
.diagram-editor {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 120px);
}

.td-graph-title {
    margin-right: 15px;
}

.main-content-row {
    flex: 1;
    height: 100%;
    overflow: hidden;
}

.stencil-column {
    height: 100%;
    padding: 0;
    border-right: 1px solid #eee;
}

.stencil-container {
    height: 100%;
    width: 100%;
    overflow-y: auto;
    position: relative;
}

.content-column {
    height: 100%;
    display: flex;
    flex-direction: column;
    min-width: 800px;
    /* Ensure minimum width for the graph area */
}

.header-row {
    padding: 8px;
}

.graph-row {
    flex: 1;
    overflow: hidden;
}

.graph-container {
    height: 100%;
    width: 100%;
}

/* Make the SVG viewport take up more space */
:deep(.x6-graph-svg-viewport) {
    width: 100% !important;
    height: 100% !important;
}

/* Style the X6 graph container to fit within its parent */
:deep(.x6-graph-svg-viewport) {
    width: 100%;
    height: 100%;
}

/*
 * Custom styling for the selection box
 * Original styles (for reference if we need to revert):
 * - Default orange color (from primary color)
 * - Default size (matches the element)
 * - Default border width (1-2px)
 */
:deep(.x6-widget-selection-box) {
    /* Make the selection box slightly smaller than the object */
    transform: scale(0.95);
    transform-origin: center;
    
    /* Change the border to 3px solid bright yellow */
    border: 3px solid yellow !important;
    
    /* Ensure the border is visible */
    box-sizing: border-box;
}
</style>