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

<script>
import { mapState } from 'vuex';

import TdGraphButtons from '@/components/GraphButtons.vue';
import TdGraphMeta from '@/components/GraphMeta.vue';
import TdKeyboardShortcuts from '@/components/KeyboardShortcuts.vue';
import TdThreatEditDialog from '@/components/ThreatEditDialog.vue';

import { getProviderType } from '@/service/provider/providers.js';
import diagramService from '@/service/migration/diagram.js';
import stencil from '@/service/x6/stencil.js';
import tmActions from '@/store/actions/threatmodel.js';

export default {
    name: 'TdGraph',
    components: {
        TdGraphButtons,
        TdGraphMeta,
        TdKeyboardShortcuts,
        TdThreatEditDialog
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
    },
    methods: {
        init() {
            this.graph = diagramService.edit(this.$refs.graph_container, this.diagram);
            stencil.get(this.graph, this.$refs.stencil_container);
            console.debug('diagram ID: ' + this.diagram.id);
        },
        threatSelected(threatId) {
            this.$refs.threatEditDialog.showModal(threatId);
        },
        saved() {
            const updated = Object.assign({}, this.diagram);
            updated.cells = this.graph.toJSON().cells;
            this.$store.dispatch(tmActions.diagramUpdated, updated);
            this.$store.dispatch(tmActions.save);
        },
        async closed() {
            const diagramChanged = JSON.stringify(this.graph.toJSON().cells) !== JSON.stringify(this.diagram.cells);
            if (!diagramChanged || await this.getConfirmModal()) {
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
