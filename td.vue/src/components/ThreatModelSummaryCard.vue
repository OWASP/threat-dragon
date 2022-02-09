<template>
    <td-key-value-card
        :title="`${titlePrefix ? titlePrefix + ' ' : ''}${model.summary.title}`"
        :values="overviewCardData">
    </td-key-value-card>
</template>

<script>
import { mapState } from 'vuex';

import TdKeyValueCard from '@/components/KeyValueCard.vue';

export default {
    name: 'TdThreatModelSummaryCard',
    components: {
        TdKeyValueCard
    },
    computed: {
        ...mapState({
            model: (state) => state.threatmodel.data,
        }),
        overviewCardData: function () {
            const kvs = [];
            kvs.push({ key: this.$t('threatmodel.owner'), value: this.model.summary.owner });
            kvs.push({ key: this.$t('threatmodel.reviewer'), value: this.model.detail.reviewer });
            kvs.push({ key: this.$t('threatmodel.contributors'), value: this.model.detail.contributors.map(x => x.name).join(', ') });
            return kvs;
        }
    },
    props: {
        titlePrefix: {
            type: String,
            required: false
        }
    }
};

</script>