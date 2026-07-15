<template>
    <div :id="id" class="btn-group td-threat-status-selector">
        <td-form-radio-group
            :id="`${id}-primary`"
            :value="value"
            :options="primaryOptions"
            buttons
            @input="selectStatus"
        ></td-form-radio-group>
        <td-dropdown
            class="td-treatment-dropdown"
            :class="{ active: treatmentSelected }"
            variant="secondary"
            :text="selectedTreatmentText"
        >
            <template #default="{ close }">
                <button
                    v-for="status in treatmentOptions"
                    :key="status.value"
                    type="button"
                    class="td-dropdown-item"
                    @click="selectStatus(status.value); close()"
                >
                    {{ status.text }}
                </button>
            </template>
        </td-dropdown>
    </div>
</template>

<script>
import {
    getPrimaryStatusOptions,
    getTreatmentStatusOptions,
    isResolved
} from '@/service/threats/status.js';
import TdDropdown from '@/components/Dropdown.vue';
import TdFormRadioGroup from '@/components/FormRadioGroup.vue';

export default {
    name: 'TdThreatStatusSelector',
    components: {
        TdDropdown,
        TdFormRadioGroup
    },
    model: {
        prop: 'value',
        event: 'input'
    },
    props: {
        id: {
            type: String,
            default: 'status'
        },
        value: {
            type: String,
            default: ''
        }
    },
    computed: {
        primaryOptions() {
            return getPrimaryStatusOptions((key) => this.$t(key));
        },
        treatmentOptions() {
            return getTreatmentStatusOptions((key) => this.$t(key));
        },
        treatmentSelected() {
            return isResolved(this.value);
        },
        selectedTreatmentText() {
            return this.treatmentOptions.find((status) => status.value === this.value)?.text
                || this.treatmentOptions[0].text;
        }
    },
    methods: {
        selectStatus(status) {
            this.$emit('input', status);
            this.$emit('change', status);
        }
    }
};
</script>

<style lang="scss" scoped>
.td-threat-status-selector :deep(.bv-no-focus-ring) {
    display: inline-flex;
}

.td-treatment-dropdown.active :deep(.td-dropdown-toggle) {
    background-color: darken($gray, 10%);
    border-color: darken($gray, 12.5%);
}
</style>
