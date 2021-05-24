<template>
  <div>
    <b-row>
      <b-col>
        <p>
          Keyboard shortcuts: <b-badge>ctrl+c</b-badge> copy |
          <b-badge>ctrl+v</b-badge> paste | <b-badge>ctrl+z</b-badge> undo |
          <b-badge>ctrl+y</b-badge> redo | <b-badge>del</b-badge> delete |
          <b-badge>shift+left-click</b-badge> pan(drag) |
          <b-badge>click/drag</b-badge> on empty space for multi-select selected
          | <b-badge>ctrl+mousewheel</b-badge> zoom
        </p>
      </b-col>
    </b-row>
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
              <td-form-button :onBtnClick="noOp" icon="times" text="Cancel" />
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
        <b-card header="Actions"> </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import diagramService from '@/service/migration/diagram.js';
import graphFactory from '@/service/x6/graph/graph.js';
import stencil from '@/service/x6/stencil.js';
import TdFormButton from '@/components/FormButton.vue';
/*
  TODOS:
    - "Link from here" - auto-linking of elements (needed or not?)
    - Export JSON
    - Export images
    - Fix CSP
    - Change color if threat associated
    - Change to dotted if out of scope
    - Add ability to change labels and such
    - Save / Cancel buttons are currently no-ops
    - Migrate graph to its own constructor function]
    - Write unit tests
    - Remove fake API call
    - Move to a better location
    - Create component for entity actions
    - Use store instead of data for diagram
    - Add help section for keyboard shortcuts and/or actions you can do
    - Load model from API if not local provider
    - Add vertical scroll bar by default (if needed?)
*/

export default {
    name: 'TdGraph',
    components: {
        TdFormButton,
    },
    computed: mapState({
        diagram: (state) => state.threatmodel.selectedDiagram
    }),
    data() {
        return {
            graph: null,
            gridShowing: true
        };
    },
    async mounted() {
        // TODO: Load model from API if not local provider
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
            // if v1, draw from json
            //this.graph.fromJSON(data);
            this.graph.centerContent();
        },
        drawDiagramV1() {
            const { nodes, edges } = diagramService.mapDiagram(this.diagram);
            nodes.forEach((node) => this.graph.addNode(node), this);
            edges.forEach((edge) => this.graph.addEdge(edge), this);
            this.graph.centerContent();
        }
    },
};
</script>