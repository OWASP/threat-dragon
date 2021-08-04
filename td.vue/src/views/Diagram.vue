<template>
    <div class="mt-5">
        <b-row>
            <b-col class="text-center"><h2>{{ diagram.title }}</h2></b-col>
        </b-row>
        <b-row>
            <b-col>
                <td-graph />
            </b-col>
        </b-row>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import TdGraph from '@/components/Graph.vue';

export default {
    name: 'Diagram',
    components: {
        TdGraph
    },
    computed: mapState({
        diagram: (state) => state.threatmodel.selectedDiagram
    })
};

</script>
