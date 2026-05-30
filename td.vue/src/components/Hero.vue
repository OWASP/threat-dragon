<template>
    <section :id="id" class="td-hero">
        <h1 v-if="header" class="td-hero-title">{{ header }}</h1>
        <slot></slot>
    </section>
</template>

<style lang="scss">
.td-hero {
    padding: 2rem 1rem;
    margin-bottom: 2rem;
    color: inherit;
    background-color: #e9ecef;
    border-radius: 0.3rem;
}

.td-hero h1,
.td-hero .h1 {
    color: inherit;
}

.td-hero-title {
    font-size: 4rem;
    font-weight: 300;
    line-height: 1.2;
}

.td-hero p {
    margin-bottom: 1rem;
    font-size: 1.25rem;
    font-weight: 300;
}

.td-hero > hr {
    border-top-color: #d0d5da;
}

@media (min-width: 576px) {
    .td-hero {
        padding: 4rem 2rem;
    }
}
</style>

<script>
export default {
    name: 'TdHero',
    props: {
        header: {
            type: String,
            required: false,
            default: ''
        },
        id: {
            type: String,
            required: false,
            default: null
        }
    }
};
</script>
