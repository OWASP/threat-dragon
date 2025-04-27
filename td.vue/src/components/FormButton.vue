<template>
    <BButton
        :class="{ 'td-primary-btn': isPrimary, 'td-default-btn': !isPrimary }"
        :variant="isPrimary ? 'primary' : 'secondary'"
        @click="onBtnClick"
    >
        <font-awesome-icon v-if="icon" :icon="[iconPreface, icon]" />
        {{ text }}
    </BButton>
</template>

<script>
export default {
    name: 'TdFormButton',
    props: {
        onBtnClick: {
            type: Function,
            required: true
        },
        icon: {
            type: String,
            required: false,
            default: ''
        },
        iconPreface: {
            type: String,
            default: 'fas',
            required: false
        },
        text: {
            type: String,
            required: true
        },
        isPrimary: {
            type: Boolean,
            required: false,
            default: false
        }
    }
};
</script>

<style lang="scss" scoped>
    button {
        font-size: 14px;
    }
</style>
