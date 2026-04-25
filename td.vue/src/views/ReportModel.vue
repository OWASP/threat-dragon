<template>
    <div class="td-report">
        <b-row class="no-print td-report-options sticky">
            <b-col>
                <b-form class="">
                    <b-row>
                        <b-col>
                            <b-form-group
                                label-cols="auto"
                                id="model-group">
                                <div class="form-check">
                                    <input
                                        id="show_models"
                                        :checked="display.diagrams"
                                        class="form-check-input"
                                        type="checkbox"
                                        @change="display.diagrams = $event.target.checked"
                                    >
                                    <label class="form-check-label" for="show_models">
                                        {{ $t('report.options.showModelDiagrams') }}
                                    </label>
                                </div>
                            </b-form-group>
                        </b-col>

                        <b-col>
                            <b-form-group
                                label-cols="auto"
                                id="mitigated-group">
                                <div class="form-check">
                                    <input
                                        id="show_mitigated"
                                        :checked="display.mitigated"
                                        class="form-check-input"
                                        type="checkbox"
                                        @change="display.mitigated = $event.target.checked"
                                    >
                                    <label class="form-check-label" for="show_mitigated">
                                        {{ $t('report.options.showMitigatedThreats') }}
                                    </label>
                                </div>
                            </b-form-group>
                        </b-col>

                        <b-col>
                            <b-form-group
                                label-cols="auto"
                                id="outofscope-group">
                                <div class="form-check">
                                    <input
                                        id="show_outofscope"
                                        :checked="display.outOfScope"
                                        class="form-check-input"
                                        type="checkbox"
                                        @change="display.outOfScope = $event.target.checked"
                                    >
                                    <label class="form-check-label" for="show_outofscope">
                                        {{ $t('report.options.showOutOfScope') }}
                                    </label>
                                </div>
                            </b-form-group>
                        </b-col>

                        <b-col>
                            <b-form-group
                                label-cols="auto"
                                id="empty-group">
                                <div class="form-check">
                                    <input
                                        id="show_empty"
                                        :checked="display.empty"
                                        class="form-check-input"
                                        type="checkbox"
                                        @change="display.empty = $event.target.checked"
                                    >
                                    <label class="form-check-label" for="show_empty">
                                        {{ $t('report.options.showEmpty') }}
                                    </label>
                                </div>
                            </b-form-group>
                        </b-col>

                        <b-col>
                            <b-form-group
                                label-cols="auto"
                                id="branding-group">
                                <div class="form-check">
                                    <input
                                        id="show_branding"
                                        :checked="display.branding"
                                        class="form-check-input"
                                        type="checkbox"
                                        @change="display.branding = $event.target.checked"
                                    >
                                    <label class="form-check-label" for="show_branding">
                                        {{ $t('report.options.showBranding') }}
                                    </label>
                                </div>
                            </b-form-group>
                        </b-col>

                        <b-col>
                            <b-form-group
                                label-cols="auto"
                                id="properties-group">
                                <div class="form-check">
                                    <input
                                        id="show_attributes"
                                        :checked="display.properties"
                                        class="form-check-input"
                                        type="checkbox"
                                        @change="display.properties = $event.target.checked"
                                    >
                                    <label class="form-check-label" for="show_attributes">
                                        {{ $t('report.options.showProperties') }}
                                    </label>
                                </div>
                            </b-form-group>
                        </b-col>
                    </b-row>
                </b-form>
            </b-col>

            <b-col class="text-end right">
                <b-button-group>
                    <td-form-button
                        id="td-print-pdf-btn"
                        :onBtnClick="printPdf"
                        v-if="isElectron"
                        icon="file-pdf"
                        :text="$t('forms.exportPdf')" />
                    <td-form-button
                        id="td-print-btn"
                        :onBtnClick="print"
                        icon="print"
                        :text="$t('forms.print')" />
                    <td-form-button
                        id="td-return-btn"
                        :isPrimary="true"
                        :onBtnClick="onCloseClick"
                        icon="times"
                        :text="$t('forms.close')" />
                </b-button-group>
            </b-col>
        </b-row>

        <div v-if="!!model" class="td-report-container">
            <div class="td-report-section">
                <td-coversheet :branding="display.branding" />
                <td-print-coversheet
                    :title="model.summary.title"
                    :owner="model.summary.owner"
                    :reviewer="model.detail.reviewer"
                    :contributors="contributors"
                    :branding="display.branding"
                ></td-print-coversheet>
            </div>

            <div class="td-report-section">
                <td-executive-summary
                    :summary="model.summary.description"
                    :threats="allThreats"
                ></td-executive-summary>
                <td-print-executive-summary
                    :summary="model.summary.description"
                    :threats="allThreats"
                ></td-print-executive-summary>
            </div>

            <td-diagram-detail
                v-for="(diagram, idx) in diagrams"
                :key="idx"
                :diagram="diagram"
                :showProperties="display.properties"
                :showMitigated="display.mitigated"
                :showOutOfScope="display.outOfScope"
                :showDiagram="display.diagrams"
                :showEmpty="display.empty"
            ></td-diagram-detail>
        </div>
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

.td-report-container {
    margin-top: 5px;
}

.sticky {
    position: sticky;
    top: 55px;
    margin-top: -5px;
    background-color: $white;
    padding-top: 15px;
    z-index: 100;
}

.right {
    right: 0;
}
</style>

<script>
import { mapState, mapGetters } from 'vuex';
import isElectron from 'is-electron';

import { getProviderType } from '@/service/provider/providers.js';
import TdCoversheet from '@/components/report/Coversheet.vue';
import TdDiagramDetail from '@/components/report/DiagramDetail.vue';
import TdExecutiveSummary from '@/components/report/ExecutiveSummary.vue';
import TdFormButton from '@/components/FormButton.vue';
import TdPrintCoversheet from '@/components/printed-report/Coversheet.vue';
import TdPrintExecutiveSummary from '@/components/printed-report/ExecutiveSummary.vue';
import threatService from '@/service/threats/index.js';

export default {
    name: 'ReportModel',
    components: {
        TdCoversheet,
        TdDiagramDetail,
        TdExecutiveSummary,
        TdFormButton,
        TdPrintCoversheet,
        TdPrintExecutiveSummary
    },
    data() {
        return {
            display: {
                diagrams: true,
                mitigated: true,
                outOfScope: true,
                empty: true,
                properties: false,
                branding: false
            },
            isElectron: isElectron()
        };
    },
    computed: {
        ...mapState({
            model: (state) => state.threatmodel.data,
            providerType: (state) => getProviderType(state.provider.selected),
            allThreats: function (state) {
                return threatService.filter(state.threatmodel.data.detail.diagrams, {
                    showMitigated: true,
                    showOutOfScope: true,
                    showProperties: false,
                    showEmpty: true
                });
            }
        }),
        ...mapGetters({
            contributors: 'contributors'
        }),
        diagrams: function () {
            const sortedDiagrams = this.model.detail.diagrams.slice().sort((a, b) => {
                if (a.title < b.title)
                    return -1;
                if (a.title > b.title)
                    return 1;
                return 0;
            });
            return sortedDiagrams;
        }
    },
    methods: {
        onCloseClick() {
            this.$router.push({ name: `${this.providerType}ThreatModel`, params: this.$route.params });
        },
        print() {
            console.debug('Print the report window');
            window.print();
        },
        printPdf() {
            console.debug('Export the report window to PDF (desktop only)');
            if (isElectron()) {
                // request electron server to print PDF
                window.electronAPI.modelPrint('PDF');
            }
        }
    }
};

</script>
