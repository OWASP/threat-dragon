<template>
    <div>
        <b-row class="mt-3">
            <b-col>
                <h2 class="td-diagram-title">{{ diagram.title }}</h2>
            </b-col>
        </b-row>
        <b-row v-if="showDiagram" class="mt-3">
            <b-col>
                <td-read-only-diagram :diagram="diagram" />
            </b-col>
        </b-row>
        <b-row
            class="mt-3"
            v-for="(entity, idx) in entitiesWithThreats"
            :key="idx"
        >
        <td-report-entity
            :entity="entity"
            :outOfScope="entity.data.outOfScope"
            :showOutOfScope="showOutOfScope"
            :showMitigated="showMitigated"
        ></td-report-entity>
        </b-row>
    </div>
</template>

<script>
import TdReadOnlyDiagram from '@/components/ReadOnlyDiagram.vue';
import TdReportEntity from '@/components/report/ReportEntity.vue';

export default {
    name: 'TdDiagramDetail',
    props: {
        diagram: Object,
        showOutOfScope: {
            type: Boolean,
            default: true
        },
        showMitigated: {
            type: Boolean,
            default: true
        },
        showDiagram: {
            type: Boolean,
            default: true
        }
    },
    components: {
        TdReadOnlyDiagram,
        TdReportEntity
    },
    computed: {
        entitiesWithThreats: function () {
            return this.diagram.cells
                .filter(x => !!x.data && !!x.data.threats)
                .filter(x => this.showOutOfScope || !x.data.outOfScope)
                .filter(x => x.data.threats.some(y => this.showMitigated || y.status.toLowerCase() !== 'mitigated'));
        }
    },
};

</script>
