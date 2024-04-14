<template>
    <td-key-value-card
        class="setdark"
        :class="{'dark-mode': currentTheme === 'dark'}"
        :title="`${titlePrefix ? titlePrefix + ' ' : ''}${model.summary.title}`"
        :values="overviewCardData">
    </td-key-value-card>
</template>

<style lang="scss" scoped>
.dark .setdark{
  background-color: $dark-card-bg;
  color: $dark-text;
  border-color: $dark-border;
}
</style>

<script>
import { mapState, mapGetters } from 'vuex';

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
        ...mapGetters({
            themeClass: 'theme/currentTheme' // Accessing the 'currentTheme' getter from the 'theme' module
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