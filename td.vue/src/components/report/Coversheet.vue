<template>
    <div class="no-print">
        <b-row class="mb-2 td-branding">
            <b-col>
                <em class="td-brand-text">
                    {{ new Date().toDateString() }} <span v-if="branding">| OWASP Threat Dragon </span>
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
            default: true
        }
    }
};
</script>
