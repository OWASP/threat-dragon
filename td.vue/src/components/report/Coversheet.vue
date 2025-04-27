<template>
    <div class="no-print" data-testid="report-coversheet">
        <b-row class="mb-2 td-branding">
            <b-col>
                <em data-testid="report-date">
                    {{ new Date().toDateString() }}
                    <span v-if="branding" class="td-brand-text" data-testid="brand-text">
                        | OWASP Threat Dragon
                    </span>
                </em>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <td-threat-model-summary-card
                    :title-prefix="$t('report.title')"
                    data-testid="threat-model-summary"
                />
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
            default: false
        }
    }
};
</script>
