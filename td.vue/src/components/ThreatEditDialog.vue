<template>
    <div>
        <b-modal
            v-if="editingThreat"
            id="threat-edit"
            ref="editModal"
            size="lg"
            ok-variant="primary"
            header-bg-variant="primary"
            header-text-variant="light"
            :title="modalTitle"
            no-close-on-backdrop
            no-close-on-esc
            hide-footer
            @hidden="onModalHidden"
            @ok="onSave"
        >
            <b-form>
                <b-form-row>
                    <b-col>
                        <b-form-group id="title-group" :label="t('threats.properties.title')" label-for="title">
                            <b-form-input
                                id="title"
                                v-model="editingThreat.title"
                                type="text"
                                required
                            />
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col>
                        <b-form-group
                            id="threat-type-group"
                            :label="t('threats.properties.type')"
                            label-for="threat-type"
                        >
                            <b-form-select id="threat-type" v-model="editingThreat.type" :options="threatTypes" />
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row class="threat-controls-row">
                    <b-col md="4" class="status-col">
                        <b-form-group
                            id="status-group"
                            :label="t('threats.properties.status')"
                            label-for="status"
                            class="text-left"
                        >
                            <b-form-radio-group
                                id="status"
                                v-model="editingThreat.status"
                                :options="statuses"
                                buttons
                                size="sm"
                                button-variant="outline-secondary"
                                class="status-radio-group"
                            />
                        </b-form-group>
                    </b-col>

                    <b-col md="2" class="score-col">
                        <b-form-group
                            id="score-group"
                            :label="t('threats.properties.score')"
                            label-for="score"
                            class="text-center"
                        >
                            <b-form-input
                                id="score"
                                v-model="editingThreat.score"
                                type="text"
                                class="text-center"
                            />
                        </b-form-group>
                    </b-col>

                    <b-col md="6" class="priority-col">
                        <b-form-group
                            id="priority-group"
                            :label="t('threats.properties.priority')"
                            label-for="priority"
                            class="text-right"
                        >
                            <b-form-radio-group
                                id="priority"
                                v-model="editingThreat.severity"
                                :options="priorities"
                                buttons
                                size="sm"
                                button-variant="outline-secondary"
                                class="priority-radio-group"
                            />
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col>
                        <b-form-group
                            id="description-group"
                            :label="t('threats.properties.description')"
                            label-for="description"
                        >
                            <b-form-textarea id="description" v-model="editingThreat.description" rows="5" />
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col>
                        <b-form-group
                            id="mitigation-group"
                            :label="t('threats.properties.mitigation')"
                            label-for="mitigation"
                        >
                            <b-form-textarea id="mitigation" v-model="editingThreat.mitigation" rows="5" />
                        </b-form-group>
                    </b-col>
                </b-form-row>
            </b-form>

            <template #footer>
                <div class="w-100 d-flex justify-content-between">
                    <div class="left-buttons">
                        <!-- Only show Delete button for existing threats -->
                        <b-button v-if="editingThreat && !isNewThreat" variant="danger" @click="onDelete">
                            {{ t('forms.delete') }}
                        </b-button>
                    </div>
                    <div class="right-buttons">
                        <b-button variant="secondary" class="mr-2" @click="onCancel">
                            {{ t('forms.cancel') }}
                        </b-button>
                        <b-button variant="primary" :disabled="!hasChanges" @click="onSave">
                            {{ isNewThreat ? t('forms.create') : t('forms.save') }}
                        </b-button>
                    </div>
                </div>
            </template>
        </b-modal>
    </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import threatModels from '@/service/threats/models/index.js';
import { useThreatEditor } from '@/composables/useThreatEditor';
import { useI18n } from '@/i18n/index.js';
import logger from '@/utils/logger.js';

// Create a context-specific logger
const log = logger.getLogger('component:ThreatEditDialog');

/**
 * ThreatEditDialog Component
 * Responsible for editing individual threats within the threat model
 */
export default {
    name: 'TdThreatEditDialog',
    components: {
    },
    setup() {
        const {
            editingThreat,
            isEditing,
            isNewThreat,
            saveThreat,
            cancelEdit,
            deleteThreat,
            editExistingThreat,
            originalThreat,
            createNewThreat, // Now we need this in this component
            resetState // Expose resetState to be called after saving
        } = useThreatEditor();

        const editModal = ref(null);
        const hasChanges = ref(false);

        // Store reference to the store for use in methods
        const store = useStore();

        // Use Vue 3's Composition API for i18n
        const { t } = useI18n();

        // Computed properties for form data
        const modalTitle = computed(() => {
            if (!editingThreat.value) return '';
            return isNewThreat.value
                ? `${t('threats.new')} #${editingThreat.value.number}`
                : `${t('threats.edit')} #${editingThreat.value.number}`;
        });

        const threatTypes = computed(() => {
            if (!editingThreat.value?.modelType) {
                return [];
            }

            const store = useStore();
            const cell = store.state.cell.ref;
            if (!cell || !cell.data) {
                return [];
            }

            const res = [];
            const threatTypesMap = threatModels.getThreatTypesByElement(
                editingThreat.value.modelType,
                cell.data.type
            );
            Object.keys(threatTypesMap).forEach((type) => {
                res.push(t(type));
            });
            if (!res.includes(editingThreat.value.type)) {
                res.push(editingThreat.value.type);
            }
            return res;
        });

        const statuses = computed(() => [
            { value: 'NotApplicable', text: t('threats.status.notApplicable') },
            { value: 'Open', text: t('threats.status.open') },
            { value: 'Mitigated', text: t('threats.status.mitigated') }
        ]);

        const priorities = computed(() => [
            { value: 'TBD', text: t('threats.priority.tbd') },
            { value: 'Low', text: t('threats.priority.low') },
            { value: 'Medium', text: t('threats.priority.medium') },
            { value: 'High', text: t('threats.priority.high') },
            { value: 'Critical', text: t('threats.priority.critical') }
        ]);

        // Methods
        const showDialog = (threatId, mode) => {
            log.debug('showDialog called', { threatId, mode });

            try {
                // Validate inputs
                if (!threatId) {
                    log.error('Invalid threatId provided to showDialog', { threatId });
                    return;
                }

                // Log cell reference state before processing
                const cellRef = store?.state?.cell?.ref;
                log.debug('Cell reference state at start of showDialog', {
                    cellExists: !!cellRef,
                    cellData: cellRef ? !!cellRef.data : 'no cell',
                    cellId: cellRef ? cellRef.id : 'no cell'
                });

                if (mode === 'new') {
                    // For new threats, the threatId is already for the in-memory threat
                    // The threat has already been created by createNewThreat in GraphMeta
                    log.debug('Processing new threat', { threatId });

                    // Ensure the threat is properly initialized
                    if (!editingThreat.value || editingThreat.value.id !== threatId) {
                        log.debug('Threat not properly initialized, attempting to recover');

                        // Access the cell from the store reference we created in setup()
                        const cell = store?.state?.cell?.ref;

                        if (cell && cell.data) {
                            // Get the diagram and threatTop from store
                            const diagram = store?.state?.threatmodel?.selectedDiagram;
                            const threatTop = store?.state?.threatmodel?.data?.detail?.threatTop;

                            if (diagram && typeof threatTop !== 'undefined') {
                                // Create a new threat using the createNewThreat from setup()
                                createNewThreat(
                                    diagram.diagramType,
                                    cell.data.type,
                                    threatTop
                                );
                                log.debug('Successfully re-created threat', { threatId });
                            } else {
                                log.error('Cannot recover threat: Missing diagram or threatTop');
                            }
                        } else {
                            log.error('Cannot recover threat: No cell selected');
                        }

                        // Set the new threat flag
                        isNewThreat.value = true;
                    }

                    // New threats are always considered changed
                    hasChanges.value = true;
                    log.debug('New threat dialog opened, hasChanges set to true');
                } else {
                    // For existing threats, load from store
                    log.debug('Loading existing threat', { threatId });
                    editExistingThreat(threatId);
                    hasChanges.value = false; // Initially no changes for existing threats
                }

                // Use multiple timeouts to ensure the threat data is loaded before showing the modal
                // This helps with timing issues and ensures the dialog appears reliably
                const showModalWithRetry = (attempts = 0) => {
                    if (!editModal.value) {
                        if (attempts < 5) {
                            log.debug('Modal ref not available, retrying', { attempt: attempts + 1 });
                            setTimeout(() => showModalWithRetry(attempts + 1), 50 * (attempts + 1));
                        } else {
                            log.error('Failed to show modal after multiple attempts');
                        }
                        return;
                    }

                    // Log cell reference state right before showing modal
                    const cellRefBeforeShow = store?.state?.cell?.ref;
                    log.debug('Cell reference state before showing modal', {
                        cellExists: !!cellRefBeforeShow,
                        cellData: cellRefBeforeShow ? !!cellRefBeforeShow.data : 'no cell',
                        cellId: cellRefBeforeShow ? cellRefBeforeShow.id : 'no cell'
                    });

                    log.debug('Showing threat edit modal');
                    editModal.value.show();
                };

                // Start the show process with retries
                showModalWithRetry();
            } catch (error) {
                log.error('Error showing threat edit dialog', { error });
            }
        };

        // Watch for changes in the editing threat
        watch(() => editingThreat.value, (newValue, _oldValue) => {
            if (newValue && originalThreat.value) {
                // Compare the current threat with the original to detect changes
                const currentJson = JSON.stringify(newValue);
                const originalJson = JSON.stringify(originalThreat.value);
                hasChanges.value = currentJson !== originalJson || isNewThreat.value;
                log.debug('Threat changed', { hasChanges: hasChanges.value });
            }
        }, { deep: true });

        // Event handlers
        const onSave = () => {
            log.debug('onSave called', {
                isNewThreat: isNewThreat.value,
                hasChanges: hasChanges.value,
                editingThreatExists: !!editingThreat.value,
                editingThreatId: editingThreat.value ? editingThreat.value.id : 'null'
            });

            // For new threats, always save regardless of hasChanges
            // For existing threats, only save if changes were made
            if (isNewThreat.value || hasChanges.value) {
                log.debug('Saving threat', { isNew: isNewThreat.value, hasChanges: hasChanges.value });

                // Check if the cell reference is available
                const cellRef = store.state.cell.ref;
                log.debug('Cell reference check before saveThreat', {
                    cellExists: !!cellRef,
                    cellData: cellRef ? !!cellRef.data : 'no cell',
                    cellId: cellRef ? cellRef.id : 'no cell',
                    cellThreats: cellRef && cellRef.data && cellRef.data.threats ? cellRef.data.threats.length : 'no threats'
                });

                // Check if the threat is properly initialized
                if (editingThreat.value) {
                    log.debug('Threat being saved', {
                        id: editingThreat.value.id,
                        title: editingThreat.value.title,
                        status: editingThreat.value.status,
                        severity: editingThreat.value.severity
                    });
                }

                // Call saveThreat to save the threat to the store
                // Note: saveThreat no longer calls resetState() internally
                saveThreat();

                // Check cell reference after saving
                const cellRefAfter = store.state.cell.ref;
                log.debug('Cell reference check after saveThreat', {
                    cellExists: !!cellRefAfter,
                    cellData: cellRefAfter ? !!cellRefAfter.data : 'no cell',
                    cellId: cellRefAfter ? cellRefAfter.id : 'no cell',
                    cellThreats: cellRefAfter && cellRefAfter.data && cellRefAfter.data.threats ? cellRefAfter.data.threats.length : 'no threats'
                });

                hasChanges.value = false;

                // Set isEditing to false to prevent cancelEdit from being called in onModalHidden
                isEditing.value = false;
                log.debug('Set isEditing to false after saving threat');

                // Now manually call resetState to clean up the threat editor state
                // This ensures the state is reset after we've updated our UI state
                resetState();
                log.debug('Called resetState after saving threat');

                // Hide the modal after saving
                if (editModal.value) {
                    log.debug('Hiding modal after save');
                    editModal.value.hide();
                }
            } else {
                log.debug('Not saving threat - no changes detected');
            }
        };

        const onCancel = () => {
            cancelEdit();
            hasChanges.value = false;
            hideDialog();
        };

        const onDelete = async () => {
            // Import the modal helper to access the confirmation dialog
            const { showConfirmDialog } = await import('@/utils/modal-helper.js');

            // Use the confirmation dialog that doesn't depend on this.$bvModal
            const confirmed = await showConfirmDialog(null, {
                title: t('threats.confirmDeleteTitle'),
                message: t('threats.confirmDeleteMessage'),
                okTitle: t('forms.delete'),
                cancelTitle: t('forms.cancel'),
                okVariant: 'danger'
            });

            if (confirmed) {
                deleteThreat();
                hideDialog();
            }
        };

        const hideDialog = () => {
            if (editModal.value) {
                editModal.value.hide();
            }
        };

        const onModalHidden = () => {
            log.debug('Modal hidden event triggered');

            // Check cell reference state when modal is hidden
            const cellRef = store?.state?.cell?.ref;
            log.debug('Cell reference state when modal is hidden', {
                cellExists: !!cellRef,
                cellData: cellRef ? !!cellRef.data : 'no cell',
                cellId: cellRef ? cellRef.id : 'no cell'
            });

            // If modal is closed via escape key or clicking outside
            // Only call cancelEdit if we're still in editing state
            // This prevents cancelEdit from being called after a successful save
            if (isEditing.value) {
                log.debug('Still in editing state, calling cancelEdit()');
                cancelEdit();
            } else {
                log.debug('Not in editing state, skipping cancelEdit()');
            }
        };

        // Watch for isEditing changes
        watch(isEditing, (newValue) => {
            if (!newValue && editModal.value) {
                hideDialog();
            }
        });

        return {
            editModal,
            editingThreat,
            isNewThreat,
            modalTitle,
            threatTypes,
            statuses,
            priorities,
            hasChanges,
            t, // Expose the translation function to the template
            showDialog,
            onSave,
            onCancel,
            onDelete,
            onModalHidden
        };
    }
};
</script>

<style lang="scss" scoped>
/* --- Modal Form Styling --- */

/* Consistent spacing between form rows */
:deep(.form-row) {
    margin-bottom: 1.25rem;
}

/* Form group styling */
:deep(.form-group) {
    margin-bottom: 0.75rem;
}

/* Label styling */
:deep(label) {
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
}

/* Input controls */
:deep(.form-control) {
    padding: 0.5rem 0.75rem;
    line-height: 1.5;
}

/* Textarea styling - consistent with the GraphProperties component */
:deep(textarea.form-control) {
    height: auto !important;
    resize: none !important;
    min-height: 100px;
}

/* Status, Score, Priority row styling */
.threat-controls-row {
    display: flex;
    flex-wrap: nowrap;
    align-items: flex-start;

    .status-col {
        display: flex;
        justify-content: flex-start;

        :deep(.form-group) {
            width: 100%;
        }

        :deep(.status-radio-group) {
            display: flex;
            justify-content: flex-start;
            max-width: 100%;

            .btn {
                padding: 0.375rem 0.5rem;
                font-size: 0.8rem;
            }
        }
    }

    .score-col {
        display: flex;
        justify-content: center;

        :deep(.form-group) {
            width: 100%;
            text-align: center;
        }
    }

    .priority-col {
        display: flex;
        justify-content: flex-end;

        :deep(.form-group) {
            width: 100%;
            text-align: right;
        }

        :deep(.priority-radio-group) {
            display: flex;
            justify-content: flex-end;
            max-width: 100%;

            .btn {
                padding: 0.375rem 0.5rem;
                font-size: 0.8rem;
            }
        }
    }
}

/* Radio/button group styling */
:deep(.btn-group) {
    margin-top: 0.25rem;
    display: flex;
    flex-wrap: nowrap;
}

/* Style the radio buttons to fit within width */
:deep(.btn-group .btn) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.8rem;
    padding: 0.375rem 0.4rem;
    flex: 0 1 auto;
    min-width: auto;
}

/* Make buttons in priority and status group more compact */
:deep(.status-radio-group .btn),
:deep(.priority-radio-group .btn) {
    max-width: 90px;
    /* Prevent buttons from growing too wide */
}

/* Make small screens stack properly */
@media (max-width: 767.98px) {
    .threat-controls-row {
        flex-direction: column;

        .status-col,
        .score-col,
        .priority-col {
            margin-bottom: 1rem;
            width: 100%;
            max-width: 100%;
            flex: 0 0 100%;

            :deep(.form-group) {
                text-align: left;
            }

            :deep(.status-radio-group),
            :deep(.priority-radio-group) {
                justify-content: flex-start;
            }
        }
    }
}

/* --- Modal Footer Styling --- */

/* Footer button layout */
:deep(.modal-footer) {
    padding: 1rem;
}

/* Button groups */
.left-buttons,
.right-buttons {
    display: flex;
    align-items: center;
}

/* Button styling */
:deep(.btn) {
    padding: 0.5rem 1rem;
    min-width: 90px;
}

/* Responsive button layout for small screens */
@media (max-width: 575.98px) {
    .w-100.d-flex {
        flex-direction: column;
        gap: 1rem;
    }

    .left-buttons,
    .right-buttons {
        width: 100%;
        justify-content: center;
    }
}
</style>