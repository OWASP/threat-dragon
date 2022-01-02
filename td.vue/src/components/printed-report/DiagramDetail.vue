<template>
    <div>
        <div class="page">
            <div class="page-title">
                {{ diagram.title }}
            </div>
            <div class="page diagram-drawing">
                <td-read-only-diagram :diagram="diagram" />
            </div>
        </div>
        <div>
            <div class="page-title">
                {{ diagram.title }}
            </div>
            <div
                v-for="(entity, idx) in nonBoundaryEntities"
                :key="idx"
            >
                <!-- TODO: Temporary changes are in place for v2 models, no sense in developing against the old ones -->
                <td-report-entity :entity="entity" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.diagram-drawing {
    min-height: 600px;
    display: flex !important;
}

.page {
    display: flex;
    flex-direction: column;
}

</style>

<script>
import TdReadOnlyDiagram from '@/components/ReadOnlyDiagram.vue';
import TdReportEntity from '@/components/printed-report/ReportEntity.vue';

export default {
    name: 'TdDiagramDetail',
    props: {
        diagram: Object
    },
    components: {
        TdReadOnlyDiagram,
        TdReportEntity
    },
    computed: {
        nonBoundaryEntities: function () {
            return this.diagram.cells.filter(x => !x.data.isTrustBoundary);
        }
    }
};

</script>
