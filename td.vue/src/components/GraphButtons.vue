<template>
    <b-btn-group>

        <td-form-button
            :onBtnClick="generateThreats"
            icon="magic-wand-sparkles"
            :title="$t('threatmodel.buttons.generateThreats')"
            text="" />

        <td-form-button
            :onBtnClick="deleteSelected"
            icon="trash"
            :title="$t('threatmodel.buttons.delete')"
            text="" />

        <td-form-button
            :onBtnClick="noOp"
            v-b-modal.shortcuts
            icon="keyboard"
            :title="$t('threatmodel.buttons.shortcuts')"
            text="" />

        <td-form-button
            :onBtnClick="undo"
            icon="undo"
            :title="$t('threatmodel.buttons.undo')"
            text="" />

        <td-form-button
            :onBtnClick="redo"
            icon="redo"
            :title="$t('threatmodel.buttons.redo')"
            text="" />

        <td-form-button
            :onBtnClick="zoomIn"
            icon="search-plus"
            :title="$t('threatmodel.buttons.zoomIn')"
            text="" />

        <td-form-button
            :onBtnClick="zoomOut"
            icon="search-minus"
            :title="$t('threatmodel.buttons.zoomOut')"
            text="" />

        <td-form-button
            :onBtnClick="toggleGrid"
            icon="th"
            :title="$t('threatmodel.buttons.toggleGrid')"
            text="" />

        <b-dropdown right :text="$t('forms.export')" id="export-graph-btn">
            <b-dropdown-item @click="exportPNG" id="export-graph-png">
                PNG
            </b-dropdown-item>
            <b-dropdown-item @click="exportJPEG" id="export-graph-jpeg">
                JPEG
            </b-dropdown-item>
            <b-dropdown-item @click="exportSVG" id="export-graph-svg">
                SVG
            </b-dropdown-item>
        </b-dropdown>

        <td-form-button
            :onBtnClick="closeDiagram"
            icon="times"
            :text="$t('forms.close')" />

        <td-form-button
            :isPrimary="true"
            :onBtnClick="save"
            icon="save"
            :text="$t('forms.save')" />

    </b-btn-group>
</template>

<script>
import { mapState } from 'vuex';

import TdFormButton from '@/components/FormButton.vue';
import { completeGraphAgentThreats } from '@/service/threats/analyzer/index.js';


export default {
    name: 'TdGraphButtons',
    components: {
        TdFormButton
    },
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
    data() {
        return {
            gridShowing: true
        };
    },
    props: {
        graph: {
            required: true
        }
    },
    methods: {
        generateThreats() {
            completeGraphAgentThreats(this.graph, this.$store);
        },
        save() {
            this.$emit('saved');
        },
        async closeDiagram() {
            this.$emit('closed');
        },
        noOp() {
            return;
        },
        undo() {
            if (this.graph.getPlugin('history').canUndo()) {
                this.graph.getPlugin('history').undo();
            }
        },
        redo() {
            if (this.graph.getPlugin('history').canRedo()) {
                this.graph.getPlugin('history').redo();
            }
        },
        zoomIn() {
            if (this.graph.zoom() < 1.0) {
                this.graph.zoom(0.1);
            } else {
                this.graph.zoom(0.2);
            }
            console.debug('zoom to ' + this.graph.zoom());
        },
        zoomOut() {
            if (this.graph.zoom() < 1.0) {
                this.graph.zoom(-0.1);
            } else {
                this.graph.zoom(-0.2);
            }
            console.debug('zoom to ' + this.graph.zoom());
        },
        deleteSelected() {
            this.graph.removeCells(this.graph.getSelectedCells());
        },
        toggleGrid() {
            if (this.gridShowing) {
                this.graph.hideGrid();
                this.gridShowing = false;
            } else {
                this.graph.showGrid();
                this.gridShowing = true;
            }
        },
        exportPNG() {
            this.graph.exportPNG(`${this.diagram.title}.png`, {
                padding: 50
            });
        },
        exportJPEG() {
            this.graph.exportJPEG(`${this.diagram.title}.jpeg`, {
                padding: 50
            });
        },
        exportSVG() {
            this.graph.exportSVG(`${this.diagram.title}.svg`);
        }
    }
};

</script>
