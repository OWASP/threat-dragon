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
            const totalStats = [
                { metric: this.$t('report.threatStats.total'), total: this.threatsTotal },
                { metric: this.$t('report.threatStats.mitigated'), total: this.threatsClosed },
                { metric: this.$t('report.threatStats.notMitigated'), total: this.threatsOpen }
            ];
            const openStats = [
                { metric: this.$t('report.threatStats.openCritical'), total: this.openCritical },
                { metric: this.$t('report.threatStats.openHigh'), total: this.openHigh },
                { metric: this.$t('report.threatStats.openMedium'), total: this.openMedium },
                { metric: this.$t('report.threatStats.openLow'), total: this.openLow }
            ];
            // only report N/A, TBDs and unknowns if they exist
            if (this.threatsNa) {
                totalStats.push({ metric: this.$t('report.threatStats.notApplicable'), total: this.threatsNa });
            }
            if (this.threatsAccepted) {
                totalStats.push({ metric: this.$t('report.threatStats.accepted'), total: this.threatsAccepted });
            }
            if (this.threatsTransferred) {
                totalStats.push({ metric: this.$t('report.threatStats.transferred'), total: this.threatsTransferred });
            }
            if (this.threatsAvoided) {
                totalStats.push({ metric: this.$t('report.threatStats.avoided'), total: this.threatsAvoided });
            }
            if (this.threatsEliminated) {
                totalStats.push({ metric: this.$t('report.threatStats.eliminated'), total: this.threatsEliminated });
            }
            if (this.openTbd) {
                openStats.push({ metric: this.$t('report.threatStats.openTbd'), total: this.openTbd });
            }
            if (this.openUnknown) {
                openStats.push({ metric: this.$t('report.threatStats.openUnknown'), total: this.openUnknown });
            }
            return totalStats.concat(openStats);
        },
        threatsTotal: function () {
            return this.threats.length;
        },
        threatsClosed: function () {
            return this.threats
                .filter(threat => threat.status === 'Mitigated')
                .length;
        },
        threatsNa: function () {
            return this.threats
                .filter(threat => threat.status === 'NotApplicable')
                .length;
        },
        threatsAccepted: function () {
            return this.threats
                .filter(threat => threat.status === 'Accepted')
                .length;
        },
        threatsTransferred: function () {
            return this.threats
                .filter(threat => threat.status === 'Transferred')
                .length;
        },
        threatsAvoided: function () {
            return this.threats
                .filter(threat => threat.status === 'Avoided')
                .length;
        },
        threatsEliminated: function () {
            return this.threats
                .filter(threat => threat.status === 'Eliminated')
                .length;
        },
        threatsOpen: function () {
            return this.threats
                .filter(threat => threat.status === 'Open')
                .length;
        },
        openCritical: function () {
            return this.getOpenThreats()
                .filter(threat => threat.severity === 'Critical')
                .length;
        },
        openHigh: function () {
            return this.getOpenThreats()
                .filter(threat => threat.severity === 'High')
                .length;
        },
        openMedium: function() {
            return this.getOpenThreats()
                .filter(threat => threat.severity === 'Medium')
                .length;
        },
        openLow: function() {
            return this.getOpenThreats()
                .filter(threat => threat.severity === 'Low')
                .length;
        },
        openTbd: function() {
            return this.getOpenThreats()
                .filter(threat => threat.severity === 'TBD')
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
                .filter(threat => threat.status && threat.status === 'Open');
        },
        getDataTestId(item) {
            return {
                'data-test-id': item.metric
            };
        }
    }
};

</script>
