import { computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useFieldDependency } from './useFieldDependency';
import { UI_SET_FIELD_STATE } from '../store/modules/ui';
import dataChanged from '@/service/x6/graph/data-changed.js';

/**
 * Composable for managing GraphProperties component state and behavior
 * 
 * @param {Object} cellRef - Reference to the selected cell
 * @returns {Object} - Object containing reactive properties and methods
 */
export function useGraphProperties(cellRef) {
    const store = useStore();
    const COMPONENT_NAME = 'graphProperties';

    // Computed property for outOfScope with two-way binding
    const outOfScope = computed({
        get: () => cellRef.value?.data?.outOfScope || false,
        set: (value) => {
            if (cellRef.value && cellRef.value.data) {
                cellRef.value.data.outOfScope = value;
        
                // Update the reasonOutOfScopeDisabled state in Vuex
                store.dispatch(UI_SET_FIELD_STATE, {
                    component: COMPONENT_NAME,
                    field: 'reasonOutOfScopeDisabled',
                    value: !value
                });
        
                // If outOfScope is true but reasonOutOfScope is empty, initialize it
                if (value && !cellRef.value.data.reasonOutOfScope) {
                    cellRef.value.data.reasonOutOfScope = '';
                }
        
                // Update the cell properties and style in the graph
                dataChanged.updateProperties(cellRef.value);
                dataChanged.updateStyleAttrs(cellRef.value);
            }
        }
    });

    // Use the field dependency composable to manage the reasonOutOfScope field
    const { isDisabled: reasonOutOfScopeDisabled } = useFieldDependency({
        getSourceValue: () => !outOfScope.value,
        onSourceChange: (isDisabled) => {
            // Update the reasonOutOfScopeDisabled state in Vuex
            store.dispatch(UI_SET_FIELD_STATE, {
                component: COMPONENT_NAME,
                field: 'reasonOutOfScopeDisabled',
                value: isDisabled
            });
        },
        immediate: true
    });

    // Computed property for reasonOutOfScope with two-way binding
    const reasonOutOfScope = computed({
        get: () => {
            if (cellRef.value && cellRef.value.data) {
                return cellRef.value.data.reasonOutOfScope || '';
            }
            return '';
        },
        set: (value) => {
            if (cellRef.value && cellRef.value.data) {
                cellRef.value.data.reasonOutOfScope = value;
                dataChanged.updateProperties(cellRef.value);
            }
        }
    });

    // Watch for changes to the cell reference
    watch(cellRef, (newCell) => {
        if (newCell && newCell.data) {
            // Update the reasonOutOfScopeDisabled state in Vuex
            store.dispatch(UI_SET_FIELD_STATE, {
                component: COMPONENT_NAME,
                field: 'reasonOutOfScopeDisabled',
                value: !newCell.data.outOfScope
            });
        }
    }, { immediate: true });

    return {
        outOfScope,
        reasonOutOfScope,
        reasonOutOfScopeDisabled
    };
}