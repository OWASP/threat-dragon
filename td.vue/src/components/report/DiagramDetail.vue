<script>
export default {
  name: 'TdDiagramDetail'
};
</script>
<script setup>
import TdPrintReportEntity from '@/components/printed-report/ReportEntity.vue';
import TdReadOnlyDiagram from '@/components/ReadOnlyDiagram.vue';
import TdReportEntity from '@/components/report/ReportEntity.vue';
import { computed } from 'vue';

const props = defineProps( {
  diagram: {
    type: Object,
    required: true
  },
  showOutOfScope: {
    type: Boolean,
    default: true
  },
  showMitigated: {
    type: Boolean,
    default: true
  },
  showDiagram: {
    type: Boolean,
    default: true
  }
});

const entitiesWithThreats = computed(() => {
  return props.diagram.cells
    .filter(x => !!x.data && !!x.data.threats)
    .filter(x => props.showOutOfScope || !x.data.outOfScope)
    .filter(x => x.data.threats.some(y => props.showMitigated || y.status.toLowerCase() !== 'mitigated'));
});
</script>

<template>
  <div class="page">
    <b-row class="mt-3">
      <b-col>
        <h2 class="td-diagram-title">
          {{ props.diagram.title }}
        </h2>
      </b-col>
    </b-row>
    <b-row
      v-if="props.showDiagram"
      class="mt-3 page diagram-drawing"
    >
      <b-col>
        <td-read-only-diagram :diagram="props.diagram" />
      </b-col>
    </b-row>
    <b-row
      v-for="(entity, idx) in entitiesWithThreats"
      :key="idx"
      class="mt-3 no-print"
    >
      <b-col>
        <td-report-entity
          :entity="entity"
          :out-of-scope="entity.data.outOfScope"
          :show-out-of-scope="props.showOutOfScope"
          :show-mitigated="props.showMitigated"
        />
      </b-col>
    </b-row>

    <div class="page-title print-only td-threats-title">
      {{ props.diagram.title }}
    </div>
    <div
      v-for="(entity, idx) in entitiesWithThreats"
      :key="`print-${idx}`"
    >
      <td-print-report-entity
        :entity="entity"
        :out-of-scope="entity.data.outOfScope"
        :show-out-of-scope="props.showOutOfScope"
        :show-mitigated="props.showMitigated"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.diagram-drawing {
  min-height: 600px;
  display: flex !important;
}
</style>
