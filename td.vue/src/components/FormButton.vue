<template>
    <BButton
        @click="onBtnClick"
        :class="{ 'td-primary-btn': isPrimary, 'td-default-btn': !isPrimary }"
        :variant="isPrimary ? 'primary' : 'secondary'"
    >
        <font-awesome-icon
            v-if="icon"
            :icon="[iconPreface, icon]"
        ></font-awesome-icon>
        {{ text }}
    </BButton>
</template>

<style lang="scss" scoped>
button {
    font-size: 14px;
}
</style>

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
            required: false
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
