<script>
export default {
  name: 'TdCoversheet'
};
</script>
<script setup>
import TdThreatModelSummaryCard from '@/components/ThreatModelSummaryCard.vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  branding: {
    type: Boolean,
    default: true
  }
});

const { t } = useI18n();
</script>

<template>
  <div class="no-print">
    <b-row class="mb-2 td-branding">
      <b-col>
        <em>
          {{ new Date().toDateString() }} <span
            v-if="props.branding"
            class="td-brand-text"
          >| OWASP Threat Dragon </span>
        </em>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <td-threat-model-summary-card :title-prefix="t('report.title')" />
      </b-col>
    </b-row>
  </div>
</template>
