<script>
export default {
  name: 'ThreatModel'
};
</script>
<script setup>
import TdFormButton from '@/components/FormButton.vue';
import TdThreatModelSummaryCard from '@/components/ThreatModelSummaryCard.vue';
import { useThreatModelStore } from '@/stores/threatmodel';
import { useProviderStore } from '@/stores/provider';
import { useAppStore } from '@/stores/app';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getProviderType } from '@/service/provider/providers.js';

const threatModelStore = useThreatModelStore();
const providerStore = useProviderStore();
const appStore = useAppStore();

const router = useRouter();
const { t } = useI18n();

const model = computed(() => threatModelStore.data);
const providerType = computed(() => getProviderType(providerStore.selected));
const version = computed(() => appStore.packageBuildVersion);

onMounted(() => {
  // make sure we are compatible with version 1.x and early 2.x
  const threatTop = model.value.detail.threatTop === undefined ? 100 : model.value.detail.threatTop;
  const diagramTop = model.value.detail.diagramTop === undefined ? 10 : model.value.detail.diagramTop;
  const update = { diagramTop: diagramTop, version: version.value, threatTop: threatTop };
  console.debug('updates: ' + JSON.stringify(update));
  threatModelStore.update(update);
});

const onEditClick = (evt) => {
  evt.preventDefault();
  router.push({ name: `${providerType.value}ThreatModelEdit`, params: router.currentRoute.value.params });
};
const onReportClick = (evt) => {
  evt.preventDefault();
  router.push({ name: `${providerType.value}Report`, params: router.currentRoute.value.params });
};
const onCloseClick = (evt) => {
  evt.preventDefault();
  threatModelStore.clearState();
  router.push('/dashboard');
};
const getThumbnailUrl = (diagram) => {
  if (!diagram || !diagram.diagramType) {
    return '/images/thumbnail.jpg';
  }
  return `/images/thumbnail.${diagram.diagramType.toLowerCase()}.jpg`;
};

const editDiagram = (diagram) => {
  threatModelStore.diagramSelected(diagram);
  const path = `${router.currentRoute.value.path}/edit/${encodeURIComponent(diagram.title)}`;
  router.push(path);
};
</script>

<template>
  <div v-if="!!model && model.summary">
    <b-row
      id="title_row"
      class="mb-4"
    >
      <b-col>
        <td-threat-model-summary-card />
      </b-col>
    </b-row>

    <!-- Description -->
    <b-row class="mb-4">
      <b-col>
        <b-card
          :header="t('threatmodel.description')"
        >
          <b-row class="tm-card">
            <b-col>
              <p id="tm_description">
                {{ model.summary.description }}
              </p>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <!-- Diagrams -->
    <b-row class="mb-4">
      <b-col
        v-for="(diagram, idx) in model.detail.diagrams"
        :key="idx"
        class="tm_diagram"
        lg="3"
      >
        <b-card>
          <template #header>
            <h6 class="diagram-header-text">
              <a
                href="javascript:void(0)"
                class="diagram-edit"
                @click="editDiagram(diagram)"
              >
                {{ diagram.title }}
              </a>
            </h6>
          </template>
          <h6
            v-if="diagram.description"
            class="diagram-description-text"
          >
            <a
              href="javascript:void(0)"
              class="diagram-edit"
              @click="editDiagram(diagram)"
            >
              {{ diagram.description }}
            </a>
          </h6>
          <a
            v-else
            href="javascript:void(0)"
            @click="editDiagram(diagram)"
          >
            <b-img-lazy
              class="m-auto d-block td-diagram-thumb"
              :src="getThumbnailUrl(diagram)"
              :alt="diagram.title"
            />
          </a>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="text-right">
        <b-btn-group>
          <td-form-button
            id="td-edit-btn"
            :is-primary="true"
            :on-btn-click="onEditClick"
            icon="edit"
            :text="t('forms.edit')"
          />
          <td-form-button
            id="td-report-btn"
            :on-btn-click="onReportClick"
            icon="file-alt"
            :text="t('forms.report')"
          />
          <td-form-button
            id="td-close-btn"
            :on-btn-click="onCloseClick"
            icon="times"
            :text="t('forms.close')"
          />
        </b-btn-group>
      </b-col>
    </b-row>
  </div>
</template>

<style lang="scss" scoped>
.tm-card {
  font-size: 14px;
  white-space: pre-wrap;
}
.diagram-header-text a {
  color: $black;
}

.diagram-description-text a {
  color: $black;
}

.td-diagram-thumb {
  max-width: 200px;
  max-height: 160px;
}
</style>
