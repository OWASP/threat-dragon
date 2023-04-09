<script>
export default {
  name: 'TdGraph'
};
</script>
<script setup>
import TdGraphButtons from '@/components/GraphButtons.vue';
import TdGraphMeta from '@/components/GraphMeta.vue';
import TdKeyboardShortcuts from '@/components/KeyboardShortcuts.vue';
import TdThreatEditDialog from '@/components/ThreatEditDialog.vue';
import { useThreatModelStore } from '@/stores/threatmodel';
import { useProviderStore } from '@/stores/provider';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { getProviderType } from '@/service/provider/providers.js';
import diagramService from '@/service/migration/diagram.js';
import stencil from '@/service/x6/stencil.js';

const threatModelStore = useThreatModelStore();
const providerStore = useProviderStore();
const router = useRouter();
const { t } = useI18n();

const graph = ref(null);
const graphContainer = ref(null);
const stencilContainer = ref(null);
const threatEditDialog = ref(null);
const diagram = computed(() => threatModelStore.selectedDiagram);
const providerType = computed(() => getProviderType(providerStore.selected));

onMounted(() => {
  init();
});
onUnmounted(() => {
  diagramService.dispose(graph.value);
});

const init = () => {
  graph.value = diagramService.edit(graphContainer.value, diagram.value);
  stencil.get(graph.value, stencilContainer.value);
  console.debug('diagram ID: ' + diagram.value.id);
};
const threatSelected = (threatId) => {
  threatEditDialog.value.editThreat(threatId);
};
const saved = () => {
  const updated = Object.assign({}, diagram.value);
  updated.cells = graph.value.toJSON().cells;
  threatModelStore.diagramUpdated(updated);
  threatModelStore.save();
};
const closed = async () => {
  const diagramChanged = JSON.stringify(graph.value.toJSON().cells) !== JSON.stringify(diagram.value.cells);
  if (!diagramChanged || await getConfirmModal())  {
    await router.push({ name: `${providerType.value}ThreatModel`, params: router.currentRoute.value.params });
  }
};
const getConfirmModal = async () => {
  return window.confirm(t('forms.discardTitle') + '! ' + t('forms.discardMessage'));
  // TODO: create temporary modal component
  // return this.$bvModal.msgBoxConfirm(this.t('forms.discardMessage'), {
  //   title: t('forms.discardTitle'),
  //   okVariant: 'danger',
  //   okTitle: t('forms.ok'),
  //   cancelTitle: t('forms.cancel'),
  //   hideHeaderClose: true,
  //   centered: true
  // });
};
</script>

<template>
  <div>
    <b-row>
      <b-col md="2">
        <div ref="stencilContainer" />
      </b-col>
      <b-col md="10">
        <b-row>
          <b-col>
            <h3 class="td-graph-title">
              {{ diagram.title }}
            </h3>
          </b-col>
          <b-col align="right">
            <td-graph-buttons
              :graph="graph"
              @saved="saved"
              @closed="closed"
            />
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <div
              id="graph-container"
              ref="graphContainer"
              style="height: 65vh"
            />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <td-graph-meta @threat-selected="threatSelected" />

    <div>
      <td-keyboard-shortcuts />
      <td-threat-edit-dialog ref="threatEditDialog" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.td-graph-title {
  margin-right: 15px;
}
</style>
