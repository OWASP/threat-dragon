<template>
    <div class="td-report">
        <b-row class="no-print td-report-options sticky">
            <b-col>
                <b-form>
                    <b-row>
                        <b-col>
                            <b-form-group id="model-group" label-cols="auto">
                                <b-form-checkbox id="show_models" v-model="display.diagrams">
                                    {{ $t('report.options.showModelDiagrams') }}
                                </b-form-checkbox>
                            </b-form-group>
                        </b-col>

                        <b-col>
                            <b-form-group id="mitigated-group" label-cols="auto">
                                <b-form-checkbox id="show_mitigated" v-model="display.mitigated">
                                    {{ $t('report.options.showMitigatedThreats') }}
                                </b-form-checkbox>
                            </b-form-group>
                        </b-col>

                        <b-col>
                            <b-form-group id="outofscope-group" label-cols="auto">
                                <b-form-checkbox id="show_outofscope" v-model="display.outOfScope">
                                    {{ $t('report.options.showOutOfScope') }}
                                </b-form-checkbox>
                            </b-form-group>
                        </b-col>

                        <b-col>
                            <b-form-group id="empty-group" label-cols="auto">
                                <b-form-checkbox id="show_empty" v-model="display.empty">
                                    {{ $t('report.options.showEmpty') }}
                                </b-form-checkbox>
                            </b-form-group>
                        </b-col>

                        <b-col>
                            <b-form-group id="branding-group" label-cols="auto">
                                <b-form-checkbox id="show_branding" v-model="display.branding">
                                    {{ $t('report.options.showBranding') }}
                                </b-form-checkbox>
                            </b-form-group>
                        </b-col>

                        <b-col>
                            <b-form-group id="properties-group" label-cols="auto">
                                <b-form-checkbox id="show_attributes" v-model="display.properties">
                                    {{ $t('report.options.showProperties') }}
                                </b-form-checkbox>
                            </b-form-group>
                        </b-col>
                    </b-row>
                </b-form>
            </b-col>

            <b-col class="text-right right">
                <BButtonGroup>
                    <td-form-button
                        v-if="isElectron"
                        id="td-print-pdf-btn"
                        :on-btn-click="printPdf"
                        icon="file-pdf"
                        :text="$t('forms.exportPdf')"
                    />
                    <td-form-button
                        id="td-print-btn"
                        :on-btn-click="print"
                        icon="print"
                        :text="$t('forms.print')"
                    />
                    <td-form-button
                        id="td-return-btn"
                        :is-primary="true"
                        :on-btn-click="onCloseClick"
                        icon="times"
                        :text="$t('forms.close')"
                    />
                </BButtonGroup>
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
                />
            </div>
            <div class="td-report-section">
                <td-executive-summary :summary="model.summary.description" :threats="allThreats" />
                <td-print-executive-summary
                    :summary="model.summary.description"
                    :threats="allThreats"
                />
            </div>
            <td-diagram-detail
                v-for="(diagram, idx) in diagrams"
                :key="idx"
                :diagram="diagram"
                :show-properties="display.properties"
                :show-mitigated="display.mitigated"
                :show-out-of-scope="display.outOfScope"
                :show-diagram="display.diagrams"
                :show-empty="display.empty"
            />
        </div>
    </div>
</template>
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
import logger from '@/utils/logger.js';

// Create a logger instance for this component
const log = logger.getLogger('views:ReportModel');
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
                if (a.title < b.title) return -1;
                if (a.title > b.title) return 1;
                return 0;
            });
            return sortedDiagrams;
        }
    },
    methods: {
        onCloseClick() {
            // Ensure all required params are included
            const params = {
                ...this.$route.params,
                provider: this.$route.params.provider || 'local', // Default to local if no provider
                folder: this.$route.params.folder || 'demo'       // Default to demo if no folder
            };
            this.$router.push({
                name: `${this.providerType}ThreatModel`,
                params: params
            });
        },
        print() {
            log.debug('Print the report window');
            window.print();
        },
        printPdf() {
            log.debug('Export the report window to PDF (desktop only)');
            if (isElectron()) {
                // request electron server to print PDF
                window.electronAPI.modelPrint('PDF');
            }
        }
    }
};
</script>

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
        background-color: var(--white);
        padding-top: 15px;
        z-index: 100;
    }
    .right {
        right: 0;
    }
</style>
