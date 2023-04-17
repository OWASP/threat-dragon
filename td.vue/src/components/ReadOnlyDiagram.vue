<script>
export default {
  name: 'TdReadOnlyDiagram'
};
</script>
<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import debounce from '@/service/debounce.js';
import diagramService from '@/service/migration/diagram.js';

const props = defineProps({
  diagram: {
    type: Object,
    required: true
  }
});

const graph = ref(null);
const diagramContainer = ref(null);
const debounceTimeoutMs = 100;

onMounted(() => {
  window.addEventListener('resize', debounce(resizeGraph, debounceTimeoutMs));
  init();
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeGraph);
  diagramService.dispose(graph.value);
});

const init = () => {
  graph.value = diagramService.draw(diagramContainer.value, props.diagram);
  resizeGraph();
};
const resizeGraph = () => {
  // Magic number warning... Needs more testing, this seems to work fine for firefox/chrome on linx,
  // but may be OS dependent and/or printer dependent
  const height = 700;
  const maxWidth = 1000;

  const width = diagramContainer.value.clientWidth;
  graph.value.unfreeze();
  graph.value.resize(Math.min(width, maxWidth) - 50, height - 50);
  graph.value.scaleContentToFit({
    padding: 3
  });
  graph.value.freeze();
};
</script>

<template>
  <div
    ref="diagramContainer"
    class="td-readonly-diagram"
  />
</template>

<style lang="scss" scoped>
.td-readonly-diagram {
  min-height: 600px;
  max-width: 95%;
}
</style>
