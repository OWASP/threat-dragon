<template>
    <div
        :id="id"
        class="bv-no-focus-ring"
        :class="groupClasses"
        role="radiogroup"
        tabindex="-1"
    >
        <template v-for="(option, index) in normalizedOptions">
            <label
                v-if="buttons"
                :key="`button-${index}`"
                class="btn"
                :class="buttonClasses(option)"
                :for="optionId(index)"
            >
                <input
                    :id="optionId(index)"
                    class="d-none"
                    type="radio"
                    :name="computedName"
                    :value="option.value"
                    :checked="isChecked(option)"
                    :disabled="isDisabled(option)"
                    @change="onChange(option.value)"
                >
                {{ option.text }}
            </label>
            <div
                v-else
                :key="`radio-${index}`"
                class="form-check"
                :class="{ 'form-check-inline': !stacked }"
            >
                <input
                    :id="optionId(index)"
                    class="form-check-input"
                    type="radio"
                    :name="computedName"
                    :value="option.value"
                    :checked="isChecked(option)"
                    :disabled="isDisabled(option)"
                    @change="onChange(option.value)"
                >
                <label class="form-check-label" :for="optionId(index)">
                    {{ option.text }}
                </label>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: 'TdFormRadioGroup',
    model: {
        prop: 'value',
        event: 'input'
    },
    props: {
        buttons: {
            type: Boolean,
            default: false
        },
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
        stacked: {
            type: Boolean,
            default: false
        },
        value: {
            type: [String, Number, Boolean, Object, Array],
            default: null
        }
    },
    computed: {
        computedName() {
            return this.name || this.id || `td-form-radio-${this._uid}`;
        },
        groupClasses() {
            if (!this.buttons) {
                return null;
            }

            return {
                'btn-group': !this.stacked,
                'btn-group-toggle': true,
                'btn-group-vertical': this.stacked
            };
        },
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
        }
    },
    methods: {
        buttonClasses(option) {
            return {
                active: this.isChecked(option),
                disabled: this.isDisabled(option),
                'btn-secondary': true
            };
        },
        isChecked(option) {
            return option.value === this.value;
        },
        isDisabled(option) {
            return this.disabled || option.disabled;
        },
        onChange(value) {
            this.$emit('input', value);
            this.$emit('change', value);
        },
        optionId(index) {
            return `${this.id || 'td-form-radio'}-${index}`;
        }
    }
};
</script>
