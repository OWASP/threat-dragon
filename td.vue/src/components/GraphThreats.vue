<template>
<b-card class="threat-card">
    <b-card-text>
        <b-row>
            <b-col>
                <a
                    href="javascript:void(0)"
                    @click="threatSelected()"
                    v-if="!!numberResolved"
                >
                    #{{ numberResolved }} {{ titleResolved || 'Unknown Threat' }}
                </a>
                <a
                    href="javascript:void(0)"
                    @click="threatSelected()"
                    v-else
                >
                    {{ titleResolved || 'Unknown Threat' }}
                </a>
            </b-col>
        </b-row>

        <b-row v-if="modelTypeResolved !== 'EOP' && typeResolved">
            <b-col>{{ typeResolved }}</b-col>
        </b-row>

        <b-row v-if="modelTypeResolved === 'EOP' && (cardSuitResolved || cardNumberResolved)">
            <b-col>
                <b-row v-if="cardSuitResolved">
                    <b-col>{{ cardSuitResolved }}</b-col>
                </b-row>
                <b-row v-if="cardNumberResolved">
                    <b-col>{{ cardNumberResolved }}</b-col>
                </b-row>
            </b-col>
        </b-row>

        <b-row>
            <b-col>
                <font-awesome-icon
                    v-if="statusResolved === 'NotApplicable'"
                    icon="check"
                    class="threat-icon gray-icon"
                    :title="statusResolved"
                />
                <font-awesome-icon
                    v-if="statusResolved === 'Mitigated'"
                    icon="check"
                    class="threat-icon green-icon"
                    :title="statusResolved"
                />
                <font-awesome-icon
                    v-if="statusResolved === 'Open'"
                    icon="exclamation-triangle"
                    class="threat-icon red-icon"
                    :title="statusResolved"
                />

                <font-awesome-icon
                    v-if="severityResolved === 'Critical'"
                    icon="circle"
                    class="threat-icon darkred-icon"
                    :title="severityResolved"
                />
                <font-awesome-icon
                    v-if="severityResolved === 'High'"
                    icon="circle"
                    class="threat-icon red-icon"
                    :title="severityResolved"
                />
                <font-awesome-icon
                    v-if="severityResolved === 'Medium'"
                    icon="circle"
                    class="threat-icon orange-icon"
                    :title="severityResolved"
                />
                <font-awesome-icon
                    v-if="severityResolved === 'Low'"
                    icon="circle"
                    class="threat-icon yellow-icon"
                    :title="severityResolved"
                />
                <font-awesome-icon
                    v-if="severityResolved === 'TBD'"
                    icon="circle"
                    class="threat-icon gray-icon"
                    :title="severityResolved"
                />
            </b-col>

            <b-col align-h="end">
                <b-badge v-if="modelTypeResolved">
                    {{ modelTypeResolved }}
                </b-badge>
            </b-col>
        </b-row>
    </b-card-text>
</b-card>
</template>


<style lang="scss" scoped>
.threat-card {
    font-size: 14px;
}

.threat-title {
    margin-bottom: 5px;
}

.threat-icon {
    margin: 2px;
}

.green-icon {
    color: $green;
}

.darkred-icon {
    color: $firebrick;
}

.red-icon {
    color: $red;
}

.orange-icon {
    color: $darkorange;
}

.yellow-icon {
    color: $yellow;
}

.gray-icon {
    color: $gray;
}
</style>

<script>
export default {
    name: 'TdGraphThreats',

    props: {
        threat: {
            type: Object,
            required: false,
            default: null
        },
        id: { type: String },
        status: { type: String },
        severity: { type: String },
        description: { type: String },
        title: { type: String },
        type: { type: String },
        mitigation: { type: String },
        modelType: { type: String },
        number: { type: Number },
        cardSuit: { type: String },
        cardNumber: { type: String }
    },

    computed: {
        threatData() {
            const t = this.threat || {};
            return {
                id: t.id || this.id || '',
                status: t.status || this.status || '',
                severity: t.severity || this.severity || '',
                description: t.description || this.description || '',
                title: t.title || this.title || '',
                type: t.type || this.type || '',
                mitigation: t.mitigation || this.mitigation || '',
                modelType: t.modelType || this.modelType || '',
                number: t.number || this.number || null,
                cardSuit: t.cardSuit || this.cardSuit || '',
                cardNumber: t.cardNumber || this.cardNumber || ''
            };
        },

        idResolved() { return this.threatData.id; },
        statusResolved() { return this.threatData.status; },
        severityResolved() { return this.threatData.severity; },
        descriptionResolved() { return this.threatData.description; },
        titleResolved() { return this.threatData.title; },
        typeResolved() { return this.threatData.type; },
        mitigationResolved() { return this.threatData.mitigation; },
        modelTypeResolved() { return this.threatData.modelType; },
        numberResolved() { return this.threatData.number; },
        cardSuitResolved() { return this.threatData.cardSuit; },
        cardNumberResolved() { return this.threatData.cardNumber; }
    },

    methods: {
        threatSelected() {
            this.$emit('threatSelected', this.idResolved, 'old');
        }
    }
};
</script>