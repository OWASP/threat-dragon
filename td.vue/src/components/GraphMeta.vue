<script>
export default {
  name: 'TdGraphMeta'
};
</script>
<script setup>
import TdGraphProperties from '@/components/GraphProperties.vue';
import TdThreatCard from '@/components/ThreatCard.vue';
import {useCellStore} from '@/stores/cell';
import {useThreatModelStore} from '@/stores/threatmodel';
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import { createNewTypedThreat } from '@/service/threats/index.js';
import dataChanged from '@/service/x6/graph/data-changed.js';

const cellStore = useCellStore();
const threatModelStore = useThreatModelStore();
const { t } = useI18n();

const cellRef = computed(() => cellStore.ref);
const threats = computed(() => cellStore.threats);
const diagram = computed(() => threatModelStore.selectedDiagram);
const disableNewThreat = computed(function() {
  return cellStore.ref.data.outOfScope || cellStore.ref.data.isTrustBoundary || cellStore.ref.data.type === 'tm.Text';
});

const threatSelected = (threatId) => {
  emits('threat-selected', threatId);
};
const newThreat = () => {
  const threat = createNewTypedThreat(diagram.value.diagramType, cellRef.value.data.type);
  cellRef.value.data.threats.push(threat);
  cellRef.value.data.hasOpenThreats = cellRef.value.data.threats.length > 0;
  cellStore.dataUpdated(cellRef.value.data);
  dataChanged.updateStyleAttrs(cellRef.value);
  threatSelected(threat.id);
};

const emits = defineEmits(['threat-selected']);
</script>

<template>
  <b-row>
    <b-col md="6">
      <b-card :header="`${t('threatmodel.properties.title')}`">
        <b-card-body>
          <td-graph-properties />
        </b-card-body>
      </b-card>
    </b-col>
    <b-col md="6">
      <b-card header-tag="header">
        <template #header>
          {{ t('threatmodel.threats') }}

          <b-btn
            v-if="!!cellRef"
            :disabled="disableNewThreat"
            variant="primary"
            size="sm"
            class="float-right"
            @click="newThreat()"
          >
            <font-awesome-icon
              icon="plus"
              class="mr-1"
            />
            {{ t('threats.newThreat') }}
          </b-btn>
        </template>
        <b-card-body>
          <b-card-text v-if="!!cellRef">
            <b-row>
              <b-col
                v-for="(threat, idx) in threats || []"
                :key="idx"
                md="4"
              >
                <td-threat-card
                  :id="threat.id"
                  :status="threat.status"
                  :severity="threat.severity"
                  :description="threat.description"
                  :title="threat.title"
                  :type="threat.type"
                  :mitigation="threat.mitigation"
                  :model-type="threat.modelType"
                  :number="threat.number"
                  @threat-selected="threatSelected"
                />
              </b-col>
            </b-row>
          </b-card-text>
          <b-card-text
            v-if="!cellRef || !cellRef.data"
          >
            {{ t('threats.emptyThreat') }}
          </b-card-text>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>
</template>

<style lang="scss" scoped>
.props-header {
  a {
    font-size: 12px;
    font-weight: bolder;
    text-decoration: none;
    margin-left: 5px;
  }
}
.down-icon {
  margin-left: 3px;
}
.collapsed > .when-open,
.not-collapsed > .when-closed {
  display: none;
}
</style>
