<script>
export default {
  name: 'TdGraphButtons'
};
</script>
<script setup>
import TdFormButton from '@/components/FormButton.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  graph: {
    type: Object,
    required: true
  }
});

const { t } = useI18n();

const gridShowing = ref(true);

const save = () => {
  emits('saved');
};
const closeDiagram = async () => {
  emits('closed');
};
const noOp = () => {
  return;
};
const undo = () => {
  if (props.graph.canUndo()) {
    props.graph.undo();
  }
};
const redo = () => {
  if (props.graph.canRedo()) {
    props.graph.redo();
  }
};
const zoomIn = () => {
  props.graph.zoom(0.2);
};
const zoomOut = () => {
  props.graph.zoom(-0.2);
};
const deleteSelected = () => {
  props.graph.removeCells(props.graph.getSelectedCells());
};
const toggleGrid = () => {
  if (gridShowing.value) {
    props.graph.hideGrid();
    gridShowing.value = false;
  } else {
    props.graph.showGrid();
    gridShowing.value = true;
  }
};

const emits = defineEmits(['saved', 'closed']);
</script>

<template>
  <b-btn-group>
    <td-form-button
      :on-btn-click="deleteSelected"
      icon="trash"
      :title="t('threatmodel.buttons.delete')"
      text=""
    />

    <td-form-button
      v-b-modal.shortcuts
      :on-btn-click="noOp"
      icon="keyboard"
      :title="t('threatmodel.buttons.shortcuts')"
      text=""
    />

    <td-form-button
      :on-btn-click="undo"
      icon="undo"
      :title="t('threatmodel.buttons.undo')"
      text=""
    />

    <td-form-button
      :on-btn-click="redo"
      icon="redo"
      :title="t('threatmodel.buttons.redo')"
      text=""
    />

    <td-form-button
      :on-btn-click="zoomIn"
      icon="search-plus"
      :title="t('threatmodel.buttons.zoomIn')"
      text=""
    />

    <td-form-button
      :on-btn-click="zoomOut"
      icon="search-minus"
      :title="t('threatmodel.buttons.zoomOut')"
      text=""
    />

    <td-form-button
      :on-btn-click="toggleGrid"
      icon="th"
      :title="t('threatmodel.buttons.toggleGrid')"
      text=""
    />

    <td-form-button
      :on-btn-click="closeDiagram"
      icon="times"
      :text="t('forms.close')"
    />

    <td-form-button
      :is-primary="true"
      :on-btn-click="save"
      icon="save"
      :text="t('forms.save')"
    />
  </b-btn-group>
</template>
