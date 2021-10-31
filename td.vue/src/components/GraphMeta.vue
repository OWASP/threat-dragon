<template>
    <div class="accordion" role="tablist">
        <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1 props-header" role="tab">
            <a href="javascript:void(0)" v-b-toggle.properties>
                {{ $t('threatmodel.properties.title') }}
                <font-awesome-icon
                    icon="chevron-right"
                    class="down-icon when-closed"
                ></font-awesome-icon>
                <font-awesome-icon
                    icon="chevron-down"
                    class="down-icon when-open"
                ></font-awesome-icon>
            </a>
        </b-card-header>
        <b-collapse id="properties" visible accordion="actions-accordion" role="tabpanel">
            <b-card-body>
                <td-graph-properties />
            </b-card-body>
        </b-collapse>
        </b-card>

        <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1 props-header" role="tab">
            <a href="javascript:void(0)" block v-b-toggle.threats>
                {{ $t('threatmodel.threats') }}
                <font-awesome-icon
                    icon="chevron-right"
                    class="down-icon when-closed"
                ></font-awesome-icon>
                <font-awesome-icon
                    icon="chevron-down"
                    class="down-icon when-open"
                ></font-awesome-icon>
            </a>
        </b-card-header>
        <b-collapse id="threats" accordion="actions-accordion" role="tabpanel">
            <b-card-body>
                <b-card-text v-if="!!cellRef">
                    <b-btn
                        @click="newThreat()"
                        variant="primary"
                        class="mb-2 add-btn">{{ $t('threats.newThreat') }}</b-btn>
                    <td-threat-card
                        v-for="(threat, idx) in threats || []"
                        :key="idx"
                        :id="threat.id"
                        :status="threat.status"
                        :severity="threat.severity"
                        :description="threat.description"
                        :title="threat.title"
                        :type="threat.type"
                        :mitigation="threat.mitigation"
                        :modelType="threat.modelType"
                        @threatSelected="threatSelected" />
                </b-card-text>
                <b-card-text
                    v-if="!cellRef || !cellRef.data">
                    {{ $t('threatmodel.properties.emptyState') }}
                </b-card-text>
            </b-card-body>
        </b-collapse>
        </b-card>
    </div>
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
.add-btn {
    width: 100%;
}
</style>

<script>
import { mapState } from 'vuex';
import { v4 } from 'uuid';

import { CELL_DATA_UPDATED } from '@/store/actions/cell.js';
import dataChanged from '@/service/x6/graph/data-changed.js';
import TdGraphProperties from '@/components/GraphProperties.vue';
import TdThreatCard from '@/components/ThreatCard.vue';

export default {
    name: 'TdGraphMeta',
    computed: mapState({
        cellRef: (state) => state.cell.ref,
        threats: (state) => state.cell.threats,
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
            const id = v4();
            this.cellRef.data.threats.push({ id });
            this.cellRef.data.hasOpenThreats = this.cellRef.data.threats.length > 0;
            this.$store.dispatch(CELL_DATA_UPDATED, this.cellRef.data);
            dataChanged.updateStyleAttrs(this.cellRef);
            this.threatSelected(id);
        }
    },
};

</script>