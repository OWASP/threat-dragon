<template>
    <div class="mt-5">
        <b-row>
            <b-col class="text-center"><h2>Graph Test</h2></b-col>
        </b-row>
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
