<template>
    <div>
        <b-row>
            <b-col md="2">
                <div ref="stencil_container"></div>
            </b-col>
            <b-col md="10">
                <b-row>
                    <b-col>
                        <h3 class="td-graph-title">{{ diagram.title }}</h3>
                    </b-col>
                    <b-col align="right">
                        <td-graph-buttons :graph="graph" @saved="saved" @closed="closed" />
                    </b-col>
                </b-row>
                <b-row>
                    <b-col style="display: flex;    width: 100vw; ">
                        <div
                            id="graph-container"
                            ref="graph_container"
                            style="height: 65vh; width: 100%; flex: 1; "
                        ></div>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        <td-graph-meta @threatSelected="threatSelected" @threatSuggest="threatSuggest" />

        <div>
            <td-keyboard-shortcuts />
            <td-threat-edit-dialog ref="threatEditDialog" />
            <td-threat-suggest-dialog ref="threatSuggestDialog" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.td-graph-title {
    margin-right: 15px;
}
</style>

<script>
import { mapState } from 'vuex';

import TdGraphButtons from '@/components/GraphButtons.vue';
import TdGraphMeta from '@/components/GraphMeta.vue';
import TdKeyboardShortcuts from '@/components/KeyboardShortcuts.vue';
import TdThreatEditDialog from '@/components/ThreatEditDialog.vue';
import TdThreatSuggestDialog from './ThreatSuggestDialog.vue';

import { getProviderType } from '@/service/provider/providers.js';
import diagramService from '@/service/diagram/diagram.js';
import {
    getElementsInsideBoundary,
    getBoundariesCrossedByFlow,
    getFlowsCrossedByBoundary
} from '@/service/boundary-utils.js';
import stencil from '@/service/x6/stencil.js';
import tmActions from '@/store/actions/threatmodel.js';

export default {
    name: 'TdGraph',
    components: {
        TdGraphButtons,
        TdGraphMeta,
        TdKeyboardShortcuts,
        TdThreatEditDialog,
        TdThreatSuggestDialog
    },
    computed: mapState({
        diagram: (state) => state.threatmodel.selectedDiagram,
        providerType: (state) => getProviderType(state.provider.selected)
    }),
    data() {
        return {
            graph: null
        };
    },
    async mounted() {
        this.init();
        if (window.electronAPI?.onApplyDiagramRequest) {
            window.electronAPI.onApplyDiagramRequest(() => {
                if (!this.graph) return;

                const updated = Object.assign({}, this.diagram);
                updated.cells = this.graph.toJSON().cells;

                this.$store.dispatch(tmActions.diagramSaved, updated);
                this.$store.dispatch(tmActions.notModified);
            });

        }
    },
    methods: {
        init() {
            this.graph = diagramService.edit(this.$refs.graph_container, this.diagram);
            stencil.get(this.graph, this.$refs.stencil_container);
            this.$store.dispatch(tmActions.notModified);
            this.graph.getPlugin('history').on('change', () => {
                const updated = Object.assign({}, this.diagram);
                updated.cells = this.graph.toJSON().cells;
                this.$store.dispatch(tmActions.diagramModified, updated);
            });
        },
        threatSelected(threatId,state) {
            this.$refs.threatEditDialog.editThreat(threatId,state);
        },
        threatSuggest(type){
            this.$refs.threatSuggestDialog.showModal(type);
        },
        saved() {
            console.debug('Save diagram');
            // Ensure boundary/flow relationship data is attached to each cell's data
            try {
                if (this.graph && typeof this.graph.getCells === 'function') {
                    this.graph.getCells().forEach(boundary => {
                        try {
                            if (boundary && (boundary.shape === 'trust-boundary-box' || boundary.shape === 'trust-boundary-curve')) {
                                boundary.data = boundary.data || {};
                                const contained = getElementsInsideBoundary(this.graph.getCells(), boundary);
                                boundary.data.containedElements = contained.map(el => el.id);
                                boundary.data.crossingFlows = getFlowsCrossedByBoundary(boundary, this.graph.getCells());
                            }
                        } catch (innerErr) {
                            // continue processing other cells even if one fails
                            // eslint-disable-next-line no-console
                            console.warn('Failed computing boundary data for a cell', innerErr);
                        }
                    });

                    this.graph.getCells().forEach(flow => {
                        try {
                            if (flow && flow.shape === 'flow') {
                                flow.data = flow.data || {};
                                flow.data.trustBoundaryIds = getBoundariesCrossedByFlow(flow, this.graph.getCells());
                            }
                        } catch (innerErr) {
                            console.warn('Failed computing flow boundary ids for a cell', innerErr);
                        }
                    });
                }
            } catch (err) {
                // If anything goes wrong computing relationships, don't block saving — log and continue
                // eslint-disable-next-line no-console
                console.error('Error while attaching boundary/flow data before save', err);
            }

            const updated = Object.assign({}, this.diagram);
            updated.cells = (this.graph && typeof this.graph.toJSON === 'function') ? this.graph.toJSON().cells : this.diagram.cells || [];
            this.$store.dispatch(tmActions.diagramSaved, updated);
            this.$store.dispatch(tmActions.saveModel);
        },
        async closed() {
            if (!this.$store.getters.modelChanged || await this.getConfirmModal()) {
                await this.$store.dispatch(tmActions.diagramClosed);
                this.$router.push({ name: `${this.providerType}ThreatModel`, params: this.$route.params });
            }
        },
        getConfirmModal() {
            return this.$bvModal.msgBoxConfirm(this.$t('forms.discardMessage'), {
                title: this.$t('forms.discardTitle'),
                okVariant: 'danger',
                okTitle: this.$t('forms.ok'),
                cancelTitle: this.$t('forms.cancel'),
                hideHeaderClose: true,
                centered: true
            });
        }
    },
    destroyed() {
        diagramService.dispose(this.graph);
    }
};
</script>