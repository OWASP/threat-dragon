<template>
    <div>
        <div class="page" v-if="showDiagram">
            <div class="page-title">
                {{ diagram.title }}
            </div>
            <div class="page diagram-drawing">
                <td-read-only-diagram :diagram="diagram" />
            </div>
        </div>
        <div class="page">
            <div class="page-title">
                {{ diagram.title }}
            </div>
            <div
                v-for="(entity, idx) in entitiesWithThreats"
                :key="idx"
            >
                <td-report-entity
                    :entity="entity"
                    :outOfScope="entity.data.outOfScope"
                    v-if="showOutOfScope || !entity.data.outOfScope"
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
                // Remove mitigated threats if selected
                .map(x => {
                    if (!this.showMitigated && x.data.threats) {
                        x.data.threats = x.data.threats.filter(y => y.status.toLowerCase() !== 'mitigated');
                    }
                    return x;
                })
                // Only show entities with threats
                .filter(x => x.data.threats && x.data.threats.length);
        }
    }
};

</script>
