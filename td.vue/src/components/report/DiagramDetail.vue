<template>
    <div>
        <div class="page">
            <b-row class="mt-3">
                <b-col>
                    <h2 class="td-diagram-title">
                        {{ diagram.title }}
                    </h2>
                </b-col>
            </b-row>
            <b-row class="mt-3">
                <b-col>
                    <p class="td-diagram-title">
                        {{ diagram.description }}
                    </p>
                </b-col>
            </b-row>
            <b-row v-if="showDiagram" class="mt-3 page diagram-drawing">
                <b-col>
                    <td-read-only-diagram :diagram="diagram" />
                </b-col>
            </b-row>
            <b-row v-for="(entity, idx) in entitiesWithThreats" :key="idx" class="mt-3 no-print">
                <td-report-entity
                    :entity="entity"
                    :out-of-scope="entity.data.outOfScope"
                    :show-mitigated="showMitigated"
                    :show-out-of-scope="showOutOfScope"
                    :show-properties="showProperties"
                    :show-empty="showEmpty"
                />
            </b-row>

            <div class="page-title print-only td-threats-title">
                {{ diagram.title }}
            </div>
            <div v-for="(entity, idx) in entitiesWithThreats" :key="`print-${idx}`">
                <td-print-report-entity
                    :entity="entity"
                    :out-of-scope="entity.data.outOfScope"
                    :show-mitigated="showMitigated"
                    :show-out-of-scope="showOutOfScope"
                    :show-properties="showProperties"
                    :show-empty="showEmpty"
                />
            </div>
        </div>
    </div>
</template>

<script>
import TdPrintReportEntity from '@/components/printed-report/ReportEntity.vue';
import TdReadOnlyDiagram from '@/components/ReadOnlyDiagram.vue';
import TdReportEntity from '@/components/report/ReportEntity.vue';

export default {
    name: 'TdDiagramDetail',
    components: {
        TdPrintReportEntity,
        TdReadOnlyDiagram,
        TdReportEntity
    },
    props: {
        diagram: {
            type: Object,
            default: () => ({})
        },
        showDiagram: {
            type: Boolean,
            default: true
        },
        showMitigated: {
            type: Boolean,
            default: true
        },
        showOutOfScope: {
            type: Boolean,
            default: true
        },
        showProperties: {
            type: Boolean,
            default: false
        },
        showEmpty: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        entitiesWithThreats: function () {
            return this.diagram.cells.filter(
                (x) =>
                    !!x.data &&
                        !!x.data.threats &&
                        (this.showOutOfScope || !x.data.outOfScope) &&
                        (this.showEmpty ||
                            x.data.threats.some(
                                (y) => this.showMitigated || y.status.toLowerCase() !== 'mitigated'
                            ))
            );
        }
    }
};
</script>

<style lang="scss" scoped>
    .diagram-drawing {
        min-height: 600px;
        display: flex !important;
    }
</style>
