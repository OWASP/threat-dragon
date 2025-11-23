<template>
    <div>
        <b-modal id="threat-edit" size="lg" ok-variant="primary" header-bg-variant="primary" header-text-variant="light"
            :title="modalTitle" ref="editModal">
            <b-form>
                <b-form-row>
                    <b-col>
                        <b-form-group id="title-group" :label="$t('threats.properties.title')" label-for="title">
                            <b-form-input id="title" v-model="threat.title" type="text" required></b-form-input>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col>
                        <b-form-group id="threat-type-group" :label="$t('threats.properties.type')"
                            label-for="threat-type">
                            <b-form-select id="threat-type" v-model="threat.type" :options="types">
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md=5>
                        <b-form-group id="status-group" class="float-left" :label="$t('threats.properties.status')"
                            label-for="status">
                            <b-form-radio-group id="status" v-model="threat.status" :options="statuses"
                                buttons></b-form-radio-group>
                        </b-form-group>
                    </b-col>

                    <b-col md=2>
                        <b-form-group id="score-group" :label="$t('threats.properties.score')" label-for="score">
                            <b-form-input id="score" v-model="threat.score" type="text"></b-form-input>
                        </b-form-group>
                    </b-col>

                    <b-col md=5>
                        <b-form-group id="severity-group" class="float-right" :label="$t('threats.properties.severity')"
                            label-for="severity">
                            <b-form-radio-group id="severity" v-model="threat.severity" :options="priorities"
                                buttons></b-form-radio-group>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col>
                        <b-form-group id="description-group" :label="$t('threats.properties.description')"
                            label-for="description">
                            <b-form-textarea id="description" v-model="threat.description" rows="5">
                            </b-form-textarea>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col>
                        <b-form-group id="mitigation-group" :label="$t('threats.properties.mitigation')"
                            label-for="mitigation">
                            <b-form-textarea id="mitigation" v-model="threat.mitigation" rows="5">
                            </b-form-textarea>
                        </b-form-group>
                    </b-col>
                </b-form-row>
            </b-form>

            <template #modal-footer>
                <div class="w-100">
                    <b-button variant="danger" class="float-right" @click="acceptSuggestion()">
                        {{ $t('forms.apply') }}
                    </b-button>
                    <b-button variant="secondary" class="float-left" @click="previous()">
                        {{ $t('forms.previous') }}
                    </b-button>
                    <b-button variant="danger" class="float-left" @click="next()">
                        {{ $t('forms.next') }}
                    </b-button>
                    <b-button variant="secondary" class="float-right mr-2" @click="hideModal()">
                        {{ $t('forms.cancel') }}
                    </b-button>
                </div>
            </template>
        </b-modal>
    </div>
</template>


<script>
import { mapState } from 'vuex';
import { createNewTypedThreat } from '@/service/threats/index.js';
import { CELL_DATA_UPDATED } from '@/store/actions/cell.js';
import tmActions from '@/store/actions/threatmodel.js';
import dataChanged from '@/service/x6/graph/data-changed.js';
import threatModels from '@/service/threats/models/index.js';
import { GetContextSuggestions } from '@/service/threats/oats/context-generator.js';
import { v4 as uuidv4 } from 'uuid';
export default {
    name: 'TdThreatSuggest',
    computed: {
        ...mapState({
            cellRef: (state) => state.cell.ref,
            modelType: (state) => state.threatmodel.selectedDiagram.diagramType,
            threatTop: (state) => state.threatmodel.data.detail.threatTop
        }),
        threatTypes() {
            if (!this.cellRef || !this.threat || !this.modelType)
                return [];
            const res = [];
            const threattypes = threatModels.getThreatTypesByElement(this.modelType, this.cellRef.data.type);
            Object.keys(threattypes).forEach((type) => {
                res.push(this.$t(type));
            }, this);
            return res;
        },
        statuses() {
            return [
                { value: 'NotApplicable', text: this.$t('threats.status.notApplicable') },
                { value: 'Open', text: this.$t('threats.status.open') },
                { value: 'Mitigated', text: this.$t('threats.status.mitigated') }
            ];
        },
        priorities() {
            return [
                { value: 'TBD', text: this.$t('threats.severity.tbd') },
                { value: 'Low', text: this.$t('threats.severity.low') },
                { value: 'Medium', text: this.$t('threats.severity.medium') },
                { value: 'High', text: this.$t('threats.severity.high') },
                { value: 'Critical', text: this.$t('threats.severity.critical') }
            ];
        },
        modalTitle() { return this.$t('threats.newThreat') + ' #' + (this.threatTop + 1); }
    },
    data() {
        return {
            suggestions: [],
            types: [],
            threat: {},
            index: 0
        };
    },
    methods: {
        showModal(type) {
            this.index = 0;
            const tmpThreat = createNewTypedThreat(this.modelType, this.cellRef.data.type, this.threatTop + 1);
            this.types = [...this.threatTypes];
            if (type == 'type') {
                this.threatTypes.map((t, ind) => {
                    console.log(t);
                    this.suggestions.push({ ...tmpThreat });
                    this.suggestions[ind].type = t;
                });
            } else {
                this.suggestions = GetContextSuggestions(this.cellRef.data, this.modelType).map((suggestion) => {
                    tmpThreat.title = suggestion.title;
                    tmpThreat.type = this.$t(suggestion.type);
                    if (!this.types.includes(tmpThreat.type) && tmpThreat.type !== '')
                        this.types.push(tmpThreat.type);
                    tmpThreat.description = suggestion.description;
                    tmpThreat.mitigation = suggestion.mitigation;
                    console.log(tmpThreat);
                    return { ...tmpThreat };
                });
            }
            if (this.suggestions.length)
                this.threat = this.suggestions[0];
            this.$refs.editModal.show();
        },
        hideModal() {
            this.threat = {};
            this.suggestions = [];
            this.types = [];
            this.index = 0;
            this.$refs.editModal.hide();
        },
        next() {
            this.index++;
            if (this.index >= this.suggestions.length) {
                this.hideModal();
                this.index = 0;
                return;
            }
            this.threat = this.suggestions[this.index];
        },
        acceptSuggestion() {
            const objRef = this.cellRef.data;
            this.threat.number = this.threatTop + 1;
            this.threat.id = uuidv4();
            if (!objRef.threatFrequency) {
                const tmpfreq = threatModels.getFrequencyMapByElement(this.threat.modelType, this.cellRef.data.type);
                if (tmpfreq !== null)
                    objRef.threatFrequency = tmpfreq;
            }
            if (objRef.threatFrequency) {
                Object.keys(objRef.threatFrequency).forEach((k) => {
                    if (this.$t(`threats.model.${this.modelType.toLowerCase()}.${k}`) === this.threat.type && this.threatTypes.includes(this.threat.type))
                        objRef.threatFrequency[k]++;
                });
            }
            this.threat.new = false;
            this.cellRef.data.threats.push(this.threat);
            this.cellRef.data.hasOpenThreats = this.cellRef.data.threats.length > 0;
            this.$store.dispatch(tmActions.update, { threatTop: this.threatTop + 1 });
            this.$store.dispatch(tmActions.modified);
            this.$store.dispatch(CELL_DATA_UPDATED, this.cellRef.data);
            dataChanged.updateStyleAttrs(this.cellRef);
            this.next();

        },
        previous() {
            if (this.index > 0) {
                this.index--;
                this.threat = this.suggestions[this.index];
            }
        }
    }
};
</script>
