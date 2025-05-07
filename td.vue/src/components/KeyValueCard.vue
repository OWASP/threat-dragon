<template>
    <b-card :header="title">
        <b-row class="td-card">
            <b-col v-for="(keyvalue, idx) in values" :key="idx" md="2">
                <div>
                    <strong>{{ keyvalue.key }}:</strong>
                </div>
                <div>
                    {{ keyvalue.value }}
                </div>
            </b-col>
        </b-row>
    </b-card>
</template>

<script>
export default {
    name: 'TdKeyValueCard',
    props: {
        title: {
            type: String,
            default: ''
        },
        values: {
            type: Array,
            default: () => []
        }
    }
};
</script>

<style lang="scss" scoped>
    .td-card {
        font-size: 14px;
    }
</style>
