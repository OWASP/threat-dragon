<template>
    <div class="td-report no-print">
        <b-row class="no-print td-report-options fixed">
            <b-col>
                <b-form class="">
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
                                    v-model="display.mitigated"
                                >{{ $t('report.options.showMitigatedThreats') }}</b-form-checkbox>
                            </b-form-group>
                        </b-col>

                        <b-col>
                            <b-form-group
                                label-cols="auto"
                                id="model-group">
                                <b-form-checkbox
                                    id="show_models"
                                    v-model="display.diagrams"
                                >{{ $t('report.options.showModelDiagrams') }}</b-form-checkbox>
                            </b-form-group>
                        </b-col>

                        <b-col>
                            <b-form-group
                                label-cols="auto"
                                id="branding-group">
                                <b-form-checkbox
                                    id="show_branding"
                                    v-model="display.branding"
                                >{{ $t('report.options.showBranding') }}</b-form-checkbox>
                            </b-form-group>
                        </b-col>
                    </b-form-row>
                </b-form>
            </b-col>

            <b-col class="text-right right">
                <b-btn-group>
                    <td-form-button
                        id="td-save-pdf-btn"
                        :onBtnClick="noOp"
                        v-if="isElectron"
                        icon="file-pdf"
                        :text="$t('forms.savePdf')" />
                    <td-form-button
                        id="td-print-btn"
                        :onBtnClick="print"
                        icon="print"
                        :text="$t('forms.printerFriendly')" />
                    <td-form-button
                        id="td-return-btn"
                        :isPrimary="true"
                        :onBtnClick="onCloseClick"
                        icon="times"
                        :text="$t('forms.close')" />
                </b-btn-group>
            </b-col>
        </b-row>

        <b-row class="td-report-section" id="summary">
            <b-col>
                <td-coversheet :branding="display.branding" />
            </b-col>
        </b-row>

        <b-row class="td-report-section">
            <b-col>
                <td-executive-summary
                    :summary="model.summary.description"
                    :threats="threats"
                ></td-executive-summary>
            </b-col>
        </b-row>
        
        <td-diagram-detail
            v-for="(diagram, idx) in model.detail.diagrams"
            :key="idx"
            :diagram="diagram"
            :showOutOfScope="display.outOfScope"
            :showMitigated="display.mitigated"
            :showDiagram="display.diagrams"
        ></td-diagram-detail>

        <!-- <b-row
            class="td-report-section"
            v-for="(diagram, idx) in model.detail.diagrams"
            :key="idx">
            <b-col md="12">
                <b-card :header="diagram.title" class="td-report-diagram">
                    <td-read-only-diagram :diagram="diagram" />
                </b-card>
            </b-col>
        </b-row> -->
    </div>
</template>

<style lang="scss">
.td-report-options label {
    padding-top: 4px;
    font-size: 12px !important;
}

.card-header {
    font-size: 16px;
}
</style>

<style lang="scss" scoped>

.td-branding {
    padding-left: 50px;
}

.td-report {
    font-size: 12px;
}

.td-report-section {
    margin-top: 15px;
}

.fixed {
    position: fixed;
    top: 45px;
    width: 100%;
    background-color: $white;
    padding-top: 15px;
    z-index: 9999;
}

.right {
    right: 0;
}
</style>

<script>
import { mapState, mapGetters } from 'vuex';

import env from '@/service/env.js';
import { getProviderType } from '@/service/provider/providers.js';
import TdCoversheet from '@/components/report/Coversheet.vue';
import TdDiagramDetail from '@/components/report/DiagramDetail.vue';
import TdExecutiveSummary from '@/components/report/ExecutiveSummary.vue';
import TdFormButton from '@/components/FormButton.vue';

export default {
    name: 'Report',
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
            threats: (state) => {
                let threats = [];
                state.threatmodel.data.detail.diagrams.forEach(diagram => {
                    diagram.cells.forEach(cell => {
                        threats = threats.concat(cell.data.threats);
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
                mitigated: true,
                diagrams: true,
                branding: true
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
            if (!this.isElectron) {
                this.$router.push({ name: `${this.providerType}PrinterReport`, params: this.$route.params });
            }
        }
    }
};

</script>
