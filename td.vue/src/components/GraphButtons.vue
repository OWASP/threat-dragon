<template>
    <b-btn-group>
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

        <td-dropdown right variant="secondary" :text="$t('forms.export')" id="export-graph-btn">
            <template #default="{ close }">
                <button type="button" class="td-dropdown-item" @click="exportPNG(); close()" id="export-graph-png">
                    PNG
                </button>
                <button type="button" class="td-dropdown-item" @click="exportSVG(); close()" id="export-graph-svg">
                    SVG
                </button>
            </template>
        </td-dropdown>

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

import TdDropdown from '@/components/Dropdown.vue';
import TdFormButton from '@/components/FormButton.vue';

export default {
    name: 'TdGraphButtons',
    components: {
        TdDropdown,
        TdFormButton
    },
    computed: mapState({
        diagram: (state) => state.threatmodel.selectedDiagram,
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
        async exportPNG() {
            await this.withSelectionCleared(() => {
                const currentZoom = this.graph.zoom();
                try {
                    this.graph.zoomTo(1);
                    this.graph.exportPNG(`${this.diagram.title}.png`, {
                        padding: 50
                    });
                }finally{
                    this.graph.zoomTo(currentZoom);
                }
            });
        },
        async exportSVG() {
            await this.withSelectionCleared(() => {
                const currentZoom = this.graph.zoom();
                try{
                    this.graph.zoomTo(1);
                    this.graph.exportSVG(`${this.diagram.title}.svg`);
                }finally{
                    this.graph.zoomTo(currentZoom);
                }
            });
        },
        async withSelectionCleared(fn) {
            
            const selectedCells = this.graph.getSelectedCells();
            
            
            try {
                this.graph.cleanSelection();

                //Rendering is not immediate. Without this pause the export may include
                //the previous selection highlight.
                await new Promise(resolve => setTimeout(resolve, 100));
                
                fn();
            } finally {
                
                
                if (selectedCells.length > 0) {
                    this.graph.select(selectedCells);
                }
            }
        }
    }
};
</script>
