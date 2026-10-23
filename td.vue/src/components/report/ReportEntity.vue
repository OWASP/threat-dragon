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
                <div class="entity-description" >
                    <p class="compact"><b>{{ $t('threatmodel.properties.reasonOutOfScope') }}:</b></p>
                    <div class="compact" v-html="reasonOutOfScopeMarkdown" v-if="renderMarkdown"></div>
                    <p class="plain-text" v-else>{{ reasonOutOfScopePlain }}</p>
                </div>
            </b-col>
        </b-row>
        <b-row v-if="hasDescription || showProperties">
            <b-col>
                <div v-if="hasDescription" class="entity-description">
                    <p class="compact">{{ $t('threatmodel.properties.description') }}:</p>
                    <div class="compact" v-html="descriptionMarkdown" v-if="renderMarkdown"></div>
                    <p class="plain-text" v-else>{{ descriptionPlain }}</p>
                </div>
                <p class="entity-description" v-if="showProperties">{{ properties }}</p>
            </b-col>
        </b-row>
        <b-row v-if="tableData.length > 0">
            <b-col md="12">
                <b-table
                    :data-test-id="entity.data.name.replace(' ', '_')"
                    :items="tableData"
                    :fields="fields"
                    striped
                    responsive>
                    <template #cell(description)="data">
                        <div class="compact" v-html="markdownToHTML(data.value)" v-if="renderMarkdown"></div>
                        <span class="plain-text" v-else>{{ data.value }}</span>
                    </template>
                    <template #cell(mitigation)="data">
                        <div class="compact" v-html="markdownToHTML(data.value)" v-if="renderMarkdown"></div>
                        <span class="plain-text" v-else>{{ data.value }}</span>
                    </template>
                </b-table>
            </b-col>
        </b-row>
    </div>
</template>

<style lang="scss" scoped>
.td-threat-data {
    width: 99%;
}

.entity-title {
    font-size: 24px;
    margin-top: 50px;
    margin-bottom: 15px;
    font-weight: bold;
}

.entity-description {
    padding: 15px;
}

.plain-text {
    white-space: pre-wrap;
}

.compact, .compact :deep(p), .compact :deep(ul) {
    margin-bottom: 0.4rem;
}
</style>

<script>
import { markdownToHTML } from '@/service/formatting-utils.js';
import threatService from '@/service/threats/index.js';
import { translateKnownKey } from '@/service/i18n/translation.js';

export default {
    name: 'TdReportEntity',
    props: {
        entity: Object,
        renderMarkdown: {
            type: Boolean,
            default: true
        },
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
        reasonOutOfScopePlain() {
            return this.entity.data.reasonOutOfScope || '';
        },
        reasonOutOfScopeMarkdown() {
            return markdownToHTML(this.reasonOutOfScopePlain);
        },
        hasDescription() {
            return Boolean(this.entity.data.description);
        },
        descriptionPlain() {
            return this.entity.data.description || '';
        },
        descriptionMarkdown() {
            return markdownToHTML(this.descriptionPlain);
        },
        dataType: function () {
            return translateKnownKey(this.$t, this.entity.data.type);
        },
        tableData: function () {
            return threatService.filterForDiagram(this.entity.data, {
                showMitigated: this.showMitigated,
                showOutOfScope: this.showOutOfScope
            }).map((threat) => {
                return {
                    number: threat.number,
                    title: threat.title,
                    type: threat.type,
                    severity: this.translateSeverity(threat.severity),
                    status: this.translateStatus(threat.status),
                    score: threat.score,
                    description: threat.description,
                    mitigation: threat.mitigation
                };
            });
        },
        fields: function () {
            return [
                { key: 'number', label: this.$t('threats.properties.number') },
                { key: 'title', label: this.$t('threats.properties.title') },
                { key: 'type', label: this.$t('threats.properties.type') },
                { key: 'severity', label: this.$t('threats.properties.severity') },
                { key: 'status', label: this.$t('threats.properties.status') },
                { key: 'score', label: this.$t('threats.properties.score') },
                { key: 'description', label: this.$t('threats.properties.description') },
                { key: 'mitigation', label: this.$t('threats.properties.mitigation') }
            ];
        },
        properties: function () {
            let properties = '';
            if (this.entity.data.bidirection) {
                properties += this.$t('threatmodel.properties.bidirection') + ', ';
            }
            if (this.entity.data.handlesCardPayment) {
                properties += this.$t('threatmodel.properties.handlesCardPayment') + ', ';
            }
            if (this.entity.data.handlesGoodsOrServices) {
                properties += this.$t('threatmodel.properties.handlesGoodsOrServices') + ', ';
            }
            if (this.entity.data.isALog) {
                properties += this.$t('threatmodel.properties.isALog') + ', ';
            }
            if (this.entity.data.isEncrypted) {
                properties += this.$t('threatmodel.properties.isEncrypted') + ', ';
            }
            if (this.entity.data.isSigned) {
                properties += this.$t('threatmodel.properties.isSigned') + ', ';
            }
            if (this.entity.data.isWebApplication) {
                properties += this.$t('threatmodel.properties.isWebApplication') + ', ';
            }
            if (this.entity.data.privilegeLevel) {
                properties += this.$t('threatmodel.properties.privilegeLevel') + ': ' + this.entity.data.privilegeLevel + ', ';
            }
            if (this.entity.data.providesAuthentication) {
                properties += this.$t('threatmodel.properties.providesAuthentication') + ', ';
            }
            if (this.entity.data.protocol) {
                properties += this.$t('threatmodel.properties.protocol') + ' (' + this.entity.data.protocol + '), ';
            }
            if (this.entity.data.publicNetwork) {
                properties += this.$t('threatmodel.properties.publicNetwork') + ', ';
            }
            if (this.entity.data.storesCredentials) {
                properties += this.$t('threatmodel.properties.storesCredentials') + ', ';
            }
            if (this.entity.data.storesInventory) {
                properties += this.$t('threatmodel.properties.storesInventory') + ', ';
            }
            if (properties.length > 2) {
                properties = properties.slice(0, -2);
            }
            return this.$t('threatmodel.properties.title') + ': ' + properties;
        }
    },
    methods: {
        markdownToHTML,
        toCamelCase(str) {
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
                'Mitigated': this.$t('threats.status.mitigated'),
                'Accepted': this.$t('threats.status.accepted'),
                'Transferred': this.$t('threats.status.transferred'),
                'Avoided': this.$t('threats.status.avoided'),
                'Eliminated': this.$t('threats.status.eliminated')
            })[status] ?? 'Unknown';
        }
    }
};

</script>
