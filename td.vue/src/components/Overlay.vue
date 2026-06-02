<template>
    <div class="td-overlay" :aria-busy="show ? 'true' : 'false'">
        <slot />
        <div v-if="show" class="td-overlay-backdrop" role="status" :aria-label="label">
            <span class="td-overlay-spinner" :class="{ 'td-overlay-spinner-small': small }"></span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.td-overlay {
    position: relative;
}

.td-overlay-backdrop {
    align-items: center;
    background-color: rgba($white, 0.8);
    bottom: 0;
    display: flex;
    justify-content: center;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 10;
}

.td-overlay-spinner {
    animation: td-overlay-spin 0.75s linear infinite;
    border: 0.25rem solid rgba($orange, 0.25);
    border-radius: 50%;
    border-top-color: $orange;
    display: inline-block;
    height: 2rem;
    width: 2rem;
}

.td-overlay-spinner-small {
    border-width: 0.15rem;
    height: 1rem;
    width: 1rem;
}

@keyframes td-overlay-spin {
    to {
        transform: rotate(360deg);
    }
}
</style>

<script>
export default {
    name: 'TdOverlay',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        small: {
            type: Boolean,
            default: false
        },
        label: {
            type: String,
            default: 'Loading'
        }
    }
};
</script>
