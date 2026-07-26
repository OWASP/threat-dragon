<template>
    <div
        v-bind="$attrs"
        class="input-group td-input-group"
        role="group"
    >
        <div
            v-if="$slots.prepend"
            class="input-group-prepend td-input-group-prepend"
        >
            <slot name="prepend"></slot>
        </div>
        <slot></slot>
        <div
            v-if="$slots.append"
            class="input-group-append td-input-group-append"
        >
            <slot name="append"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TdInputGroup',
    inheritAttrs: false
};
</script>
