<template>
  <div>
    <b-row>
      <b-col md="2">
        <div ref="stencil_container"></div>
      </b-col>
      <b-col md="8">
        <b-row>
          <b-col>
                <td-graph-buttons :graph="graph" />
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <div
              id="graph-container"
              ref="graph_container"
              style="min-height: 600px"
            ></div>
          </b-col>
        </b-row>
      </b-col>
      <b-col md="2">
          <td-graph-meta @threatSelected="threatSelected" />
      </b-col>
    </b-row>

    <div>
        <td-keyboard-shortcuts />
        <td-threat-edit-modal ref="threatEditModal" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import TdGraphButtons from '@/components/GraphButtons.vue';
import TdGraphMeta from '@/components/GraphMeta.vue';
import TdKeyboardShortcuts from '@/components/KeyboardShortcuts.vue';
import TdThreatEditModal from '@/components/ThreatEditModal.vue';

import diagramService from '@/service/migration/diagram.js';
import graphFactory from '@/service/x6/graph/graph.js';
import stencil from '@/service/x6/stencil.js';
/*
  UI TODOs:
    - Edit multiple threats at once (nice to have)
    - Add vertical scroll bar by default (if needed?)
    - UI component for encryption (WIP, needs feedback https://github.com/OWASP/threat-dragon/issues/150)
    - Tooltips for graph buttons
    - Enable / Disable buttons based on state
    - Add threat suggestion button
  
  Functional TODOs:
    - Save / Close buttons are currently no-ops
        - Close should track a "dirty" state and alert the user when leaving the page that there are unsaved changes
        - Maybe tap into the window close event as well
    - Threat generation engine / suggested threats
    - Export JSON
    - Export images
    - Fix CSP
    - Write unit tests for this component
*/

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
        locale: (state) => state.locale.locale
    }),
    watch: {
        locale(newLocale, oldLocale) {
            if (newLocale !== oldLocale) {
                this.init();
                this.drawDiagramV1();
                this.shortcuts.length = 0;
                this.getKeyboardShortcuts().forEach(s => this.shortcuts.push(s));
            }
        }
    },
    data() {
        return {
            graph: null
        };
    },
    async mounted() {
        this.init();
        this.drawDiagramV1();
    },
    methods: {
        init() {
            this.graph = graphFactory.get(this.$refs.graph_container);
            stencil.get(this.graph, this.$refs.stencil_container);
            // if v2, draw from json
            //this.graph.fromJSON(data);
            this.graph.centerContent();
        },
        drawDiagramV1() {
            const { nodes, edges } = diagramService.mapDiagram(this.diagram);
            
            const batchName = 'td-init';
            this.graph.startBatch(batchName);
            nodes.forEach((node) => this.graph.addNode(node), this);
            edges.forEach((edge) => this.graph.addEdge(edge), this);
            this.graph.stopBatch(batchName);

            this.graph.centerContent();
        },
        threatSelected(threatId) {
            this.$refs.threatEditModal.show(threatId);
        }
    },
};
</script>