<script>
export default {
  name: 'TdFormButton'
};
</script>
<script setup>
const props = defineProps({
  onBtnClick: {
    type: Function,
    required: true
  },
  icon: {
    type: String,
    required: false,
    default: null
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
});
</script>

<template>
  <b-btn
    :class="{ 'td-primary-btn': props.isPrimary, 'td-default-btn': !props.isPrimary }"
    :variant="props.isPrimary ? 'primary' : 'secondary'"
    @click="props.onBtnClick"
  >
    <font-awesome-icon
      v-if="props.icon"
      :icon="[props.iconPreface, props.icon]"
    />
    {{ props.text }}
  </b-btn>
</template>

<style lang="scss" scoped>
button {
    font-size: 14px;
}
</style>
