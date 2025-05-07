<template>
    <td-key-value-card
        :title="`${titlePrefix ? titlePrefix + ' ' : ''}${model.summary.title}`"
        :values="overviewCardData"
    />
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from '@/i18n';

import TdKeyValueCard from '@/components/KeyValueCard.vue';

export default {
    name: 'TdThreatModelSummaryCard',
    components: {
        TdKeyValueCard
    },
    props: {
        titlePrefix: {
            type: String,
            required: false,
            default: ''
        }
    },
    setup() {
        const store = useStore();
        const { t } = useI18n();
        
        const model = computed(() => store.state.threatmodel.data);
        
        const overviewCardData = computed(() => {
            const kvs = [];
            kvs.push({ key: t('threatmodel.owner'), value: model.value.summary.owner });
            kvs.push({
                key: t('threatmodel.reviewer'),
                value: model.value.detail.reviewer
            });
            kvs.push({
                key: t('threatmodel.contributors'),
                value: model.value.detail.contributors.map((x) => x.name).join(', ')
            });
            return kvs;
        });
        
        return {
            model,
            overviewCardData
        };
    }
};
</script>
