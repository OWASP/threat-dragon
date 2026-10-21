<template>
    <div class="td-graph-editor">
        <div class="td-graph-main">
            <aside class="td-graph-stencil">
                <div ref="stencil_container"></div>
            </aside>

            <td-resize-handle
                data-resize="stencil"
                label="Resize stencil width"
                :value="stencilOffset"
                :min="-160"
                :max="260"
                @resize="resizeStencilWidth"
            />

            <main class="td-graph-canvas">
                <b-row>
                    <b-col>
                        <h3 class="td-graph-title">{{ diagram.title }}</h3>
                    </b-col>
                    <b-col align="right">
                        <td-graph-buttons :graph="graph" @saved="saved" @closed="closed" />
                    </b-col>
                </b-row>
                <div ref="graph_viewport" class="td-graph-viewport">
                    <div
                        id="graph-container"
                        ref="graph_container"
                        class="td-graph-container"
                    ></div>
                </div>

                <td-resize-handle
                    class="td-graph-height-handle"
                    data-resize="graph-height"
                    label="Resize canvas height"
                    orientation="horizontal"
                    :value="graphHeightOffset"
                    :min="-240"
                    :max="500"
                    @resize="resizeCanvasHeight"
                />
            </main>
        </div>

        <td-graph-meta @threatSelected="threatSelected" @threatSuggest="threatSuggest" />

        <div class="td-graph-dialogs">
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

.td-graph-editor {
    --resize-handle-size: 20px;
    --stencil-width: clamp(160px, 22%, 480px);
    --graph-height: clamp(320px, 65vh, 1000px);
    display: block;
}

.td-graph-main {
    display: grid;
    grid-template-columns: var(--stencil-width) var(--resize-handle-size) minmax(0, 1fr);
    min-width: 0;
}

.td-graph-stencil,
.td-graph-canvas {
    min-width: 0;
}

.td-graph-canvas {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto var(--graph-height) calc(var(--resize-handle-size) + 8px);
    min-width: 0;
}

.td-graph-canvas > .row,
.td-graph-canvas .col {
    min-width: 0;
}

.td-graph-canvas > .row {
    margin-left: 0;
    margin-right: 0;
}

.td-graph-canvas > .row:first-child > .col:last-child :deep(.btn-group) {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    max-width: 100%;
}

.td-graph-stencil {
    min-height: 0;
    overflow: hidden;
    position: relative;
}

.td-graph-stencil > div {
    inset: 0;
    position: absolute;
}

.td-graph-viewport {
    background: $white;
    min-height: 0;
    min-width: 0;
    overflow: hidden;
    position: relative;
}

.td-graph-container {
    height: 100%;
    width: 100%;
}

.td-graph-height-handle.td-resize-handle-horizontal {
    margin-top: 8px;
}

@media (any-pointer: coarse) {
    .td-graph-editor {
        --resize-handle-size: 44px;
    }
}

@media (max-width: 767.98px) {
    .td-graph-main {
        grid-template-columns: 1fr;
    }

    .td-graph-stencil {
        height: 200px;
        max-height: 200px;
    }

    .td-graph-main > .td-resize-handle-vertical {
        display: none;
    }
}
</style>

<script>
import { mapState } from 'vuex';

import TdGraphButtons from '@/components/GraphButtons.vue';
import TdGraphMeta from '@/components/GraphMeta.vue';
import TdKeyboardShortcuts from '@/components/KeyboardShortcuts.vue';
import TdResizeHandle from '@/components/ResizeHandle.vue';
import TdThreatEditDialog from '@/components/ThreatEditDialog.vue';
import TdThreatSuggestDialog from './ThreatSuggestDialog.vue';

import { desktopDiagramSaveRequestEvent } from '@/service/desktop/save.js';
import { getProviderType } from '@/service/provider/providers.js';
import { providerTypes } from '@/service/provider/providerTypes.js';
import diagramService from '@/service/diagram/diagram.js';
import saveDiagram from '@/service/diagram/save.js';
import stencil from '@/service/x6/stencil.js';
import tmActions from '@/store/actions/threatmodel.js';
import analytics, { methodologyForDiagramType } from '@/service/analytics.js';

export default {
    name: 'TdGraph',
    components: {
        TdGraphButtons,
        TdGraphMeta,
        TdKeyboardShortcuts,
        TdResizeHandle,
        TdThreatEditDialog,
        TdThreatSuggestDialog
    },
    computed: {
        ...mapState({
            diagram: (state) => state.threatmodel.selectedDiagram,
            providerType: (state) => getProviderType(state.provider.selected)
        })
    },
    data() {
        return {
            graph: null,
            graphHeightOffset: 0,
            desktopSaveRequestHandler: null,
            stencilOffset: 0
        };
    },
    async mounted() {
        this.updateLayoutVariables();
        this.init();
        analytics.startEditing('diagram');
        analytics.track('DIAGRAM_METHODOLOGY_USED', {
            methodology: methodologyForDiagramType(this.diagram.diagramType)
        });
        if (this.providerType === providerTypes.desktop) {
            this.desktopSaveRequestHandler = () => this.handleDesktopSaveRequest();
            window.addEventListener(desktopDiagramSaveRequestEvent, this.desktopSaveRequestHandler);
        }
    },
    methods: {
        updateLayoutVariables() {
            this.$el.style.setProperty('--stencil-width', `clamp(160px, calc(22% + ${this.stencilOffset}px), 480px)`);
            this.$el.style.setProperty('--graph-height', `clamp(320px, calc(65vh + ${this.graphHeightOffset}px), 1000px)`);
        },
        async resizeStencilWidth(offset) {
            this.stencilOffset = offset;
            this.updateLayoutVariables();
            await this.$nextTick();

            const viewport = this.$refs.graph_viewport;
            this.graph.resize(viewport.clientWidth, viewport.clientHeight);
        },
        async resizeCanvasHeight(offset) {
            this.graphHeightOffset = offset;
            this.updateLayoutVariables();
            await this.$nextTick();

            const viewport = this.$refs.graph_viewport;
            this.graph.resize(viewport.clientWidth, viewport.clientHeight);
        },
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
        threatSelected(threatId, state) {
            this.$refs.threatEditDialog.editThreat(threatId, state);
        },
        threatSuggest(type){
            this.$refs.threatSuggestDialog.showModal(type);
        },
        handleDesktopSaveRequest() {
            if (!this.graph) {
                return;
            }

            saveDiagram.save(this.$store, this.graph, this.diagram);
        },
        saved() {
            console.debug('Save diagram');
            saveDiagram.save(this.$store, this.graph, this.diagram);
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
    unmounted() {
        analytics.finishEditing();
        if (this.desktopSaveRequestHandler) {
            window.removeEventListener(desktopDiagramSaveRequestEvent, this.desktopSaveRequestHandler);
        }
        diagramService.dispose(this.graph);
    }
};
</script>
