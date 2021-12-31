<template>
    <b-btn-group>
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
            :onBtnClick="deleteSelected"
            icon="trash"
            :title="$t('forms.delete')"
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
            :onBtnClick="notImplemented"
            icon="save"
            :text="$t('forms.save')" />

    </b-btn-group>
</template>

<script>
import { mapState } from 'vuex';

import { getProviderType } from '@/service/provider/providers.js';
import TdFormButton from '@/components/FormButton.vue';

export default {
    name: 'TdGraphButtons',
    components: {
        TdFormButton
    },
    computed: mapState({
        providerType: state => getProviderType(state.provider.selected)
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
        notImplemented() {
            this.$toast.info('Not implemented yet. Hang in there, we\'re working on it! :) ');
        },
        closeDiagram() {
            // TODO: This does nothing to revert any changes... Not sure if we want to change that or not?
            this.$router.push({ name: `${this.providerType}ThreatModel`, params: this.$route.params });
        },
        noOp() {
            return;
        },
        undo() {
            if (this.graph.canUndo()) {
                this.graph.undo();
            }
        },
        redo() {
            if (this.graph.canRedo()) {
                this.graph.redo();
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
