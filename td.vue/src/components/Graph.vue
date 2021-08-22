<template>
  <div>
    <b-row>
      <b-col md="2">
        <div ref="stencil_container"></div>
      </b-col>
      <b-col md="8">
        <b-row>
          <b-col>
            <b-btn-group>
              <td-form-button
                :isPrimary="true"
                :onBtnClick="noOp"
                icon="save"
                text="Save"
              />
              <td-form-button :onBtnClick="noOp" icon="times" text="Close" />
              <td-form-button :onBtnClick="noOp" v-b-modal.shortcuts  icon="keyboard" text="" />
              <td-form-button :onBtnClick="undo" icon="undo" text="" />
              <td-form-button :onBtnClick="redo" icon="redo" text="" />
              <td-form-button :onBtnClick="zoomIn" icon="search-plus" text="" />
              <td-form-button
                :onBtnClick="zoomOut"
                icon="search-minus"
                text=""
              />
              <td-form-button
                :onBtnClick="deleteSelected"
                icon="trash"
                text=""
              />
              <td-form-button :onBtnClick="togggleGrid" icon="th" text="" />
            </b-btn-group>
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
        <b-card header="Properties">
            <td-graph-properties />
        </b-card>
      </b-col>
    </b-row>

    <div>
        <b-modal id="shortcuts" size="lg" ok-variant="primary" ok-only title="Shortcuts">
            <b-table :items="shortcuts"></b-table>
        </b-modal>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import TdGraphProperties from '@/components/GraphProperties.vue';

import diagramService from '@/service/migration/diagram.js';
import graphFactory from '@/service/x6/graph/graph.js';
import stencil from '@/service/x6/stencil.js';
import TdFormButton from '@/components/FormButton.vue';
/*
  UI TODOs:
    - Data flows should be selectable
        - v1 had a custom tool option for this
        - We will probably need to do the same because of the verticies tool
        - https://x6.antv.vision/en/examples/node/tool#button
    - Traditional data flow component in Stencil
    - Add ability to change labels and other metadata
        - Create component for entity actions
        - Edit labels inline, or keep in separate pane, or both?
        - Edit multiple threats at once
    - Add vertical scroll bar by default (if needed?)
    - "Link from here" - auto-linking of elements (needed or not?)
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
        TdFormButton,
        TdGraphProperties
    },
    computed: mapState({
        diagram: (state) => state.threatmodel.selectedDiagram
    }),
    data() {
        return {
            graph: null,
            gridShowing: true,
            shortcuts: [
                { shortcut: '(ctrl/cmd) + c', action: 'Copy' },
                { shortcut: '(ctrl/cmd) + v', action: 'Paste' },
                { shortcut: '(ctrl/cmd) + z', action: 'Undo' },
                { shortcut: '(ctrl/cmd) + y', action: 'Redo' },
                { shortcut: 'del', action: 'Delete' },
                { shortcut: 'shift + left-click (hold/drag)', action: 'Pan' },
                { shortcut: 'left-click on empty space and drag', action: 'Multi-select' },
                { shortcut: '(ctrl/cmd) + mousewheel', action: 'Zoom' }
            ],
            selectedElement: {
                type: null,
                data: null
            }
        };
    },
    async mounted() {
        this.init();
        this.drawDiagramV1();
    },
    methods: {
        noOp() {
            // TODO: Just for testing
        },
        redo() {
            if (this.graph.canRedo()) {
                this.graph.redo();
            }
        },
        undo() {
            if (this.graph.canUndo()) {
                this.graph.undo();
            }
        },
        zoomOut() {
            this.graph.zoom(-0.2);
        },
        zoomIn() {
            this.graph.zoom(0.2);
        },
        deleteSelected() {
            this.graph.removeCells(this.graph.getSelectedCells());
        },
        togggleGrid() {
            if (this.gridShowing) {
                this.graph.hideGrid();
                this.gridShowing = false;
            } else {
                this.graph.showGrid();
                this.gridShowing = true;
            }
        },
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
        }
    },
};
</script>