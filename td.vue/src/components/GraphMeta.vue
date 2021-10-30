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
                    <td-threat-card
                        v-for="(threat, idx) in cellRef.data.threats || []"
                        :key="idx"
                        :status="threat.status"
                        :severity="threat.severity"
                        :description="threat.description"
                        :title="threat.title"
                        :type="threat.type"
                        :mitigation="threat.mitigation" />
                </b-card-text>
                <b-card-text
                    v-if="!cellRef || !cellRef.data || cellRef.data.threats.length === 0">
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
</style>

<script>
import { mapState } from 'vuex';

import TdGraphProperties from '@/components/GraphProperties.vue';
import TdThreatCard from '@/components/ThreatCard.vue';

export default {
    name: 'TdGraphMeta',
    computed: mapState({
        cellRef: (state) => state.cell.ref
    }),
    components: {
        TdGraphProperties,
        TdThreatCard
    }
};

</script>