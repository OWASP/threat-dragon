<template>
    <div class="td-threat-data no-print">
        <b-row>
            <b-col>
                <h3 class="entity-title">
                    {{ `${entity.data.name.replaceAll('\n', ' ')} (${dataType})` }}
                    <em v-if="outOfScope">- {{ $t('threatmodel.properties.outOfScope') }}</em>
                </h3>
            </b-col>
        </b-row>
        <b-row v-if="outOfScope">
            <b-col>
                <p class="entity-description"><b>{{ $t('threatmodel.properties.reasonOutOfScope') }}:</b> {{ entity.data.reasonOutOfScope }}</p>
            </b-col>
        </b-row>
        <b-row v-if="entity.data.description || showProperties">
            <b-col>
                <p class="entity-description" v-if="entity.data.description">{{ $t('threatmodel.properties.description') }}: {{ entity.data.description }}</p>
                <p class="entity-description" v-if="showProperties">{{ properties }}</p>
            </b-col>
        </b-row>
        <b-row>
            <b-col md="12">
                <b-table
                    :data-test-id="entity.data.name.replace(' ', '_')"
                    :items="tableData"
                    striped
                    responsive>
                </b-table>
            </b-col>
        </b-row>
    </div>
</template>

<style lang="scss" scoped>
.td-threat-data {
    width: 99%;
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
    name: 'TdReportEntity',
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
        tableData: function () {
            return threatService.filterForDiagram(this.entity.data, {
                showMitigated: this.showMitigated,
                showOutOfScope: this.showOutOfScope
            }).map((threat) => {
                return {
                    [this.$t('threats.properties.number')]: threat.number,
                    [this.$t('threats.properties.title')]: threat.title,
                    [this.$t('threats.properties.type')]: threat.type,
                    [this.$t('threats.properties.severity')]: this.translateSeverity(threat.severity),
                    [this.$t('threats.properties.status')]: this.translateStatus(threat.status),
                    [this.$t('threats.properties.score')]: threat.score,
                    [this.$t('threats.properties.description')]: threat.description,
                    [this.$t('threats.properties.mitigation')]: threat.mitigation

                };
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