<script>
export default {
  name: 'TdThreatModelSummaryCard'
};
</script>
<script setup>
import TdKeyValueCard from '@/components/KeyValueCard.vue';
import { useThreatModelStore } from '@/stores/threatmodel';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  titlePrefix: {
    type: String,
    required: false,
    default: null
  }
});

const threatModelStore = useThreatModelStore();
const { t } = useI18n();

const model = computed(() => threatModelStore.data);
const overviewCardData = computed(() => {
  const kvs = [];
  kvs.push({key: t('threatmodel.owner'), value: model.value.summary.owner});
  kvs.push({key: t('threatmodel.reviewer'), value: model.value.detail.reviewer});
  kvs.push({
    key: t('threatmodel.contributors'),
    value: model.value.detail.contributors.map(x => x.name).join(', ')
  });
  return kvs;
});
</script>

<template>
  <td-key-value-card
    :title="`${props.titlePrefix ? props.titlePrefix + ' ' : ''}${model.summary.title}`"
    :values="overviewCardData"
  />
</template>
