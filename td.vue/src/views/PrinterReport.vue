<template>
    <div>
        <b-row class="no-print">
            <b-col>
                <b-form class="td-report-options">
                    <b-form-row>
                        <b-col>
                            <b-form-group
                                label-cols="auto"
                                id="outofscope-group">
                                <b-form-checkbox
                                    id="show_outofscope"
                                    v-model="display.outOfScope"
                                >{{ $t('report.options.showOutOfScope') }}</b-form-checkbox>
                            </b-form-group>
                        </b-col>

                        <b-col>
                            <b-form-group
                                label-cols="auto"
                                id="mitigated-group">
                                <b-form-checkbox
                                    id="show_mitigated"
                                    v-model="display.outOfScope"
                                >{{ $t('report.options.showMitigatedThreats') }}</b-form-checkbox>
                            </b-form-group>
                        </b-col>

                        <b-col>
                            <b-form-group
                                label-cols="auto"
                                id="model-group">
                                <b-form-checkbox
                                    id="show_models"
                                    v-model="display.outOfScope"
                                >{{ $t('report.options.showModelDiagrams') }}</b-form-checkbox>
                            </b-form-group>
                        </b-col>
                    </b-form-row>
                </b-form>
            </b-col>

            <b-col class="text-right">
                <b-btn-group>
                    <td-form-button
                        id="td-save-pdf-btn"
                        :onBtnClick="noOp"
                        v-if="isElectron"
                        icon="file-pdf"
                        :text="$t('forms.savePdf')" />
                    <td-form-button
                        id="tm-print-btn"
                        :onBtnClick="print"
                        icon="print"
                        :text="$t('forms.print')" />
                    <td-form-button
                        id="td-return-btn"
                        :isPrimary="true"
                        :onBtnClick="onCloseClick"
                        icon="times"
                        :text="$t('forms.close')" />
                </b-btn-group>
            </b-col>
        </b-row>


        <div v-if="!!model">
            <td-coversheet
                :title="model.summary.title"
                :owner="model.summary.owner"
                :reviewer="model.detail.reviewer"
                :contributors="contributors"
            ></td-coversheet>
            <td-executive-summary
                :summary="model.summary.description"
                :threats="threats"
            ></td-executive-summary>
            <!-- <td-diagram-detail
                v-for="(diagram, idx) in model.detail.diagrams"
                :key="idx"
                :diagram="diagram"
            ></td-diagram-detail> -->
            <!-- TODO: uncomment above and remove below, testing -->
            <td-diagram-detail
                :diagram="selectedDiagram"
            ></td-diagram-detail>
        </div>
    </div>
</template>

<style lang="scss">
.td-report-options label {
    padding-top: 4px;
    font-size: 12px !important;
}
</style>

<script>
import { mapState, mapGetters } from 'vuex';

import env from '@/service/env.js';
import { getProviderType } from '@/service/provider/providers.js';
import TdCoversheet from '@/components/printed-report/Coversheet.vue';
import TdDiagramDetail from '@/components/printed-report/DiagramDetail.vue';
import TdExecutiveSummary from '@/components/printed-report/ExecutiveSummary.vue';
import TdFormButton from '@/components/FormButton.vue';

export default {
    name: 'PrinterReport',
    components: {
        TdCoversheet,
        TdDiagramDetail,
        TdExecutiveSummary,
        TdFormButton
    },
    computed: {
        ...mapState({
            model: (state) => state.threatmodel.data,
            providerType: (state) => getProviderType(state.provider.selected),
            selectedDiagram: (state) => state.threatmodel.selectedDiagram,
            threats: (state) => {
                let threats = [];
                state.threatmodel.data.detail.diagrams.forEach(diagram => {
                    diagram.diagramJson.cells.forEach(cell => {
                        threats = threats.concat(cell.threats);
                    });
                });
                return threats.filter(x => !!x);
            }
        }),
        ...mapGetters({
            contributors: 'contributors'
        })
    },
    data() {
        return {
            display: {
                outOfScope: true,
                mitigatedThreats: true,
                diagrams: true
            },
            isElectron: env.isElectron()
        };
    },
    methods: {
        noOp() {
            console.log('TODO');
            return;
        },
        onCloseClick() {
            this.$router.push({ name: `${this.providerType}ThreatModel`, params: this.$route.params });
        },
        print() {
            // TODO: Handle desktop/electron differently if needed?
            if (!this.isElectron) {
                window.print();
            }
        }
    }
};

</script>
