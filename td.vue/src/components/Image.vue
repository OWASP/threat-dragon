<template>
    <img
        :src="src"
        :alt="alt"
        :loading="loading"
    />
</template>

<style lang="scss" scoped>
img {
    max-width: 100%;
    height: auto;
}
</style>

<script>
export default {
    name: 'TdImage',
    props: {
        src: {
            type: String,
            required: true
        },
        alt: {
            type: String,
            default: ''
        },
        lazy: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        loading() {
            return this.lazy ? 'lazy' : undefined;
        }
    }
};
</script>
