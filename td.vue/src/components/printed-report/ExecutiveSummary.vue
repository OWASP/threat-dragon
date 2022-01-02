<template>
    <div class="page">
        <div class="page-title">
            {{ $t('report.executiveSummary') }}
        </div>
        <div class="page-subtitle">
            {{ $t('threatmodel.description') }}
        </div>
        <div class="mt-2">
            {{ summary || $t('report.notProvided') }}
        </div>
        <div class="page-subtitle">
            {{ $t('report.summary') }}
        </div>
        <div class="mt-2">
            <table class="table td-summary-table">
                <tr>
                    <th>{{ $t('report.threatStats.total') }}</th>
                    <td>{{ total }}</td>
                </tr>
                <tr>
                    <th>{{ $t('report.threatStats.mitigated') }}</th>
                    <td>{{ mitigated }}</td>
                </tr>
                <tr>
                    <th>{{ $t('report.threatStats.notMitigated') }}</th>
                    <td>{{ notMitigated }}</td>
                </tr>
                <tr>
                    <th>{{ $t('report.threatStats.openHigh') }}</th>
                    <td>{{ openHigh }}</td>
                </tr>
                <tr>
                    <th>{{ $t('report.threatStats.openMedium') }}</th>
                    <td>{{ openMedium }}</td>
                </tr>
                <tr>
                    <th>{{ $t('report.threatStats.openLow') }}</th>
                    <td>{{ openLow }}</td>
                </tr>
                <tr>
                    <th>{{ $t('report.threatStats.openUnkown') }}</th>
                    <td>{{ openUnkown }}</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.page {
    display: flex;
    flex-direction: column;
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
        openUnkown: function() {
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