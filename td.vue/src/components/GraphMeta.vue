<template>
    <b-row>
        <b-col md="6">
            <b-card :header="`${$t('threatmodel.properties.title')}`">
                <b-card-body>
                    <td-graph-properties />
                </b-card-body>
            </b-card>
        </b-col>
        <b-col md="6">
            <b-card header-tag="header">
                <template #header>
                    {{ $t('threatmodel.threats') }}

                    <b-btn
                        :disabled="disableNewThreat"
                        @click="newThreat()"
                        v-if="!!cellRef"
                        variant="primary"
                        size="sm"
                        class="float-right"
                    >
                        <font-awesome-icon icon="plus" class="mr-1"></font-awesome-icon>    
                        {{ $t('threats.newThreat') }}
                    </b-btn>
                </template>
                <b-card-body>
                    <b-card-text v-if="!!cellRef">
                        <b-row>
                            <b-col
                                md="4"
                                v-for="(threat, idx) in threats || []"
                                :key="idx"
                            >
                                <td-threat-card
                                    :id="threat.id"
                                    :status="threat.status"
                                    :severity="threat.severity"
                                    :description="threat.description"
                                    :title="threat.title"
                                    :type="threat.type"
                                    :mitigation="threat.mitigation"
                                    :modelType="threat.modelType"
                                    :number=threat.number
                                    @threatSelected="threatSelected" />
                            </b-col>
                        </b-row>
                    </b-card-text>
                    <b-card-text
                        v-if="!cellRef || !cellRef.data">
                        {{ $t('threats.emptyThreat') }}
                    </b-card-text>
                </b-card-body>
            </b-card>
        </b-col>
    </b-row>
</template>

<style lang="scss" scoped>
.props-header {
    a {
        font-size: 12px;
        font-weight: bolder;
        text-decoration: none;
        margin-left: 5px;
    }
}
.down-icon {
    margin-left: 3px;
}
.collapsed > .when-open,
.not-collapsed > .when-closed {
  display: none;
}
</style>

<script>
import { mapState } from 'vuex';

import { createNewTypedThreat } from '@/service/threats/index.js';
import { CELL_DATA_UPDATED } from '@/store/actions/cell.js';
import dataChanged from '@/service/x6/graph/data-changed.js';
import TdGraphProperties from '@/components/GraphProperties.vue';
import TdThreatCard from '@/components/ThreatCard.vue';

export default {
    name: 'TdGraphMeta',
    computed: mapState({
        cellRef: (state) => state.cell.ref,
        threats: (state) => state.cell.threats,
        diagram: (state) => state.threatmodel.selectedDiagram,
        disableNewThreat: function (state) {
            return state.cell.ref.data.outOfScope || state.cell.ref.data.isTrustBoundary || state.cell.ref.data.type === 'tm.Text';
        }
    }),
    components: {
        TdGraphProperties,
        TdThreatCard
    },
    methods: {
        threatSelected(threatId) {
            this.$emit('threatSelected', threatId);
        },
        newThreat() {
            const threat = createNewTypedThreat(this.diagram.diagramType, this.cellRef.data.type);
            this.cellRef.data.threats.push(threat);
            this.cellRef.data.hasOpenThreats = this.cellRef.data.threats.length > 0;
            this.$store.dispatch(CELL_DATA_UPDATED, this.cellRef.data);
            dataChanged.updateStyleAttrs(this.cellRef);
            this.threatSelected(threat.id);
        }
    },
};

</script>
