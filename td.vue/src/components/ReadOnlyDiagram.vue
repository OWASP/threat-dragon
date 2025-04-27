<template>
    <div ref="diagram_container" class="td-readonly-diagram" />
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import debounce from '@/service/debounce.js';
import diagramService from '@/service/migration/diagram.js';

const debounceTimeoutMs = 100;

export default {
    name: 'TdReadOnlyDiagram',
    props: {
        diagram: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const diagram_container = ref(null);
        const graph = ref(null);
        let debouncedResize = null;
        
        const init = () => {
            graph.value = diagramService.draw(diagram_container.value, props.diagram);
            resize();
        };
        
        const resize = () => {
            // Magic number warning... Needs more testing, this seems to work fine for firefox/chrome on linx,
            // but may be OS dependent and/or printer dependent
            const height = 700;
            const maxWidth = 1000;
            
            // Note: In Composition API we need a different way to access parent element
            // Getting the parentElement from the DOM node
            const parentEl = diagram_container.value.parentElement;
            const width = parentEl.clientWidth;
            
            graph.value.resize(Math.min(width, maxWidth) - 50, height - 50);
            graph.value.scaleContentToFit({
                padding: 3
            });
        };
        
        onMounted(() => {
            init();
        });
        
        // This isn't actually standard Vue 3 lifecycle - needs special handling
        // Create the debounced function and attach it before the component is mounted
        debouncedResize = debounce(resize, debounceTimeoutMs);
        window.addEventListener('resize', debouncedResize);
        
        onUnmounted(() => {
            window.removeEventListener('resize', debouncedResize);
            diagramService.dispose(graph.value);
        });
        
        return {
            diagram_container,
            graph,
            init,
            resize
        };
    }
};
</script>

<style lang="scss" scoped>
    .td-readonly-diagram {
        min-height: 600px;
        max-width: 95%;
    }
</style>
