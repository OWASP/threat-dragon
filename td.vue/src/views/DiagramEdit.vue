<script>
export default {
  name: 'DiagramEdit'
};
</script>
<script setup>
import TdGraph from '@/components/Graph.vue';
</script>

<template>
  <div class="mt-5">
    <b-row>
      <b-col>
        <td-graph />
      </b-col>
    </b-row>
  </div>
</template>
