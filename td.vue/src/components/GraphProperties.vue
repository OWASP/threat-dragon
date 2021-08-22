<template>
    <div>
        <p>{{ data.name }}</p>
        <br /><br />
        <br /><br />
        <p>{{ data }}</p>
    </div>
</template>

<script>
import { mapState } from 'vuex';

/**
 * TODO:
 *  - Empty state (nothing selected)
 *  - Entity
 *  - Flow / Trust Boundary (traditional)
 * 
 * Because of the way the graph events and creation were designed, it'd be best to use a store for the selected element / type
 * This may also allow for easier testing of the component in isolation
 * 
 * TODO:
 * How do we push the data back to the cell's data property?
 */
export default {
    name: 'TdGraphProperties',
    computed: mapState({
        data: (state) => state.cell.data
    })
};
</script>
