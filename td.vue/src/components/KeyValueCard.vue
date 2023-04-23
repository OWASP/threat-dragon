<script>
export default {
  name: 'TdKeyValueCard'
};
</script>
<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  values: {
    type: Array,
    required: true
  }
});
</script>

<template>
  <b-card :header="props.title">
    <b-row class="td-card">
      <b-col
        v-for="(keyvalue, idx) in props.values"
        :key="idx"
        md="2"
      >
        <div>
          <strong>{{ keyvalue.key }}:</strong>
        </div>
        <div>
          {{ keyvalue.value }}
        </div>
      </b-col>
    </b-row>
  </b-card>
</template>

<style lang="scss" scoped>
.td-card {
  font-size: 14px;
}
</style>
