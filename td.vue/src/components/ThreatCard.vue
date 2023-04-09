<script>
export default {
  name: 'TdThreatCard'
};
</script>
<script setup>
const props = defineProps({
  id: { type: String },
  status: { type: String },
  severity: { type: String },
  description: { type: String },
  title: { type: String },
  type: { type: String },
  mitigation: { type: String },
  modelType: { type: String },
  number: { type: Number }
});
const threatSelected = () => {
  emits('threat-selected', props.id);
};

const emits = defineEmits(['threat-selected']);
</script>

<template>
  <b-card class="threat-card">
    <b-card-text>
      <b-row>
        <b-col>
          <a
            href="javascript:void(0)"
            @click="threatSelected()"
          >#{{ props.number }} {{ props.title || 'Unknown Threat' }}</a>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          {{ props.type }}
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <font-awesome-icon
            v-if="props.status !== 'Open'"
            icon="check"
            class="threat-icon green-icon"
            :title="props.status"
          />
          <font-awesome-icon
            v-if="props.status === 'Open'"
            icon="exclamation-triangle"
            class="threat-icon red-icon"
            :title="props.status"
          />
          <font-awesome-icon
            v-if="props.severity === 'High'"
            icon="circle"
            class="threat-icon red-icon"
            :title="props.severity"
          />
          <font-awesome-icon
            v-if="props.severity === 'Medium'"
            icon="circle"
            class="threat-icon yellow-icon"
            :title="props.severity"
          />
          <font-awesome-icon
            v-if="props.severity === 'Low'"
            icon="circle"
            class="threat-icon green-icon"
            :title="props.severity"
          />
        </b-col>
        <b-col align-h="end">
          <b-badge :v-if="!!props.modelType">
            {{ props.modelType }}
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

.red-icon {
  color: $red;
}

.yellow-icon {
  color: $yellow;
}
</style>
