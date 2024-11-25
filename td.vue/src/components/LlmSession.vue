<template>
    <div>
        <b-modal
            v-if="!!session"
            id="llm-session"
            size="lg"
            header-bg-variant="primary"
            header-text-variant="light"
            :title="getModalTitle()"
            ref="editModal"
        >
            <b-form>
                <b-form-row>
                    <b-col md=5>
                        <b-form-group
                            id="llm-group"
                            class="float-left"
                            :label="$t('llm.provider')"
                            label-for="llmProvider">
                            <b-form-radio-group
                                id="provider"
                                v-model="session.provider"
                                :options="llmModels"
                                buttons
                            ></b-form-radio-group>
                        </b-form-group>
                    </b-col>

                    <b-col md=3>
                        <b-form-group
                            id="count-group"
                            :label="$t('llm.properties.number')"
                            label-for="count">
                            <b-form-input
                                id="count"
                                v-model="session.count"
                                type="text"
                                :disabled="isProcessing"
                            ></b-form-input>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col>
                        <b-form-group
                            id="description-group"
                            :label="$t('llm.context')"
                            label-for="description">
                            <b-form-textarea
                                id="description"
                                placeholder="Provide additional context here..."
                                v-model="session.context"
                                rows="5"
                                :disabled="isProcessing">
                            </b-form-textarea>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row
                    v-if="isProcessing"     
                >
                    <b-col>
                        <b-progress
                            max="100"
                            animated
                            show-progress
                            height="20px"
                            variant="success"
                        >
                        <b-progress-bar :value="progress" :label="progress + '%'"></b-progress-bar>
                        </b-progress>
                        <p>{{ progressStatus }}</p>
                    </b-col>
                </b-form-row>
            </b-form>
            <b-row>
                <b-col style="display: flex;    width: 100vw; ">
                    <div
                        id="graph-container"
                        ref="graph_container"
                        style="height: 50%; width: 100%; flex: 1; visibility: hidden"
                    ></div>
                </b-col>
            </b-row>

            <template #modal-footer>
                <div class="w-100">
                    <b-button
                        id="startSessionButton"
                        variant="danger"
                        class="float-right"
                        v-if="!isProcessing"    
                        @click="startSession()"
                    >
                        {{ $t('forms.startSession') }}
                    </b-button>
                    <b-button
                        id="cancelSessionButton"
                        variant="secondary"
                        class="float-right mr-2"
                        v-if="!isProcessing"    
                        @click="hideModal()"
                    >
                        {{ $t('forms.cancel') }}
                    </b-button>
                    <b-button
                        id="closeSessionButton"
                        variant="danger"
                        class="float-right mr-2"
                        v-if="isProcessing"    
                        @click="hideModal()"
                    >
                        {{ $t('forms.close') }}
                    </b-button>
                </div>
            </template>
        </b-modal>
    </div>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import { createLlmThreats } from '@/service/threats/genthreats.js';
import dataChanged from '@/service/x6/graph/data-changed.js';
import { CELL_DATA_UPDATED, CELL_SELECTED, CELL_UNSELECTED } from '@/store/actions/cell.js';
import { THREATMODEL_DIAGRAM_MODIFIED, THREATMODEL_UPDATE, THREATMODEL_DIAGRAM_APPLIED, THREATMODEL_MODIFIED} from '@/store/actions/threatmodel.js';
import { LOADER_FINISHED, LOADER_STARTED } from '@/store/actions/loader.js';

export default {
    name: 'TdLlmSession',
    computed: {
        ...mapState({
            cell: (state) => state.cell,
            cellRef: (state) => state.cell.ref,
            threatTop: (state) => state.threatmodel.data.detail.threatTop,
            diagram: (state) => state.threatmodel.selectedDiagram,
            threats: (state) => state.cell.threats,
            threatmodel: (state) => state.threatmodel.data
        }),
        llmModels() {
            return [
                { value: 'openai', text: this.$t('llm.models.openai'), disabled: this.isProcessing },
                { value: 'gemini', text: this.$t('llm.models.gemini'), disabled: true },
                { value: 'llama', text: this.$t('llm.models.llama'), disabled: true }
            ];
        },
        modalTitle() {
            return this.$t('llm.session');
        }
    },
    data() {
        return {
            session: {
                provider: 'openai',
                count: 5,
                context: '',
            },
            progress: 0,               // Track percentage progress
            progressStatus: '',        // Status message
            isProcessing: false,       // Flag to control button state
            cells_processed: 0,        // Track number of cells processed
            cells_total: 0,            // Total number of cells to process
        };
    },
    methods: {
        prepareSession(type, graph) {
            this.graph = graph;
            this.session.type = type;
            this.showModal();
        },
        getModalTitle() {
            return `LLM Threat Modeling session`;
        },
        getMethods(obj) {
            var result = [];
            for (var id in obj) {
                try {
                    if (typeof(obj[id]) == 'function') {
                        result.push(id + ': ' + obj[id].toString());
                    }
                } catch (err) {
                    result.push(id + ': inaccessible');
                }
            }
            return result;
        },
        async printErrorMessage(error) {
            console.error(error);
            Vue.$toast.error(error);
        },
        handleResponse(response, cell) {
            if (response.status == 200) {
                response.threats.forEach((threat) => {
                    console.debug('new threat ID: ' + threat.id);
                    cell.data.threats.push(threat);
                    cell.data.hasOpenThreats = cell.data.threats.length > 0;
                    this.$store.dispatch(THREATMODEL_UPDATE, { threatTop: this.threatTop+1 });
                });
            }
            else if (response.status == 401) {
                let error_msg = 'You must be authenticated to access the LLM API';
                this.printErrorMessage(error_msg);
            }
            else if (response.status == 403) {
                let error_msg = 'Request to LLM API failed (403 Forbidden)';
                this.printErrorMessage(error_msg);
            }
            else {
                let error_msg = 'Threat generation failed for this component';
                this.printErrorMessage(error_msg);
            }
        },
        async threatsForComponent() {
            try {
                // PREPARE PROGRESS BAR
                this.cells_processed = 0;
                this.cells_total = 1;
                this.progressStatus = `Processing ${this.cells_total} cell...`;

                // GET AND HANDLE RESPONSE
                let response = await createLlmThreats(this.threatmodel, this.diagram, this.cellRef, this.threatTop + 1, this.session);
                this.$store.dispatch(LOADER_STARTED);
                this.handleResponse(response, this.cellRef);
                if (response.status != 200) {
                    throw new Error('Threat generation failed for this component');
                }

                // UPDATE PROGRESS
                this.cells_processed++;
                this.progress = Math.floor(((this.cells_processed) / this.cells_total) * 100);

                // UPDATE CELL DATA AND STYLES
                this.$store.dispatch(CELL_DATA_UPDATED, this.cellRef.data);
                dataChanged.updateStyleAttrs(this.cellRef);

                // THREAT MODEL AND THREAT DIAGRAM MODIFIED
                this.$store.dispatch(THREATMODEL_DIAGRAM_MODIFIED, this.diagram);
                this.$store.dispatch(THREATMODEL_DIAGRAM_APPLIED);
                this.$store.dispatch(THREATMODEL_MODIFIED);
                

                // Finish successfully
                this.progressStatus = 'Threat modeling session finished!';
                Vue.$toast.success('Threats generated successfully');
            }
            catch (error) {
                console.error(error);
                this.progressStatus = 'Error in threat modeling session.';
                this.progress = 100;
                this.$store.dispatch(LOADER_FINISHED);
            }
        },
        async threatsForDiagram() {
            try {
                // PREPARE PROGRESS BAR
                this.cells_processed = 0;
                this.cells_total = this.graph.getCells().length;
                this.progressStatus = `Processing ${this.cells_total} cells...`;

                // ITERATE OVER ALL DIAGRAM'S CELLS
                const cellPromises = this.graph.getCells().map(async (cell) => {
                    if (cell.data.type != 'tm.Boundary' && cell.data.outOfScope == false) {
                        // GET AND HANDLE RESPONSE
                        let response = await createLlmThreats(this.threatmodel, this.diagram, cell, this.threatTop + 1, this.session);
                        this.$store.dispatch(LOADER_STARTED);
                        this.handleResponse(response, cell);
                        if (response.status != 200) {
                            throw new Error('Threat generation failed for this diagram');
                        }

                        // UPDATE CELL DATA AND STYLES
                        this.$store.dispatch(CELL_SELECTED, cell);
                        this.$store.dispatch(CELL_DATA_UPDATED, cell.data);
                        dataChanged.updateStyleAttrs(cell);
                        this.$store.dispatch(CELL_UNSELECTED);
                    }

                    // UPDATE PROGRESS
                    this.cells_processed += 1;
                    this.progress = Math.floor(((this.cells_processed) / this.cells_total) * 100);
                });
                
                // Wait for all promises to complete
                await Promise.all(cellPromises);

                // THREAT MODEL AND THREAT DIAGRAM MODIFIED
                this.$store.dispatch(THREATMODEL_DIAGRAM_MODIFIED, this.diagram);
                this.$store.dispatch(THREATMODEL_DIAGRAM_APPLIED);
                this.$store.dispatch(THREATMODEL_MODIFIED);

                // Finish successfully
                this.progressStatus = 'Threat modeling session finished!';
                Vue.$toast.success('Threats generated successfully');
            }
            catch (error) {
                this.progressStatus = 'Error in threat modeling session.';
                this.progress = 100;
                this.$store.dispatch(LOADER_FINISHED);
                console.error(error);
            }
        },
        async startSession() {
            // SHOW LOADER
            this.$store.dispatch(LOADER_STARTED);
            this.isProcessing = true;
            this.progressStatus = 'Starting session...';
            
            // PROCESS REQUEST DEPENDING ON SESSION TYPE
            if (this.session.type == 'component') {
                await this.threatsForComponent();
            }
            else if (this.session.type == 'diagram') {
                await this.threatsForDiagram();
            }

            // HIDE LOADER
            this.$store.dispatch(LOADER_FINISHED);
        },
        hideModal() {
            this.$refs.editModal.hide();
            this.isProcessing = false;
            this.progressStatus = '';
            this.progress = 0;
            this.$store.dispatch(LOADER_FINISHED);
            
        },
        showModal() {
            this.isProcessing = false;
            this.progressStatus = '';
            this.progress = 0;
            this.$refs.editModal.show();
        },
    }
};

</script>
