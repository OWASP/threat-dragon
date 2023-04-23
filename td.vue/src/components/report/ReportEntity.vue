<script>
export default {
  name: 'TdReportEntity'
};
</script>
<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import threatService from '@/service/threats/index.js';

const props = defineProps({
  entity: {
    type: Object,
    required: true
  },
  outOfScope: {
    type: Boolean,
    default: false
  },
  showOutOfScope: {
    type: Boolean,
    default: true
  },
  showMitigated: {
    type: Boolean,
    default: true
  }
});

const { t } = useI18n();

const dataType = computed(() => {
  const entityType = props.entity.data.type.replace('tm.', '').replace('td.', '');
  return t(`threatmodel.shapes.${toCamelCase(entityType)}`);
});
const tableData = computed(() => {
  return threatService.filterForDiagram(props.entity.data, {
    showOutOfScope: props.showOutOfScope,
    showMitigated: props.showMitigated
  }).map((threat) => {
    return {
      [t('threats.properties.number')]: threat.number,
      [t('threats.properties.title')]: threat.title,
      [t('threats.properties.type')]: threat.type,
      [t('threats.properties.priority')]: threat.severity,
      [t('threats.properties.status')]: threat.status,
      [t('threats.properties.score')]: threat.score,
      [t('threats.properties.description')]: threat.description,
      [t('threats.properties.mitigation')]: threat.mitigation

    };
  });
});

const toCamelCase = (str) => {
  // https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (ltr, idx) => idx === 0 ? ltr.toLowerCase() : ltr.toUpperCase()).replace(/\s+/g, '');
};
</script>

<template>
  <div class="td-threat-data no-print">
    <b-row>
      <b-col>
        <h3 class="entity-title">
          {{ `${props.entity.data.name} (${dataType})` }}
          <em v-if="props.outOfScope">- {{ t('threatmodel.properties.outOfScope') }}</em>
        </h3>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <p class="entity-description">
          {{ props.entity.data.description }}
        </p>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="12">
        <b-table
          :data-test-id="props.entity.data.name.replace(' ', '_')"
          :items="tableData"
          striped
          responsive
        />
      </b-col>
    </b-row>
  </div>
</template>

<style lang="scss" scoped>
.td-threat-data {
  width: 99%;
  white-space: pre-wrap;
}
</style>
