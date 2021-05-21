<template>
  <div>
    <b-row>
        <b-col md="2">
            <div ref="stencil_container"></div>
        </b-col>
      <b-col>
        <div
          id="graph-container"
          ref="container"
          style="min-height: 600px"
        ></div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { Addon, Graph, Shape } from "@antv/x6";

const data = {
  nodes: [
    {
      id: "node1",
      x: 40,
      y: 40,
      width: 80,
      height: 40,
      label: "hello",
    },
    {
      id: "node2",
      x: 40,
      y: 180,
      width: 80,
      height: 40,
      label: "world",
    },
    {
      id: "node3",
      x: 220,
      y: 65,
      width: 80,
      height: 40,
      label: "test",
    },
  ],
  edges: [
    {
      source: "node1",
      target: "node2",
    },
    {
      source: "node1",
      target: "node3",
    },
    {
      source: "node3",
      target: "node1",
    },
  ],
};

export default {
  name: "TdGraph",
  mounted() {
    this.init();
  },
  methods: {
    init() {
        // https://x6.antv.vision/en/docs/tutorial/basic/dnd
      const graph = new Graph({
        container: this.$refs.container,
        width: "100%",
        height: "100%",
        history: {
            enabled: true
        },
        grid: {
          size: 10,
          visible: true,
        },
      });
      graph.fromJSON(data);
              const stencil = new Addon.Stencil({
            title: 'MyStencil',
            target: graph,
      stencilGraphWidth: 200,
      stencilGraphHeight: 180,
            groups: [
                {
                    name: 'test1',
                    title: 'Test 1',
                    collapsed: false,
                    collapsable: false
                },
                {
                    name: 'test2',
                    title: 'Test 2',
                    collapsed: false,
                    collapsable: true
                }
            ]
        });

    const ropts = {
        width: 70,
        height: 40
    };

    const copts = {
        width: 50,
        height: 50
    };
        const r1 = new Shape.Rect(ropts);
        const c1 = new Shape.Circle(copts);
        const r2 = new Shape.Rect(ropts);
        const c2 = new Shape.Circle(copts);
        const r3 = new Shape.Rect(ropts);
        const c3 = new Shape.Circle(copts);
        stencil.load([r1, c1, c2, r2.clone()], 'test1');
        stencil.load([c2.clone(), r2, r3, c3], 'test2');
        this.$refs.stencil_container.appendChild(stencil.container);

    },
  },
};
</script>