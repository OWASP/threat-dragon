<script>
export default {
  name: 'TdDashboardAction'
};
</script>
<script setup>
import { useI18n } from 'vue-i18n';

const props = defineProps({
  to: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  iconPreface: {
    type: String,
    default: 'fas',
    required: false
  },
  description: {
    type: String,
    required: true
  }
});

const { t } = useI18n();
</script>

<template>
  <b-col lg>
    <b-jumbotron class="text-center action-pane">
      <router-link :to="props.to">
        <font-awesome-icon
          :icon="[props.iconPreface, props.icon]"
          size="3x"
          class="action-icon"
        />
      </router-link>
      <br>
      {{ t(`dashboard.actions.${props.description}`) }}
    </b-jumbotron>
  </b-col>
</template>

<style lang="scss" scoped>
.action-icon {
    color: $orange;
    margin-bottom: 15px;
}

.action-pane {
    min-height: 100%;
    margin-bottom: 0;
}
</style>
