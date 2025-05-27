<template>
    <div class="report-box print-only">
        <div class="entity-title">
            {{ `${entity.data.name.replaceAll('\n', ' ')} (${dataType})` }}
            <em v-if="outOfScope">- {{ $t('threatmodel.properties.outOfScope') }}</em>
        </div>
        <p class="entity-description" v-if="outOfScope"><b>{{ $t('threatmodel.properties.reasonOutOfScope') }}:</b> {{ entity.data.reasonOutOfScope }}</p>
        <p class="entity-description" v-if="entity.data.description">{{ $t('threatmodel.properties.description') }}: {{ entity.data.description }}</p>
        <p class="entity-description" v-if="showProperties">{{ properties }}</p>
        <table class="table">
            <thead>
                <tr>
                    <th>{{ $t('threats.properties.number') }}</th>
                    <th>{{ $t('threats.properties.title') }}</th>
                    <th>{{ $t('threats.properties.type') }}</th>
                    <th>{{ $t('threats.properties.severity') }}</th>
                    <th>{{ $t('threats.properties.status') }}</th>
                    <th>{{ $t('threats.properties.score') }}</th>
                    <th>{{ $t('threats.properties.description') }}</th>
                    <th>{{ $t('threats.properties.mitigation') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(threat, idx) in threats"
                    :key="idx"
                >
                    <td>{{ threat.number }}</td>
                    <td>{{ threat.title }}</td>
                    <td>{{ threat.type }}</td>
                    <td>{{ translateSeverity(threat.severity) }}</td>
                    <td>{{ translateStatus(threat.status) }}</td>
                    <td>{{ threat.score }}</td>
                    <td>{{ threat.description }}</td>
                    <td>{{ threat.mitigation }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style lang="scss" scoped>
.report-box {
    display: flex;
    flex-direction: column;
    white-space: pre-wrap;
}

.entity-title {
    font-size: 24px;
    margin-top: 50px;
    margin-bottom: 15px;
    font-weight: bold;
}

.entity-description {
    padding: 15px;
    white-space: pre-wrap;
}
</style>

<script>
import threatService from '@/service/threats/index.js';

export default {
    name: 'TdPrintReportEntity',
    props: {
        entity: Object,
        outOfScope: {
            type: Boolean,
            default: false
        },
        showMitigated: {
            type: Boolean,
            default: true
        },
        showOutOfScope: {
            type: Boolean,
            default: true
        },
        showProperties: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        dataType: function () {
            const entityType = this.entity.data.type.replace('tm.', '').replace('td.', '');
            return this.$t(`threatmodel.shapes.${this.toCamelCase(entityType)}`);
        },
        threats: function () {
            return threatService.filterForDiagram(this.entity.data, {
                showMitigated: this.showMitigated,
                showOutOfScope: this.showOutOfScope
            });
        },
        properties: function () {
            let properties = '';
            if (this.entity.data.bidirection) {
                properties += this.$t('threatmodel.properties.bidirection')  + ', ';
            }
            if (this.entity.data.handlesCardPayment) {
                properties += this.$t('threatmodel.properties.handlesCardPayment')  + ', ';
            }
            if (this.entity.data.handlesGoodsOrServices) {
                properties += this.$t('threatmodel.properties.handlesGoodsOrServices')  + ', ';
            }
            if (this.entity.data.isALog) {
                properties += this.$t('threatmodel.properties.isALog')  + ', ';
            }
            if (this.entity.data.isEncrypted) {
                properties += this.$t('threatmodel.properties.isEncrypted')  + ', ';
            }
            if (this.entity.data.isSigned) {
                properties += this.$t('threatmodel.properties.isSigned')  + ', ';
            }
            if (this.entity.data.isWebApplication) {
                properties += this.$t('threatmodel.properties.isWebApplication')  + ', ';
            }
            if (this.entity.data.privilegeLevel) {
                properties += this.$t('threatmodel.properties.privilegeLevel') + ': ' + this.entity.data.privilegeLevel + ', ';
            }
            if (this.entity.data.providesAuthentication) {
                properties += this.$t('threatmodel.properties.providesAuthentication')  + ', ';
            }
            if (this.entity.data.protocol) {
                properties += this.$t('threatmodel.properties.protocol') + ' (' + this.entity.data.protocol  + '), ';
            }
            if (this.entity.data.publicNetwork) {
                properties += this.$t('threatmodel.properties.publicNetwork')  + ', ';
            }
            if (this.entity.data.storesCredentials) {
                properties += this.$t('threatmodel.properties.storesCredentials')  + ', ';
            }
            if (this.entity.data.storesInventory) {
                properties += this.$t('threatmodel.properties.storesInventory')  + ', ';
            }
            if (properties.length > 2) {
                properties = properties.slice(0, -2);
            }
            return this.$t('threatmodel.properties.title') + ': ' + properties;
        }
    },
    methods: {
        toCamelCase(str) {
            // https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
            return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (ltr, idx) => idx === 0 ? ltr.toLowerCase() : ltr.toUpperCase()).replace(/\s+/g, '');
        },
        translateSeverity(severity) {
            return ({
                'TBD': this.$t('threats.severity.tbd'),
                'Low': this.$t('threats.severity.low'),
                'Medium': this.$t('threats.severity.medium'),
                'High': this.$t('threats.severity.high'),
                'Critical': this.$t('threats.severity.critical')
            })[severity] ?? 'Unknown';
        },
        translateStatus(status) {
            return ({
                'NotApplicable': this.$t('threats.status.notApplicable'),
                'Open': this.$t('threats.status.open'),
                'Mitigated': this.$t('threats.status.mitigated')
            })[status] ?? 'Unknown';
        }
    }
};

</script>