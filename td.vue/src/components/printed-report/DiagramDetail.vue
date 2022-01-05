<template>
    <div>
        <div class="page" v-if="showDiagram">
            <div class="page-title diagram-page-title">
                {{ diagram.title }}
            </div>
            <div class="page diagram-drawing">
                <td-read-only-diagram :diagram="diagram" />
            </div>
        </div>
        <div class="page">
            <div class="page-title td-threats-title">
                {{ diagram.title }}
            </div>
            <div
                v-for="(entity, idx) in entitiesWithThreats"
                :key="idx"
            >
                <td-report-entity
                    :entity="entity"
                    :outOfScope="entity.data.outOfScope"
                    :showOutOfScope="showOutOfScope"
                    :showMitigated="showMitigated"
                ></td-report-entity>
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
