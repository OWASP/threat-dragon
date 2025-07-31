<template>
    <div>
        <b-modal
            v-if="!!threat"
            id="threat-edit"
            size="lg"
            ok-variant="primary"
            header-bg-variant="primary"
            header-text-variant="light"
            :title="modalTitle"
            ref="editModal"
        >
            <b-form>
                <b-form-row>
                    <b-col>
                        <b-form-group
                            id="title-group"
                            :label="$t('threats.properties.title')"
                            label-for="title">
                            <b-form-input
                                id="title"
                                v-model="threat.title"
                                type="text"
                                required
                            ></b-form-input>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col>
                        <b-form-group
                            id="threat-type-group"
                            :label="$t('threats.properties.type')"
                            label-for="threat-type">
                            <b-form-select
                                id="threat-type"
                                v-model="threat.type"
                                :options="threatTypes">
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md=5>
                        <b-form-group
                            id="status-group"
                            class="float-left"
                            :label="$t('threats.properties.status')"
                            label-for="status">
                            <b-form-radio-group
                                id="status"
                                v-model="threat.status"
                                :options="statuses"
                                buttons
                            ></b-form-radio-group>
                        </b-form-group>
                    </b-col>

                    <b-col md=2>
                        <b-form-group
                            id="score-group"
                            :label="$t('threats.properties.score')"
                            label-for="score">
                            <b-form-input
                                id="score"
                                v-model="threat.score"
                                type="text"
                            ></b-form-input>
                        </b-form-group>
                    </b-col>

                    <b-col md=5>
                        <b-form-group
                            id="severity-group"
                            class="float-right"
                            :label="$t('threats.properties.severity')"
                            label-for="severity">
                            <b-form-radio-group
                                id="severity"
                                v-model="threat.severity"
                                :options="priorities"
                                buttons
                            ></b-form-radio-group>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col>
                        <b-form-group
                            id="description-group"
                            :label="$t('threats.properties.description')"
                            label-for="description">
                            <b-form-textarea
                                id="description"
                                v-model="threat.description"
                                rows="5">
                            </b-form-textarea>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col>
                        <b-form-group
                            id="mitigation-group"
                            :label="$t('threats.properties.mitigation')"
                            label-for="mitigation">
                            <b-form-textarea
                                id="mitigation"
                                v-model="threat.mitigation"
                                rows="5">
                            </b-form-textarea>
                        </b-form-group>
                    </b-col>
                </b-form-row>
            </b-form>

            <template #modal-footer>
                <div class="w-100">
                <b-button
                    v-if="!newThreat"
                    variant="danger"
                    class="float-left"
                    @click="confirmDelete()"
                >
                    {{ $t('forms.delete') }}
                </b-button>
                <b-button
                    v-if="newThreat"
                    variant="danger"
                    class="float-left"
                    @click="immediateDelete()"
                >
                    {{ $t('forms.remove') }}
                </b-button>
                 <b-button
                    variant="secondary"
                    class="float-right"
                    @click="updateThreat()"
                >
                    {{ $t('forms.apply') }}
                </b-button>
                <b-button
                v-if="!newThreat"
                variant="secondary"
                class="float-right mr-2"
                @click="hideModal()"
            >
                {{ $t('forms.cancel') }}
            </b-button>
                </div>
            </template>
        </b-modal>
    </div>
</template>

<script>
import { mapState } from 'vuex';

import { CELL_DATA_UPDATED } from '@/store/actions/cell.js';
import tmActions from '@/store/actions/threatmodel.js';
import dataChanged from '@/service/x6/graph/data-changed.js';
import threatModels from '@/service/threats/models/index.js';

export default {
    name: 'TdThreatEditDialog',
    computed: {
        ...mapState({
            cellRef: (state) => state.cell.ref,
            threatTop: (state) => state.threatmodel.data.detail.threatTop
        }),
        threatTypes() {
            if (!this.cellRef || !this.threat || !this.threat.modelType) {
                return [];
            }

            const res = [];
            const threatTypes = threatModels.getThreatTypesByElement(this.threat.modelType, this.cellRef.data.type);
            Object.keys(threatTypes).forEach((type) => {
                res.push(this.$t(type));
            }, this);
            if(!res.includes(this.threat.type))
                res.push(this.threat.type);
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
        modalTitle() { return this.$t('threats.edit') + ' #' + this.number; }
    },
    data() {
        return {
            threat: {},
            modelTypes: [
                'CIA',
                'CIADIE',
                'LINDDUN',
                'PLOT4ai',
                'STRIDE'
            ],
            number: 0
        };
    },
    methods: {
        editThreat(threatId,state) {
            const crnthreat = this.cellRef.data.threats.find(x => x.id === threatId);
            this.threat = {...crnthreat};
            if (!this.threat) {
                // this should never happen with a valid threatId
                console.warn('Trying to access a non-existent threatId: ' + threatId);
            } else {
                this.number = this.threat.number;
                this.newThreat = state==='new';
                this.$refs.editModal.show();
            }
        },
        updateThreat() {
            const threatRef = this.cellRef.data.threats.find(x => x.id === this.threat.id);
            if (threatRef) {
                const objRef = this.cellRef.data;
                if(!objRef.threatFrequency){
                    const tmpfreq = threatModels.getFrequencyMapByElement(this.threat.modelType,this.cellRef.data.type);
                    if(tmpfreq!==null)
                        objRef.threatFrequency = tmpfreq;
                }
                if(objRef.threatFrequency){
                    Object.keys(objRef.threatFrequency).forEach((k)=>{
                        if(this.$t(`threats.model.${this.threat.modelType.toLowerCase()}.${k}`)===this.threat.type)
                            objRef.threatFrequency[k]++;
                    });
                }
                threatRef.status = this.threat.status;
                threatRef.severity = this.threat.severity;
                threatRef.title = this.threat.title;
                threatRef.type = this.threat.type;
                threatRef.description = this.threat.description;
                threatRef.mitigation = this.threat.mitigation;
                threatRef.modelType = this.threat.modelType;
                threatRef.new = false;
                threatRef.number = this.number;
                threatRef.score = this.threat.score;
                this.$store.dispatch(CELL_DATA_UPDATED, this.cellRef.data);
                this.$store.dispatch(tmActions.modified);
                dataChanged.updateStyleAttrs(this.cellRef);
            }
            this.hideModal();
        },
        deleteThreat() {
            if(!this.threat.new){
                const threatMap = this.cellRef.data.threatFrequency;
                Object.keys(threatMap).forEach((k)=>{
                    if(this.$t(`threats.model.${this.threat.modelType.toLowerCase()}.${k}`)===this.threat.type)
                        threatMap[k]--;
                });
            }
            this.cellRef.data.threats = this.cellRef.data.threats.filter(x => x.id !== this.threat.id);
            this.cellRef.data.hasOpenThreats = this.cellRef.data.threats.length > 0;
            this.$store.dispatch(CELL_DATA_UPDATED, this.cellRef.data);
            this.$store.dispatch(tmActions.modified);
            dataChanged.updateStyleAttrs(this.cellRef);
        },
        hideModal() {
            this.$refs.editModal.hide();
        },
        async confirmDelete() {
            const confirmed = await this.$bvModal.msgBoxConfirm(this.$t('threats.confirmDeleteMessage'), {
                title: this.$t('threats.confirmDeleteTitle'),
                okTitle: this.$t('forms.delete'),
                cancelTitle: this.$t('forms.cancel'),
                okVariant: 'danger'
            });

            if (!confirmed) { return; }

            this.deleteThreat();
            this.hideModal();
        },
        async immediateDelete() {
            this.deleteThreat();
            this.hideModal();
        }
    }
};

</script>
