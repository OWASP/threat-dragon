<template>
    <div class="td-executive-summary no-print">
        <b-row>
            <b-col>
                <b-card :header="$t('report.executiveSummary')">
                    <h3 class="td-description-title">{{ $t('threatmodel.description') }}</h3>
                    <p class="td-summary">{{ summary || $t('report.notProvided') }}</p>

                    <h3 class="td-report-summary">{{ $t('report.summary') }}</h3>
                    <b-table
                        class="td-executive-summary-data"
                        :fields="null"
                        :items="tableRows"
                        :tbody-tr-attr="getDataTestId"
                        striped
                    ></b-table>
                </b-card>
            </b-col>
        </b-row>
    </div>
</template>

<style lang="scss" scoped>
.td-summary {
    white-space: pre-wrap;
}
</style>

<script>
export default {
    name: 'TdExecutiveSummary',
    props: {
        summary: {
            type: String,
            required: false
        },
        threats: {
            type: Array,
            required: true
        }
    },
    computed: {
        tableRows: function () {
            return [
                { name: this.$t('report.threatStats.total'), value: this.total },
                { name: this.$t('report.threatStats.mitigated'), value: this.mitigated },
                { name: this.$t('report.threatStats.notMitigated'), value: this.notMitigated },
                { name: this.$t('report.threatStats.openHigh'), value: this.openHigh },
                { name: this.$t('report.threatStats.openMedium'), value: this.openMedium },
                { name: this.$t('report.threatStats.openLow'), value: this.openLow },
                { name: this.$t('report.threatStats.openUnknown'), value: this.openUnknown }
            ];
        },
        total: function () {
            return this.threats.length;
        },
        mitigated: function () {
            return this.threats
                .filter(threat => threat.status.toLowerCase() === 'mitigated')
                .length;
        },
        notMitigated: function () {
            return this.threats
                .filter(threat => threat.status.toLowerCase() !== 'mitigated')
                .length;
        },
        openHigh: function () {
            return this.getOpenThreats()
                .filter(threat => threat.severity.toLowerCase() === 'high')
                .length;
        },
        openMedium: function() {
            return this.getOpenThreats()
                .filter(threat => threat.severity.toLowerCase() === 'medium')
                .length;
        },
        openLow: function() {
            return this.getOpenThreats()
                .filter(threat => threat.severity.toLowerCase() === 'low')
                .length;
        },
        openUnknown: function() {
            return this.getOpenThreats()
                .filter(threat => !threat.severity)
                .length;
        }
    },
    methods: {
        getOpenThreats() {
            return this.threats
                .filter(threat => threat.status && threat.status.toLowerCase() === 'open');
        },
        getDataTestId(item) {
            return {
                'data-test-id': item.name
            };
        }
    }
};

</script>