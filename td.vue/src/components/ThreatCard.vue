<template>
<b-card class="threat-card">
        <b-card-text>
            <div class="mb-2">
                <a href="javascript:void(0)">{{ title }}</a>
            </div>
            <div>
                {{ type }}
            </div>
            <div>
                <font-awesome-icon 
                    icon="check"
                    class="threat-icon green-icon"
                    :title="status"
                    v-if="status !== 'Open'" />
                <font-awesome-icon 
                    icon="exclamation-triangle"
                    class="threat-icon red-icon"
                    :title="status"
                    v-if="status === 'Open'" />
                <font-awesome-icon 
                    icon="circle"
                    class="threat-icon red-icon"
                    :title="severity"
                    v-if="severity === 'High'" />
                <font-awesome-icon 
                    icon="circle"
                    class="threat-icon yellow-icon"
                    :title="severity"
                    v-if="severity === 'Medium'" />
                <font-awesome-icon 
                    icon="circle"
                    class="threat-icon green-icon"
                    :title="severity"
                    v-if="severity === 'Low'" />
            </div>
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

.red-icon {
    color: $red;
}

.yellow-icon {
    color: $yellow;
}

</style>

<script>
export default {
    name: 'TdThreatCard',
    props: {
        status: { type: String },
        severity: { type: String },
        description: { type: String },
        title: { type: String },
        type: { type: String },
        mitigation: { type: String }
    }
};

</script>