<script>
export default {
  name: 'TdExecutiveSummary'
};
</script>
<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  summary: {
    type: String,
    required: false,
    default: null
  },
  threats: {
    type: Array,
    required: true
  }
});

const { t } = useI18n();

const tableRows = computed(() => {
  return [
    { name: t('report.threatStats.total'), value: total },
    { name: t('report.threatStats.mitigated'), value: mitigated },
    { name: t('report.threatStats.notMitigated'), value: notMitigated },
    { name: t('report.threatStats.openHigh'), value: openHigh },
    { name: t('report.threatStats.openMedium'), value: openMedium },
    { name: t('report.threatStats.openLow'), value: openLow },
    { name: t('report.threatStats.openUnknown'), value: openUnknown }
  ];
});
const total = computed(() => {
  return props.threats.length;
});
const mitigated = computed(() => {
  return props.threats
    .filter(threat => threat.status.toLowerCase() === 'mitigated')
    .length;
});
const notMitigated = computed(() => {
  return props.threats
    .filter(threat => threat.status.toLowerCase() !== 'mitigated')
    .length;
});
const openHigh = computed(() => {
  return getOpenThreats()
    .filter(threat => threat.severity.toLowerCase() === 'high')
    .length;
});
const openMedium = computed(() => {
  return getOpenThreats()
    .filter(threat => threat.severity.toLowerCase() === 'medium')
    .length;
});
const openLow = computed(() => {
  return getOpenThreats()
    .filter(threat => threat.severity.toLowerCase() === 'low')
    .length;
});
const openUnknown = computed(() => {
  return getOpenThreats()
    .filter(threat => !threat.severity)
    .length;
});

const getOpenThreats = () => {
  return props.threats
    .filter(threat => threat.status && threat.status.toLowerCase() === 'open');
};
const getDataTestId = (item) => {
  return {
    'data-test-id': item.name
  };
};
</script>


<template>
  <div class="td-executive-summary no-print">
    <b-row>
      <b-col>
        <b-card :header="t('report.executiveSummary')">
          <h3 class="td-description-title">
            {{ t('threatmodel.description') }}
          </h3>
          <p class="td-summary">
            {{ summary || t('report.notProvided') }}
          </p>

          <h3 class="td-report-summary">
            {{ t('report.summary') }}
          </h3>
          <b-table
            class="td-executive-summary-data"
            :fields="null"
            :items="tableRows"
            :tbody-tr-attr="getDataTestId"
            striped
          />
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<style lang="scss" scoped>
.td-summary {
  white-space: pre-wrap;
}
</style>
