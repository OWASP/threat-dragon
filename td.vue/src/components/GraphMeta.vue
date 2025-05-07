<template>
    <div class="graph-meta">
        <b-row class="meta-row">
            <b-col lg="6" md="12" class="meta-column">
                <b-card :header="`${t('threatmodel.properties.title')}`" class="properties-card">
                    <b-card-body class="scrollable-card-body">
                        <td-graph-properties />
                    </b-card-body>
                </b-card>
            </b-col>
            <b-col lg="6" md="12" class="meta-column">
                <b-card header-tag="header" class="threats-card">
                    <template #header>
                        <div class="d-flex justify-content-between align-items-center">
                            <span>{{ t('threatmodel.threats') }}</span>
                            <BButton
                                v-if="!!cellRef"
                                :disabled="disableNewThreat"
                                variant="primary"
                                size="sm"
                                @click="onNewThreat()"
                            >
                                <font-awesome-icon icon="plus" class="mr-1" />
                                {{ t('threats.newThreat') }}
                            </BButton>
                        </div>
                    </template>
                    <b-card-body class="scrollable-card-body">
                        <b-card-text v-if="!!cellRef">
                            <b-row class="threat-cards-row">
                                <b-col
                                    v-for="(threat, idx) in threats || []"
                                    :key="idx"
                                    lg="4"
                                    md="6"
                                    sm="12"
                                    class="threat-card-col mb-3"
                                >
                                    <td-graph-threats
                                        :id="threat.id"
                                        :status="threat.status"
                                        :severity="threat.severity"
                                        :description="threat.description"
                                        :title="threat.title"
                                        :type="threat.type"
                                        :mitigation="threat.mitigation"
                                        :model-type="threat.modelType"
                                        :number="threat.number"
                                        @threat-selected="onThreatSelected"
                                    />
                                </b-col>
                            </b-row>
                        </b-card-text>
                        <b-card-text v-if="!cellRef || !cellRef.data">
                            {{ t('threats.emptyThreat') }}
                        </b-card-text>
                    </b-card-body>
                </b-card>
                <div class="threat-links">
                    <a
                        v-if="!disableNewThreat"
                        href="javascript:void(0)"
                        class="new-threat-by-type m-2"
                        @click="onAddThreatByType()"
                    >
                        <font-awesome-icon icon="plus" />
                        {{ t('threats.newThreatByType') }}
                    </a>
                    <a
                        v-if="!disableNewThreat"
                        href="javascript:void(0)"
                        class="new-threat-by-type m-2"
                        @click="onAddThreatByContext()"
                    >
                        <font-awesome-icon icon="plus" />
                        {{ t('threats.newThreatByContext') }}
                    </a>
                </div>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from '@/i18n';
import { useThreatEditor } from '@/composables/useThreatEditor';
import { CELL_UNSELECTED } from '@/store/actions/cell.js';
import tmActions from '@/store/actions/threatmodel.js';
import TdGraphProperties from '@/components/GraphProperties.vue';
import TdGraphThreats from '@/components/GraphThreats.vue';
import logger from '@/utils/logger.js';

// Create a logger instance for this component
const log = logger.getLogger('components:GraphMeta');

export default {
    name: 'TdGraphMeta',
    components: {
        TdGraphProperties,
        TdGraphThreats
    },
    emits: ['threatSelected', 'threatSuggest'],
    setup(props, { emit }) {
        const store = useStore();

        // Handle i18n with test environment fallback
        let t;
        try {
            const i18n = useI18n();
            t = i18n.t;
        } catch (error) {
            log.warn('Error initializing i18n in GraphMeta:', { error });
            // Fallback for tests
            t = (key) => key;
        }

        const { createNewThreat } = useThreatEditor();

        // Computed state from store
        const cellRef = computed(() => store.state.cell.ref);
        const threats = computed(() => store.state.cell.threats);
        const diagram = computed(() => store.state.threatmodel.selectedDiagram);
        const threatTop = computed(() => store.state.threatmodel.data.detail.threatTop);
        const disableNewThreat = computed(() => {
            if (!store.state.cell?.ref?.data) {
                return true;
            }
            return (
                store.state.cell.ref.data.outOfScope ||
                store.state.cell.ref.data.isTrustBoundary ||
                store.state.cell.ref.data.type === 'tm.Text'
            );
        });

        // Initialize component
        const init = () => {
            store.dispatch(CELL_UNSELECTED);
        };

        onMounted(() => {
            init();
        });

        // Event handlers
        const onThreatSelected = (threatId, state) => {
            log.debug('Selected threat ID:', { threatId });
            emit('threatSelected', threatId, state);
        };

        const onNewThreat = () => {
            if (!cellRef.value || !diagram.value) return;

            // Create a new threat but don't add it to the store yet
            // This will create the in-memory representation only
            const threat = createNewThreat(
                diagram.value.diagramType,
                cellRef.value.data.type,
                threatTop.value + 1
            );

            // Update the threat top in the store (we still need this even with the new pattern)
            store.dispatch(tmActions.update, { threatTop: threatTop.value + 1 });

            // Emit the event to show the edit dialog
            // The threat will be persisted to the store only when user clicks Save/Create
            emit('threatSelected', threat.id, 'new');
        };

        const onAddThreatByType = () => {
            emit('threatSuggest', 'type');
        };

        const onAddThreatByContext = () => {
            emit('threatSuggest', 'context');
        };

        return {
            // State
            cellRef,
            threats,
            diagram,
            threatTop,
            disableNewThreat,

            // Methods
            onThreatSelected,
            onNewThreat,
            onAddThreatByType,
            onAddThreatByContext,

            // i18n
            t
        };
    }
};
</script>

<style lang="scss" scoped>
@use '@/styles/colors.scss' as colors;

.graph-meta {
    overflow: hidden;
    max-height: 400px;
}

.meta-row {
    margin-top: 1rem;
}

.meta-column {
    margin-bottom: 1rem;
}

.scrollable-card-body {
    max-height: 300px;
    overflow-y: auto;
}

.threat-cards-row {
    margin: 0 -0.5rem;
}

.threat-card-col {
    padding: 0 0.5rem;
}

.new-threat-by-type {
    color: colors.$orange;
    font-size: 16px;
    padding: 15px;
}

.threat-links {
    display: flex;
    flex-wrap: wrap;
}

.properties-card,
.threats-card {
    height: 100%;
    display: flex;
    flex-direction: column;
}

/* Responsive adjustments */
@media (max-width: 991.98px) {
    .graph-meta {
        max-height: 800px;
    }
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

.collapsed>.when-open,
.not-collapsed>.when-closed {
    display: none;
}
</style>