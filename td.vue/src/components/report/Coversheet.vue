<template>
    <div class="no-print setdark" :class="{'dark-mode': currentTheme === 'dark'}">
        <b-row class="mb-2 td-branding">
            <b-col>
                <em>
                    {{ new Date().toDateString() }} <span v-if="branding" class="td-brand-text">| OWASP Threat Dragon </span>
                </em>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <td-threat-model-summary-card :titlePrefix="$t('report.title')" />
            </b-col>
        </b-row>
    </div>
</template>

<style lang="scss" scoped>
.dark .setdark {
    background-color: #4D4D4D;
    color: #FFFFFF;
    border-color: #dd3820;
}
</style>

<script>
import TdThreatModelSummaryCard from '@/components/ThreatModelSummaryCard.vue';
export default {
    name: 'TdCoversheet',
    components: {
        TdThreatModelSummaryCard
    },
    props: {
        branding: {
            type: Boolean,
            default: false
        }
    }
};
</script>
