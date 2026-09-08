<template>
    <span class="td-badge">
        <slot></slot>
    </span>
</template>

<style scoped>
.td-badge {
    display: inline-block;
    padding: 0.25em 0.4em;
    color: #ffffff;
    font-size: 75%;
    font-weight: 700;
    line-height: 1;
    text-align: center;
    vertical-align: baseline;
    white-space: nowrap;
    background-color: #aea79f;
    border-radius: 0.25rem;
}
</style>

<script>
export default {
    name: 'TdBadge'
};
</script>
