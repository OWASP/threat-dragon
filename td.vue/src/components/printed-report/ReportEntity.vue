<template>
    <div class="report-box">
        <div class="entity-title">
            {{ `${entity.data.name} (${dataType})` }}
        </div>
        <p class="entity-description">{{ entity.data.description }}</p>
        <table class="table">
            <thead>
                <tr>
                    <th>{{ $t('threats.properties.title') }}</th>
                    <th>{{ $t('threatmodel.properties.outOfScope') }}</th>
                    <th>{{ $t('threats.properties.priority') }}</th>
                    <th>{{ $t('threats.properties.status') }}</th>
                    <th>{{ $t('threats.properties.description') }}</th>
                    <th>{{ $t('threats.properties.mitigation') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(threat, idx) in threats"
                    :key="idx"
                >
                    <td>{{ threat.title }}</td>
                    <td>{{ outOfScope ? $t('threatmodel.properties.outOfScope') : '' }}</td>
                    <td>{{ threat.severity }}</td>
                    <td>{{ threat.status }}</td>
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
        threats: function () {
            return threatService.filterForDiagram(this.entity.data, {
                showOutOfScope: this.showOutOfScope,
                showMitigated: this.showMitigated
            });
        },
    },
    methods: {
        toCamelCase(str) {
            // https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
            return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (ltr, idx) => idx === 0 ? ltr.toLowerCase() : ltr.toUpperCase()).replace(/\s+/g, '');
        }
    }
};

</script>