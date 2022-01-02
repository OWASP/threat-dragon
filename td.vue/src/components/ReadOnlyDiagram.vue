<template>
    <div
        ref="diagram_container"
        class="td-readonly-diagram"
    ></div>
</template>

<style lang="scss" scoped>
.td-readonly-diagram {
    min-height: 600px;
    max-width: 95%;
}
</style>

<script>
import dataChanged from '@/service/x6/graph/data-changed.js';
import debounce from '@/service/debounce.js';
import diagramService from '@/service/migration/diagram.js';
import graphFactory from '@/service/x6/graph/graph.js';


const debounceTimeoutMs = 100;

export default {
    name: 'TdReadOnlyDiagram',
    props: {
        diagram: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            graph: null
        };
    },
    methods: {
        init() {
            this.graph = graphFactory.getReadonlyGraph(this.$refs.diagram_container);
            // TODO: Make this a single source of truth, we currently have the
            // same logic in two places (components/graph.vue)
            if (!this.diagram.version) {
                // TODO: This is for v1 models only
                const { nodes, edges } = diagramService.mapDiagram(this.diagram);
                const batchName = 'td-init';
                this.graph.startBatch(batchName);
                nodes.forEach((node) => this.graph.addNode(node), this);
                edges.forEach((edge) => this.graph.addEdge(edge), this);
                this.graph.stopBatch(batchName);

                this.graph.getCells().forEach((cell) => {
                    dataChanged.updateStyleAttrs(cell);
                });
            } else {
                this.graph.fromJSON(this.diagram);
            }
            
            this.resizeGraph();
        },
        resizeGraph(height) {
            // Magic number warning... Needs more testing, this seems to work fine for firefox/chrome on linx,
            // but may be OS dependent and/or printer dependent

            if (isNaN(height)) {
                height = 700;
            }
            const maxWidth = 1500;
            const width = this.$parent.$el.clientWidth;
            this.graph.unfreeze();
            this.graph.resize(Math.min(width, maxWidth) - 50, height - 50);
            this.graph.scaleContentToFit({
                padding: 3
            });
            this.graph.freeze();
        }
    },
    mounted() {
        this.init();
    },
    created() {
        window.addEventListener('resize', debounce(this.resizeGraph, debounceTimeoutMs));
    },
    destroyed() {
        window.removeEventListener('resize', this.resizeGraph);
    }
};

</script>
