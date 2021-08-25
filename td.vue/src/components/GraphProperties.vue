<template>
    <div>
        <p>{{ data.name }}</p>
        <b-btn @click="onBtnClick">Test</b-btn>
        <br /><br />
        <br /><br />
        <input type="text" v-model="data.name" />
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
 * Note: The data is bound, but the UI is only updated when the unselected event happens.  We may want to find a way to force this as needed.
 * 
 */
export default {
    name: 'TdGraphProperties',
    computed: mapState({
        // TODO: Simplify in the store, no need for passing around data and reference separately.  
        // Store can simply have the "selected" property and hold the reference to the selected cell
        data: (state) => state.cell.data,
        cellRef: (state) => state.cell.ref
    }),
    methods: {
        onBtnClick() {
            if (this.cellRef && this.cellRef.getData) {
                console.log(JSON.stringify(this.cellRef.getData()));
            }
        }
    }
};
</script>
