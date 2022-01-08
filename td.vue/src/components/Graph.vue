<template>
  <div>
    <b-row>
      <b-col md="2">
        <div ref="stencil_container"></div>
      </b-col>
      <b-col md="10">
        <b-row>
          <b-col>
            <h3 class="td-graph-title">{{ diagram.title }}</h3>
          </b-col>
          <b-col align="right">
                <td-graph-buttons :graph="graph" @saved="saved" @closed="closed" />
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <div
              id="graph-container"
              ref="graph_container"
              style="height: 65vh"
            ></div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <td-graph-meta @threatSelected="threatSelected" />

    <div>
        <td-keyboard-shortcuts />
        <td-threat-edit-modal ref="threatEditModal" />
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
import TdThreatEditModal from '@/components/ThreatEditModal.vue';

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
        TdThreatEditModal
    },
    computed: mapState({
        diagram: (state) => state.threatmodel.selectedDiagram,
        providerType: state => getProviderType(state.provider.selected)
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
        },
        threatSelected(threatId) {
            this.$refs.threatEditModal.show(threatId);
        },
        saved() {
            const updated = Object.assign({}, this.diagram);
            updated.cells = this.graph.toJSON().cells;
            this.$store.dispatch(tmActions.diagramUpdated, updated);
            this.$toast.info('Only saving in-memory, data not persisted to back-end');
        },
        async closed() {
            const dataChanged = JSON.stringify(this.graph.toJSON().cells) !== JSON.stringify(this.diagram.cells);
            if (!dataChanged || await this.getConfirmModal()) {
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