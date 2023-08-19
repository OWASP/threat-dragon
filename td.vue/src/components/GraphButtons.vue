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
import TdFormButton from '@/components/FormButton.vue';

export default {
    name: 'TdGraphButtons',
    components: {
        TdFormButton
    },
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
            if (this.graph.history.canUndo()) {
                this.graph.history.undo();
            }
        },
        redo() {
            if (this.graph.history.canRedo()) {
                this.graph.history.redo();
            }
        },
        zoomIn() {
            this.graph.zoom(0.2);
        },
        zoomOut() {
            this.graph.zoom(-0.2);
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
        }
    }
};

</script>
