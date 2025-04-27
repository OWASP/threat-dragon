<template>
    <div>
        <b-modal
            id="threat-edit"
            ref="editModal"
            size="lg"
            ok-variant="primary"
            header-bg-variant="primary"
            header-text-variant="light"
            :title="modalTitle"
        >
            <b-form>
                <b-form-row>
                    <b-col>
                        <b-form-group id="title-group" :label="t('threats.properties.title')" label-for="title">
                            <b-form-input
                                id="title"
                                v-model="threat.title"
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
                            <b-form-select id="threat-type" v-model="threat.type" :options="types" />
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="5">
                        <b-form-group
                            id="status-group"
                            class="float-left"
                            :label="t('threats.properties.status')"
                            label-for="status"
                        >
                            <b-form-radio-group
                                id="status"
                                v-model="threat.status"
                                :options="statuses"
                                buttons
                            />
                        </b-form-group>
                    </b-col>

                    <b-col md="2">
                        <b-form-group id="score-group" :label="t('threats.properties.score')" label-for="score">
                            <b-form-input id="score" v-model="threat.score" type="text" />
                        </b-form-group>
                    </b-col>

                    <b-col md="5">
                        <b-form-group
                            id="priority-group"
                            class="float-right"
                            :label="t('threats.properties.priority')"
                            label-for="priority"
                        >
                            <b-form-radio-group
                                id="priority"
                                v-model="threat.severity"
                                :options="priorities"
                                buttons
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
                            <b-form-textarea id="description" v-model="threat.description" rows="5" />
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
                            <b-form-textarea id="mitigation" v-model="threat.mitigation" rows="5" />
                        </b-form-group>
                    </b-col>
                </b-form-row>
            </b-form>

            <template #modal-footer>
                <div class="w-100">
                    <b-button variant="danger" class="float-right" @click="acceptSuggestion()">
                        {{ t('forms.apply') }}
                    </b-button>
                    <b-button variant="secondary" class="float-left" @click="previous()">
                        {{ t('forms.previous') }}
                    </b-button>
                    <b-button variant="danger" class="float-left" @click="next()">
                        {{ t('forms.next') }}
                    </b-button>
                    <b-button variant="secondary" class="float-right mr-2" @click="hideModal()">
                        {{ t('forms.cancel') }}
                    </b-button>
                </div>
            </template>
        </b-modal>
    </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from '@/i18n';
import { v4 as uuidv4 } from 'uuid';
import { createNewTypedThreat } from '@/service/threats/index.js';
import { CELL_DATA_UPDATED } from '@/store/actions/cell.js';
import tmActions from '@/store/actions/threatmodel.js';
import dataChanged from '@/service/x6/graph/data-changed.js';
import threatModels from '@/service/threats/models/index.js';
import { GetContextSuggestions } from '@/service/threats/oats/context-generator.js';
import { useThreatEditor } from '@/composables/useThreatEditor.js';

export default {
    name: 'TdThreatSuggest',
    components: {
    },
    setup() {
        const store = useStore();
        
        // Safely get i18n functions
        let t = key => key;
        let _locale = { value: 'en' };
        try {
            const i18n = useI18n();
            if (i18n && i18n.t) {
                t = i18n.t;
                _locale = i18n.locale || _locale;
            }
        } catch (error) {
            console.warn('Error initializing i18n in ThreatSuggestDialog:', error);
        }

        // Refs for component state
        const editModal = ref(null);
        const suggestions = ref([]);
        const types = ref([]);
        const threat = ref({});
        const index = ref(0);

        // Get the threat editor composable
        const threatEditor = useThreatEditor();

        // Computed state from store
        const cell = computed(() => store.state.cell.ref);
        const modelType = computed(() => store.state.threatmodel.selectedDiagram.diagramType);
        const threatTop = computed(() => store.state.threatmodel.data.detail.threatTop);

        // Computed properties
        const threatTypes = computed(() => {
            if (!cell.value || !threat.value || !modelType.value) return [];

            const res = [];
            const threattypes = threatModels.getThreatTypesByElement(
                modelType.value,
                cell.value.data.type
            );

            Object.keys(threattypes).forEach((type) => {
                res.push(t(type));
            });

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

        const modalTitle = computed(() =>
            t('threats.newThreat') + ' #' + (threatTop.value + 1)
        );

        // Methods
        const showModal = (type) => {
            index.value = 0;
            suggestions.value = [];

            const tmpThreat = createNewTypedThreat(
                modelType.value,
                cell.value.data.type,
                threatTop.value + 1
            );

            types.value = [...threatTypes.value];

            if (type === 'type') {
                threatTypes.value.forEach((t, ind) => {
                    suggestions.value.push({ ...tmpThreat });
                    if (suggestions.value[ind]) {
                        suggestions.value[ind].type = t;
                    }
                });
            } else {
                suggestions.value = GetContextSuggestions(cell.value.data, modelType.value).map(
                    (suggestion) => {
                        const suggestionThreat = { ...tmpThreat };
                        suggestionThreat.title = suggestion.title;
                        suggestionThreat.type = t(suggestion.type);

                        if (!types.value.includes(suggestionThreat.type) && suggestionThreat.type !== '') {
                            types.value.push(suggestionThreat.type);
                        }

                        suggestionThreat.description = suggestion.description;
                        suggestionThreat.mitigation = suggestion.mitigation;

                        return suggestionThreat;
                    }
                );
            }

            if (suggestions.value.length) {
                threat.value = suggestions.value[0];
            }

            if (editModal.value) {
                editModal.value.show();
            }
        };

        const hideModal = () => {
            // Make sure we clean up everything to prevent accidental additions
            threat.value = {};
            suggestions.value = [];
            types.value = [];
            index.value = 0;

            // If any temporary threats were added, clean them up
            if (cell.value && cell.value.data && cell.value.data.threats) {
                cell.value.data.threats = cell.value.data.threats.filter(t => !t.new);
                cell.value.data.hasOpenThreats = cell.value.data.threats.some(
                    (t) => t.status === 'Open'
                );

                store.dispatch(CELL_DATA_UPDATED, cell.value.data);
                dataChanged.updateStyleAttrs(cell.value);
            }

            if (editModal.value) {
                editModal.value.hide();
            }
        };

        const next = () => {
            index.value++;
            if (index.value >= suggestions.value.length) {
                hideModal();
                index.value = 0;
                return;
            }

            threat.value = suggestions.value[index.value];
        };

        const previous = () => {
            if (index.value > 0) {
                index.value--;
                threat.value = suggestions.value[index.value];
            }
        };

        const acceptSuggestion = () => {
            if (!cell.value || !cell.value.data) return;

            const objRef = cell.value.data;
            threat.value.number = threatTop.value + 1;
            threat.value.id = uuidv4();

            // Update threat frequency if needed
            if (!objRef.threatFrequency) {
                const tmpfreq = threatModels.getFrequencyMapByElement(
                    threat.value.modelType,
                    cell.value.data.type
                );

                if (tmpfreq !== null) {
                    objRef.threatFrequency = tmpfreq;
                }
            }

            if (objRef.threatFrequency) {
                Object.keys(objRef.threatFrequency).forEach((k) => {
                    if (
                        t(`threats.model.${modelType.value.toLowerCase()}.${k}`) === threat.value.type &&
                        threatTypes.value.includes(threat.value.type)
                    ) {
                        objRef.threatFrequency[k]++;
                    }
                });
            }

            // Mark it as a real threat, not a temporary one
            threat.value.new = false;

            // Initialize threats array if it doesn't exist
            if (!objRef.threats) {
                objRef.threats = [];
            }

            // Add the threat to the cell
            objRef.threats.push({ ...threat.value });

            // Update UI state
            objRef.hasOpenThreats = objRef.threats.some(t => t.status === 'Open');

            // Update store
            store.dispatch(tmActions.update, { threatTop: threatTop.value + 1 });
            store.dispatch(tmActions.modified);
            store.dispatch(CELL_DATA_UPDATED, objRef);
            dataChanged.updateStyleAttrs(cell.value);

            // Move to next suggestion
            next();
        };

        return {
            // Refs
            editModal,
            suggestions,
            types,
            threat,
            index,

            // Computed
            cell,
            modelType,
            threatTop,
            threatTypes,
            statuses,
            priorities,
            modalTitle,

            // Methods
            showModal,
            hideModal,
            next,
            previous,
            acceptSuggestion,

            // ThreatEditor composable
            ...threatEditor,

            // i18n
            t
        };
    }
};
</script>
