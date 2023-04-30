<script>
export default {
  name: 'MainDashboard'
};
</script>
<script setup>
import TdDashboardAction from '@/components/DashboardAction.vue';
import { useProviderStore } from '@/stores/provider';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { getDashboardActions } from '@/service/provider/providers.js';

const providerStore = useProviderStore();
const { t } = useI18n();

const actions = computed(() => getDashboardActions(providerStore.selected));
</script>

<template>
  <b-row>
    <b-col>
      <b-jumbotron :header="t('dashboard.welcome.title')">
        <p>
          {{ t('dashboard.welcome.description') }}
        </p>
      </b-jumbotron>
    </b-col>
  </b-row>
  <b-row>
    <td-dashboard-action
      v-for="(action, idx) in actions"
      :key="idx"
      class="dashboard-action"
      :to="action.to"
      :icon="action.icon"
      :icon-preface="action.iconPreface"
      :description="action.key"
    />
  </b-row>
</template>

<style lang="scss" scoped>
.action-icon {
  color: $orange;
  margin-bottom: 15px;
}

.dashboard-action {
  padding-bottom: 2rem;
}
</style>
