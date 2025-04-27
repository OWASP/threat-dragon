<template>
    <div class="graph-buttons-wrapper">
        <BButtonGroup class="graph-button-group">
            <td-form-button
                :on-btn-click="deleteSelected"
                icon="trash"
                :title="t('threatmodel.controlButtons.delete')"
                text=""
            />

            <td-form-button
                :on-btn-click="showShortcuts"
                icon="keyboard"
                :title="t('threatmodel.controlButtons.shortcuts')"
                text=""
            />

            <td-form-button
                :on-btn-click="undo"
                icon="undo"
                :title="t('threatmodel.controlButtons.undo')"
                text=""
            />

            <td-form-button
                :on-btn-click="redo"
                icon="redo"
                :title="t('threatmodel.controlButtons.redo')"
                text=""
            />

            <td-form-button
                :on-btn-click="zoomIn"
                icon="search-plus"
                :title="t('threatmodel.controlButtons.zoomIn')"
                text=""
            />

            <td-form-button
                :on-btn-click="zoomOut"
                icon="search-minus"
                :title="t('threatmodel.controlButtons.zoomOut')"
                text=""
            />

            <td-form-button
                :on-btn-click="toggleGrid"
                icon="th"
                :title="t('threatmodel.controlButtons.toggleGrid')"
                text=""
            />

            <b-dropdown id="export-graph-btn" right :text="t('forms.export')">
                <b-dropdown-item id="export-graph-png" @click="exportPNG">
                    {{ t('forms.exportFormats.png') }}
                </b-dropdown-item>
                <b-dropdown-item id="export-graph-jpeg" @click="exportJPEG">
                    {{ t('forms.exportFormats.jpeg') }}
                </b-dropdown-item>
                <b-dropdown-item id="export-graph-svg" @click="exportSVG">
                    {{ t('forms.exportFormats.svg') }}
                </b-dropdown-item>
            </b-dropdown>

            <td-form-button :on-btn-click="closeDiagram" icon="times" :text="t('forms.close')" />

            <td-form-button
                :is-primary="true"
                :on-btn-click="save"
                icon="save"
                :text="t('forms.save')"
            />
        </BButtonGroup>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { useI18n } from '@/i18n/index.js';
import TdFormButton from '@/components/FormButton.vue';
import logger from '@/utils/logger.js';

// Create a logger instance for this component
const log = logger.getLogger('components:GraphButtons');

export default {
    name: 'TdGraphButtons',
    components: {
        TdFormButton
    },
    props: {
        graph: {
            required: false,
            type: Object,
            default: null
        }
    },
    emits: ['saved', 'closed'],
    setup() {
        // Use the composition API for i18n
        const { t } = useI18n();

        return { t };
    },
    data() {
        return {
            gridShowing: true
        };
    },
    computed: mapState({
        diagram: (state) => state.threatmodel.selectedDiagram
    }),
    methods: {
        save() {
            this.$emit('saved');
        },
        async closeDiagram() {
            this.$emit('closed');
        },
        noOp() {
            return;
        },
        showShortcuts() {
            this.$root.$emit('bv::show::modal', 'shortcuts');
        },
        undo() {
            if (this.graph && this.graph.getPlugin('history') && this.graph.getPlugin('history').canUndo()) {
                this.graph.getPlugin('history').undo();
            }
        },
        redo() {
            if (this.graph && this.graph.getPlugin('history') && this.graph.getPlugin('history').canRedo()) {
                this.graph.getPlugin('history').redo();
            }
        },
        zoomIn() {
            if (!this.graph || typeof this.graph.zoom !== 'function') return;

            if (this.graph.zoom() < 1.0) {
                this.graph.zoom(0.1);
            } else {
                this.graph.zoom(0.2);
            }
            log.debug('Zoom level changed:', { level: this.graph.zoom() });
        },
        zoomOut() {
            if (!this.graph || typeof this.graph.zoom !== 'function') return;

            if (this.graph.zoom() < 1.0) {
                this.graph.zoom(-0.1);
            } else {
                this.graph.zoom(-0.2);
            }
            log.debug('Zoom level changed:', { level: this.graph.zoom() });
        },
        deleteSelected() {
            if (!this.graph || typeof this.graph.removeCells !== 'function' || typeof this.graph.getSelectedCells !== 'function') return;

            this.graph.removeCells(this.graph.getSelectedCells());
        },
        toggleGrid() {
            if (!this.graph) return;

            if (this.gridShowing) {
                if (typeof this.graph.hideGrid === 'function') {
                    this.graph.hideGrid();
                    this.gridShowing = false;
                }
            } else {
                if (typeof this.graph.showGrid === 'function') {
                    this.graph.showGrid();
                    this.gridShowing = true;
                }
            }
        },
        exportPNG() {
            if (!this.graph || typeof this.graph.exportPNG !== 'function') return;

            this.graph.exportPNG(`${this.diagram.title}.png`, {
                padding: 50
            });
        },
        exportJPEG() {
            if (!this.graph || typeof this.graph.exportJPEG !== 'function') return;

            this.graph.exportJPEG(`${this.diagram.title}.jpeg`, {
                padding: 50
            });
        },
        exportSVG() {
            if (!this.graph || typeof this.graph.exportSVG !== 'function') return;

            this.graph.exportSVG(`${this.diagram.title}.svg`);
        }
    }
};
</script>

<style lang="scss" scoped>
.graph-buttons-wrapper {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
}

.graph-button-group {
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
}

/* Responsive adjustments for button group */
@media (max-width: 767.98px) {
    .graph-buttons-wrapper {
        justify-content: center;
    }

    :deep(.btn) {
        margin-bottom: 0.25rem;
    }
}
</style>
