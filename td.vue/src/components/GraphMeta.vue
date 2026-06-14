<template>
    <b-row>
        <b-col md="6">
            <b-card :header="`${$t('threatmodel.properties.title')}`">
                <td-graph-properties />
            </b-card>
        </b-col>
        <b-col md="6">
            <b-card header-tag="header">
                <template #header>
                    <div class="threats-header">
                        <span>{{ $t('threatmodel.threats') }}</span>
                        <button
                            v-if="!disableNewThreat"
                            type="button"
                            class="threats-header-action"
                            @click="newThreat()"
                        >
                            <font-awesome-icon icon="plus" class="threats-header-icon"></font-awesome-icon>
                            {{ $t('threats.newThreat') }}
                        </button>
                    </div>
                </template>
                <b-card-text v-if="!!cellRef">
                    <b-row>
                        <b-col
                            md="4"
                            v-for="(threat, idx) in threats || []"
                            :key="idx"
                        >
                            <td-graph-threats
                                :threat="threat"
                                @threatSelected="threatSelected"
                            />
                        </b-col>
                    </b-row>
                </b-card-text>
                <b-card-text
                    v-if="!cellRef || !cellRef.data">
                    {{ $t('threats.emptyThreat') }}
                </b-card-text>
            </b-card>

            <hr v-if="!disableNewThreat" />

            <a href="#"
                v-if="!disableNewThreat"
                @click.prevent="newThreat()"
                class="new-threat-by-type m-2"
            >
                <font-awesome-icon icon="plus"></font-awesome-icon>
                {{ $t('threats.newThreat') }}
            </a>
            <a href="#"
                v-if="!disableNewThreat && diagram.diagramType !== 'EOP'"
                @click.prevent="AddThreatByType()"
                class="new-threat-by-type m-2"
            >
                <font-awesome-icon icon="plus"></font-awesome-icon>
                {{ $t('threats.newThreatByType') }}
            </a>
            <a href="#"
                v-if="!disableNewThreat && diagram.diagramType !== 'EOP'"
                @click.prevent="AddThreatByContext()"
                class="new-threat-by-type m-2"
            >
                <font-awesome-icon icon="plus"></font-awesome-icon>
                {{ $t('threats.newThreatByContext') }}
            </a>
        </b-col>
    </b-row>
</template>

<style lang="scss" scoped>
.new-threat-by-type {
    color: $orange;
    font-size: 16px;
    padding: 15px;
}
.threats-header {
    align-items: center;
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    line-height: 1.5;
}
.threats-header-action {
    align-items: center;
    background: transparent;
    border: 0;
    color: $orange;
    display: inline-flex;
    font-family: inherit;
    font-size: 0.875rem;
    font-weight: inherit;
    line-height: 1;
    margin: 0;
    padding: 0;
    white-space: nowrap;
}
.threats-header-icon {
    margin-right: 0.25rem;
}
.threats-header-action:hover,
.threats-header-action:focus {
    color: darken($orange, 10%);
    text-decoration: underline;
}
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
import { CELL_DATA_UPDATED, CELL_UNSELECTED } from '@/store/actions/cell.js';
import dataChanged from '@/service/x6/graph/data-changed.js';
import tmActions from '@/store/actions/threatmodel.js';
import TdGraphProperties from '@/components/GraphProperties.vue';
import TdGraphThreats from '@/components/GraphThreats.vue';

export default {
    name: 'TdGraphMeta',
    computed: mapState({
        cellRef: (state) => state.cell.ref,
        threats: (state) => state.cell.threats,
        diagram: (state) => state.threatmodel.selectedDiagram,
        threatTop: (state) => state.threatmodel.data.detail.threatTop,
        disableNewThreat: function (state) {
            if (!state.cell?.ref?.data) {
                return true;
            }
            return state.cell.ref.data.outOfScope || state.cell.ref.data.isTrustBoundary || state.cell.ref.data.type === 'tm.Text';
        }
    }),
    components: {
        TdGraphProperties,
        TdGraphThreats
    },
    async mounted() {
        this.init();
    },
    methods: {
        init() {
            this.$store.dispatch(CELL_UNSELECTED);
        },
        threatSelected(threatId, state) {
            console.debug('selected threat ID: ' + threatId);
            this.$emit('threatSelected', threatId, state);
        },
        newThreat() {
            const threat = createNewTypedThreat(this.diagram.diagramType, this.cellRef.data.type, this.threatTop+1);
            console.debug('new threat ID: ' + threat.id);
            this.cellRef.data.threats.push(threat);
            this.cellRef.data.hasOpenThreats = this.cellRef.data.threats.length > 0;
            this.$store.dispatch(tmActions.update, { threatTop: this.threatTop+1 });
            this.$store.dispatch(tmActions.modified);
            this.$store.dispatch(CELL_DATA_UPDATED, this.cellRef.data);
            dataChanged.updateStyleAttrs(this.cellRef);
            this.threatSelected(threat.id, 'new');
        },
        AddThreatByType(){
            this.$emit('threatSuggest', 'type');
        },
        AddThreatByContext(){
            this.$emit('threatSuggest', 'context');
        }
    },
};

</script>
