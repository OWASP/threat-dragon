<template>
    <div class="page print-only">
        <div class="page-title">
            {{ $t('report.executiveSummary') }}
        </div>
        <div class="page-subtitle td-description">
            {{ $t('threatmodel.description') }}
        </div>
        <div class="mt-2 td-summary">
            {{ summary || $t('report.notProvided') }}
        </div>
        <div class="page-subtitle td-report-summary">
            {{ $t('report.summary') }}
        </div>
        <div class="mt-2">
            <table class="table td-summary-table">
                <tr>
                    <th>{{ $t('report.threatStats.total') }}</th>
                    <td class="td-summary-total">{{ total }}</td>
                </tr>
                <tr>
                    <th>{{ $t('report.threatStats.mitigated') }}</th>
                    <td class="td-summary-mitigated">{{ mitigated }}</td>
                </tr>
                <tr>
                    <th>{{ $t('report.threatStats.notMitigated') }}</th>
                    <td class="td-summary-not-mitigated">{{ notMitigated }}</td>
                </tr>
                <tr>
                    <th>{{ $t('report.threatStats.openHigh') }}</th>
                    <td class="td-summary-open-high">{{ openHigh }}</td>
                </tr>
                <tr>
                    <th>{{ $t('report.threatStats.openMedium') }}</th>
                    <td class="td-summary-open-medium">{{ openMedium }}</td>
                </tr>
                <tr>
                    <th>{{ $t('report.threatStats.openLow') }}</th>
                    <td class="td-summary-open-low">{{ openLow }}</td>
                </tr>
                <tr>
                    <th>{{ $t('report.threatStats.openUnknown') }}</th>
                    <td class="td-summary-open-unknown">{{ openUnknown }}</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.page {
    display: flex;
    flex-direction: column;
    white-space: pre-wrap;
}
</style>

<script>
export default {
    name: 'TdPrintExecutiveSummary',
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
        }
    }
};

</script>