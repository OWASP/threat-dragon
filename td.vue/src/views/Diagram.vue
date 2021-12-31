<template>
    <div class="mt-5">
        <b-row>
            <b-col>
                <td-graph />
            </b-col>
        </b-row>
    </div>
</template>

<script>
import TdGraph from '@/components/Graph.vue';

export default {
    name: 'Diagram',
    components: {
        TdGraph
    }
};

</script>
