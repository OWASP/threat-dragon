import { computed, watch } from 'vue';

/**
 * Composable for managing field dependencies in forms
 * 
 * @param {Object} options - Configuration options
 * @param {Function} options.getSourceValue - Function that returns the current value of the source field
 * @param {Function} options.onSourceChange - Callback when source value changes
 * @param {Boolean} options.immediate - Whether to run the callback immediately
 * @param {Boolean} options.invert - Whether to invert the dependency logic (default: false)
 * @returns {Object} - Object containing reactive properties for dependent fields
 */
export function useFieldDependency(options = {}) {
    const {
        getSourceValue,
        onSourceChange = () => {},
        immediate = true,
        invert = false
    } = options;
  
    // Create a computed property for the source value
    const sourceValue = computed(getSourceValue);
  
    // Watch for changes to the source value
    watch(sourceValue, (newValue, oldValue) => {
        onSourceChange(newValue, oldValue);
    }, { immediate });
  
    // Create a computed property for the disabled state
    const isDisabled = computed(() => {
        return invert ? sourceValue.value : !sourceValue.value;
    });
  
    return {
        sourceValue,
        isDisabled
    };
}