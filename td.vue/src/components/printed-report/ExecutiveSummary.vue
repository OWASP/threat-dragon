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
              <tbody>
                <tr>
                    <th>{{ $t('report.threatStats.total') }}</th>
                    <td class="td-summary-total">{{ threatsTotal }}</td>
                </tr>
                <tr>
                    <th>{{ $t('report.threatStats.mitigated') }}</th>
                    <td class="td-summary-mitigated">{{ threatsClosed }}</td>
                </tr>
                <tr v-if="threatsNa" >
                    <th>{{ $t('report.threatStats.notApplicable') }}</th>
                    <td class="td-summary-not-applicable">{{ threatsNa }}</td>
                </tr>
                <tr>
                    <th>{{ $t('report.threatStats.notMitigated') }}</th>
                    <td class="td-summary-not-mitigated">{{ threatsOpen }}</td>
                </tr>
                <tr>
                    <th>{{ $t('report.threatStats.openCritical') }}</th>
                    <td class="td-summary-open-critical">{{ openCritical }}</td>
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
                <tr v-if="openTbd" >
                    <th>{{ $t('report.threatStats.openTbd') }}</th>
                    <td class="td-summary-open-tbd">{{ openTbd }}</td>
                </tr>
                <tr v-if="openUnknown" >
                    <th>{{ $t('report.threatStats.openUnknown') }}</th>
                    <td class="td-summary-open-unknown">{{ openUnknown }}</td>
                </tr>
              </tbody>
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
        }
    }
};

</script>