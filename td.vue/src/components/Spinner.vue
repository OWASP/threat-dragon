<template>
    <div class="td-spinner" role="status" :aria-label="label">
        <span class="td-spinner-dots" aria-hidden="true">
            <span class="td-spinner-dot"></span>
            <span class="td-spinner-dot"></span>
            <span class="td-spinner-dot"></span>
        </span>
    </div>
</template>

<style lang="scss" scoped>
.td-spinner-dots {
    align-items: center;
    display: inline-flex;
    gap: 0.75rem;
}

.td-spinner-dot {
    animation: td-spinner-pulse 1.2s ease-in-out infinite;
    background-color: $orange;
    border-radius: 50%;
    height: 1.25rem;
    width: 1.25rem;
}

.td-spinner-dot:nth-child(2) {
    animation-delay: 0.15s;
}

.td-spinner-dot:nth-child(3) {
    animation-delay: 0.3s;
}

@keyframes td-spinner-pulse {
    0%, 60%, 100% {
        opacity: 0.35;
        transform: translateY(0);
    }

    30% {
        opacity: 1;
        transform: translateY(-0.75rem);
    }
}
</style>

<script>
export default {
    name: 'TdSpinner',
    props: {
        label: {
            type: String,
            default: 'Loading'
        }
    }
};
</script>
