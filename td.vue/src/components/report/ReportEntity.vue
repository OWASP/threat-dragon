<template>
    <div class="td-threat-data">
        <b-row>
            <b-col>
                <h3 class="entity-title">{{ `${entity.data.name} (${dataType})` }}</h3>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <p class="entity-description">{{ entity.data.description }}</p>
            </b-col>
        </b-row>
        <b-row>
            <b-col md="12">
                <b-table
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
        showOutOfScope: {
            type: Boolean,
            default: true
        },
        showMitigated: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        dataType: function () {
            const entityType = this.entity.data.type.replace('tm.', '').replace('td.', '');
            return this.$t(`threatmodel.shapes.${this.toCamelCase(entityType)}`);
        },
        tableData: function () {
            return threatService.filterForDiagram(this.entity.data, {
                showOutOfScope: this.showOutOfScope,
                showMitigated: this.showMitigated
            }).map((threat) => {
                return {
                    [this.$t('threats.properties.title')]: threat.title,
                    [this.$t('threatmodel.properties.outOfScope')]: this.outOfScope ? this.$t('threatmodel.properties.outOfScope') : '',
                    [this.$t('threats.properties.priority')]: threat.severity,
                    [this.$t('threats.properties.status')]: threat.status,
                    [this.$t('threats.properties.description')]: threat.description,
                    [this.$t('threats.properties.mitigation')]: threat.mitigation

                };
            });
        }
    },
    methods: {
        toCamelCase(str) {
            // https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
            return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (ltr, idx) => idx === 0 ? ltr.toLowerCase() : ltr.toUpperCase()).replace(/\s+/g, '');
        }
    }
};

</script>