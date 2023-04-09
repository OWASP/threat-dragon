<script>
export default {
  name: 'SelectDemoModel'
};
</script>
<script setup>
import { useThreatModelStore } from '@/stores/threatmodel';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import demo from '@/service/demo/index.js';
import isElectron from 'is-electron';

const models = demo.models;

const threatmodelStore = useThreatModelStore();
const { t } = useI18n();
const router = useRouter();

onMounted(() => {
  threatmodelStore.clearState();
  threatmodelStore.fetchAll();
});

const onModelClick = (model) => {
  threatmodelStore.selected(model.model);
  if (isElectron()) {
    // tell any electron server that the model has changed
    window.electronAPI.modelOpened(model.name);
  }
  const params = Object.assign({}, router.currentRoute.value.params, { threatmodel: model.name });
  router.push({ name: 'localThreatModel' , params });
};
</script>

<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <b-jumbotron class="text-center">
          <h4>
            {{ t('demo.select') }}
          </h4>
        </b-jumbotron>
      </b-col>
    </b-row>
    <b-row>
      <b-col
        md="6"
        offset="3"
      >
        <b-list-group>
          <b-list-group-item
            v-for="(model, idx) in models"
            :key="idx"
            href="javascript:void(0)"
            :data-model-name="model.name"
            @click="onModelClick(model)"
          >
            {{ model.name }}
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
  </b-container>
</template>
