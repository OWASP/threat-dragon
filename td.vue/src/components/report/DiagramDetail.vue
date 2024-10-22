<template>
    <div>
        
        <div class="page">
            <b-row class="mt-3">
                <b-col>
                    <h2 class="td-diagram-title">{{ diagram.title }}</h2>
                </b-col>
            </b-row>
            <b-row class="mt-3">
                <b-col>
                    <p class="td-diagram-title">{{ diagram.description }}</p>
                </b-col>
            </b-row>
            <b-row v-if="showDiagram" class="mt-3 page diagram-drawing">
                <b-col>
                    <td-read-only-diagram :diagram="diagram" />
                </b-col>
            </b-row>
            <b-row
                class="mt-3 no-print"
                v-for="(entity, idx) in entitiesWithThreats"
                :key="idx"
            >
                <td-report-entity
                    :entity="entity"
                    :outOfScope="entity.data.outOfScope"
                    :showMitigated="showMitigated"
                    :showOutOfScope="showOutOfScope"
                    :showProperties="showProperties"
                    :showEmpty="showEmpty"
                ></td-report-entity>
            </b-row>

            <div class="page-title print-only td-threats-title">
                {{ diagram.title }}
            </div>
            <div
                v-for="(entity, idx) in entitiesWithThreats"
                :key="`print-${idx}`"
            >
                <td-print-report-entity
                    :entity="entity"
                    :outOfScope="entity.data.outOfScope"
                    :showMitigated="showMitigated"
                    :showOutOfScope="showOutOfScope"
                    :showProperties="showProperties"
                    :showEmpty="showEmpty"
                ></td-print-report-entity>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.diagram-drawing {
    min-height: 600px;
    display: flex !important;
}
</style>

<script>
import TdPrintReportEntity from '@/components/printed-report/ReportEntity.vue';
import TdReadOnlyDiagram from '@/components/ReadOnlyDiagram.vue';
import TdReportEntity from '@/components/report/ReportEntity.vue';

export default {
    name: 'TdDiagramDetail',
    props: {
        diagram: Object,
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
    components: {
        TdPrintReportEntity,
        TdReadOnlyDiagram,
        TdReportEntity
    },
    computed: {
        entitiesWithThreats: function () {
            return this.diagram.cells
                .filter(x => !!x.data && !!x.data.threats
                    && (this.showOutOfScope || !x.data.outOfScope)
                    && (this.showEmpty || x.data.threats.some(y => this.showMitigated || y.status.toLowerCase() !== 'mitigated')));
        }
    },
};

</script>
