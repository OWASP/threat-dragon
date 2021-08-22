<template>
    <div>
        <p>{{ data.label }}</p>
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
 */
export default {
    name: 'TdGraphProperties',
    computed: mapState({
        data: (state) => state.cell.data
    })
};
</script>
