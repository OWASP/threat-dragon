<template>
    <div>
        <div class="td-report no-print">
            <b-row>
                <b-col>
                    <b-card>
                        <b-row>
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
                    </b-card>
                </b-col>
            </b-row>
            <b-row class="td-report-section" id="summary">
                <b-col>
                    <td-threat-model-summary-card :titlePrefix="$t('report.title')" />
                </b-col>
            </b-row>

            <b-row class="td-report-section page-break">
                <b-col>
                    <b-card
                        :header="$t('threatmodel.description')">
                        <b-row class="td-card">
                            <b-col>
                                <p>{{ model.summary.description }}</p>
                            </b-col>
                        </b-row>
                    </b-card>
                </b-col>
            </b-row>

            <!-- <b-row
                class="td-report-section"
                v-for="(diagram, idx) in model.detail.diagrams"
                :key="idx">
                <b-col xs="12">
                    <b-card :header="diagram.title" class="td-report-diagram">
                        <td-read-only-diagram :diagram="diagram" />
                    </b-card>
                </b-col>
            </b-row> -->

            <!-- TODO: Iterate through threat models, entities, and threats -->

        </div>
        <!-- <div class="print-only" v-if="!!model">
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
            <td-diagram-detail
                v-for="(diagram, idx) in model.detail.diagrams"
                :key="idx"
                :diagram="diagram"
            ></td-diagram-detail>
        </div> -->
    </div>
</template>

<style lang="scss">
.td-report-options label {
    padding-top: 4px;
    font-size: 12px !important;
}
</style>

<style lang="scss" scoped>

.td-branding {
    padding-left: 50px;
}

.td-report {
    font-size: 12px !important;
}

.td-report-section {
    margin-top: 10px;
}
</style>

<script>
// Some helpful tips on printing styles using bootstrap: https://stackoverflow.com/questions/22199429/bootstrap-grid-for-printing

/*
TODO:
    - Executive summary? https://github.com/OWASP/threat-dragon/issues/339#issuecomment-1003519607
    - Entities per diagram
    - Threats per entity
    - Print (web and desktop)
    - Save PDF (desktop only)


*/

import { mapState, mapGetters } from 'vuex';

import env from '@/service/env.js';
import { getProviderType } from '@/service/provider/providers.js';
import TdFormButton from '@/components/FormButton.vue';
import TdThreatModelSummaryCard from '@/components/ThreatModelSummaryCard.vue';

export default {
    name: 'Report',
    components: {
        TdFormButton,
        TdThreatModelSummaryCard
    },
    computed: {
        ...mapState({
            model: (state) => state.threatmodel.data,
            providerType: (state) => getProviderType(state.provider.selected),
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
                // window.print();
                this.$router.push({ name: `${this.providerType}PrinterReport`, params: this.$route.params });
            }
        }
    }
};

</script>
