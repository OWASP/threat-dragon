<template>
    <div class="report-box print-only">
        <div class="entity-title">
            {{ `${entity.data.name.replaceAll('\n', ' ')} (${dataType})` }}
            <em v-if="outOfScope">- {{ $t('threatmodel.properties.outOfScope') }}</em>
        </div>
        <div class="entity-description" v-if="outOfScope" >
            <p class="compact"><b>{{ $t('threatmodel.properties.reasonOutOfScope') }}:</b></p>
            <div class="compact" v-html="reasonOutOfScopeMarkdown" v-if="renderMarkdown"></div>
            <p class="plain-text" v-else>{{ reasonOutOfScopePlain }}</p>
        </div>
        <div class="entity-description" v-if="hasDescription" >
            <p class="compact"><b>{{ $t('threatmodel.properties.description') }}:</b></p>
            <div class="compact" v-html="descriptionMarkdown" v-if="renderMarkdown"></div>
            <p class="plain-text" v-else>{{ descriptionPlain }}</p>
        </div>
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
                    <td class="compact" v-html="markdownToHTML(threat.description)" v-if="renderMarkdown"></td>
                    <td class="plain-text" v-else>{{ threat.description }}</td>
                    <td class="compact" v-html="markdownToHTML(threat.mitigation)" v-if="renderMarkdown"></td>
                    <td class="plain-text" v-else>{{ threat.mitigation }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style lang="scss" scoped>
.report-box {
    display: flex;
    flex-direction: column;
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
    name: 'TdPrintReportEntity',
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
        threats: function () {
            return threatService.filterForDiagram(this.entity.data, {
                showMitigated: this.showMitigated,
                showOutOfScope: this.showOutOfScope
            });
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
