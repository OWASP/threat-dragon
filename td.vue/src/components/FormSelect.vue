<template>
    <select
        :id="id"
        :name="name"
        :disabled="disabled"
        :required="required"
        :size="size"
        class="custom-select"
        :value="selectedIndex"
        @change="onChange"
    >
        <option
            v-for="(option, index) in normalizedOptions"
            :key="`${id || 'td-form-select'}-${index}`"
            :value="String(index)"
            :disabled="option.disabled"
        >
            {{ option.text }}
        </option>
    </select>
</template>

<script>
export default {
    name: 'TdFormSelect',
    model: {
        prop: 'value',
        event: 'input'
    },
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        id: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        options: {
            type: Array,
            required: true
        },
        required: {
            type: Boolean,
            default: false
        },
        size: {
            type: [String, Number],
            default: null
        },
        value: {
            type: [String, Number, Boolean, Object, Array],
            default: null
        }
    },
    computed: {
        normalizedOptions() {
            return this.options.map((option) => {
                if (typeof option === 'object' && option !== null && !Array.isArray(option)) {
                    return {
                        disabled: Boolean(option.disabled),
                        text: option.text ?? option.label ?? String(option.value ?? ''),
                        value: option.value
                    };
                }

                return {
                    disabled: false,
                    text: String(option),
                    value: option
                };
            });
        },
        selectedIndex() {
            const index = this.normalizedOptions.findIndex((option) => option.value === this.value);
            return index === -1 ? '' : String(index);
        }
    },
    methods: {
        onChange(event) {
            const option = this.normalizedOptions[Number(event.target.value)];
            const value = option ? option.value : null;
            this.$emit('input', value);
            this.$emit('change', value);
        }
    }
};
</script>
