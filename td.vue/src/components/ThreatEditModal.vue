<template>
    <div>
        <b-modal
            v-if="!!threat"
            id="threat-edit"
            size="lg"
            ok-variant="primary"
            header-bg-variant="primary"
            header-text-variant="light"
            :title="$t('threats.edit')"
            ref="editModal"
            @hidden="updateData"
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
                    <b-col md=6>
                        <b-form-group
                            id="status-group"
                            :label="$t('threats.properties.status')"
                            label-for="status">
                            <b-form-select
                                id="status"
                                v-model="threat.status"
                                :options="statuses">
                            </b-form-select>
                        </b-form-group>
                    </b-col>

                    <b-col md=6>
                        <b-form-group
                            id="priority-group"
                            :label="$t('threats.properties.priority')"
                            label-for="priority">
                            <b-form-select
                                id="priority"
                                v-model="threat.severity"
                                :options="priorities">
                            </b-form-select>
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
                    variant="secondary"
                    class="float-right"
                    @click="hideModal()"
                >
                    {{ $t('forms.apply') }}
                </b-button>
                <b-button
                    variant="danger"
                    class="float-left"
                    @click="confirmDelete()"
                >
                    {{ $t('forms.delete') }}
                </b-button>
                </div>
            </template>
        </b-modal>
    </div>
</template>

<script>
import { mapState } from 'vuex';

import { CELL_DATA_UPDATED } from '@/store/actions/cell.js';
import { createNewTypedThreat } from '@/service/threats/index.js';
import dataChanged from '@/service/x6/graph/data-changed.js';
import threatModels from '@/service/threats/models/index.js';

export default {
    name: 'TdThreatEditModal',
    computed: {
        ...mapState({
            cellRef: (state) => state.cell.ref
        }),
        threatTypes() {
            if (!this.threat || !this.threat.modelType) {
                return [];
            }

            const res = [];
            const threatTypes = threatModels.getThreatTypes(this.threat.modelType);
            Object.keys(threatTypes).forEach((type) => {
                res.push(this.$t(threatTypes[type]));
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
                { value: 'Low', text: this.$t('threats.priority.low') },
                { value: 'Medium', text: this.$t('threats.priority.medium') },
                { value: 'High', text: this.$t('threats.priority.high') }
            ];
        }
    },
    data() {
        return {
            threat: {},
            modelTypes: [
                'CIA',
                'LINDDUN',
                'STRIDE'
            ]
        };
    },
    methods: {
        show(threatId) {
            this.threat = this.cellRef.data.threats.find(x => x.id === threatId);
            if (!this.threat) {
                // this should never happen with a valid threatId
                this.threat = createNewTypedThreat();
            }
            this.$refs.editModal.show();
        },
        updateData() {
            const threatRef = this.cellRef.data.threats.find(x => x.id === this.threat.id);

            if (threatRef) {
                threatRef.status = this.threat.status;
                threatRef.severity = this.threat.severity;
                threatRef.title = this.threat.title;
                threatRef.type = this.threat.type;
                threatRef.description = this.threat.description;
                threatRef.mitigation = this.threat.mitigation;
                threatRef.modelType = this.threat.modelType;
                
                this.$store.dispatch(CELL_DATA_UPDATED, this.cellRef.data);
                dataChanged.updateStyleAttrs(this.cellRef);
            }
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

            this.cellRef.data.threats = this.cellRef.data.threats.filter(x => x.id !== this.threat.id);
            this.cellRef.data.hasOpenThreats = this.cellRef.data.threats.length > 0;
            this.$store.dispatch(CELL_DATA_UPDATED, this.cellRef.data);
            dataChanged.updateStyleAttrs(this.cellRef);

            this.hideModal();
        }
    }
};

</script>
