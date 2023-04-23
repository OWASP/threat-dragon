<script>
export default {
  name: 'ThreatModelEdit'
};
</script>
<script setup>
import TdFormButton from '@/components/FormButton.vue';
import { useThreatModelStore } from '@/stores/threatmodel';
import { useProviderStore } from '@/stores/provider';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { getProviderType } from '@/service/provider/providers.js';

const threatModelStore = useThreatModelStore();
const providerStore = useProviderStore();

const router = useRouter();
const { t } = useI18n();
// eslint-disable-next-line no-undef
const version = __APP_VERSION__;

// const fileHandle = computed(() => threatModelStore.fileHandle);
// const fileName = computed(() => threatModelStore.fileName);
const model = computed(() => threatModelStore.data);
const providerType = computed(() => getProviderType(providerStore.selected));
const diagramTop = computed(() => threatModelStore.data.detail.diagramTop);
const contributors = computed({
  get() {
    return threatModelStore.contributors;
  },
  set(contributors) {
    if (typeof contributors === 'object' && contributors !== null) {
      threatModelStore.contributorsUpdated(contributors);
    }
  }
});

const onSubmit = (event) => {
  onSaveClick(event);
};
const onSaveClick = async (event) => {
  event.preventDefault();
  if (router.currentRoute.value.name === 'gitThreatModelCreate') {
    await threatModelStore.create();
  } else {
    await threatModelStore.save();
  }
  await router.push({ name: `${providerType.value}ThreatModel`, params: router.currentRoute.value.params });
};
const onReloadClick = async (event) => {
  event.preventDefault();
  await restoreAsync();
};
const onCancelClick = async (event) => {
  event.preventDefault();
  if (await restoreAsync()) {
    await router.push({ name: `${providerType.value}ThreatModel`, params: router.currentRoute.value.params });
  }
};
const onAddDiagramClick = (event) => {
  event.preventDefault();
  let newDiagram = {
    id: diagramTop.value,
    title: t('threatmodel.diagram.stride.defaultTitle'),
    diagramType: 'STRIDE',
    placeholder: t('threatmodel.diagram.stride.defaultDescription'),
    thumbnail: '/images/thumbnail.stride.jpg',
    version: version.value
  };
  threatModelStore.update({ diagramTop: diagramTop.value + 1 });
  model.value.detail.diagrams.push(newDiagram);
};
const onDiagramTypeClick = (idx, type) => {
  let defaultTitle;
  let placeholder;
  let thumbnail;
  switch (type) {
  case 'CIA':
    thumbnail = '/images/thumbnail.cia.jpg';
    defaultTitle = t('threatmodel.diagram.cia.defaultTitle');
    placeholder = t('threatmodel.diagram.cia.defaultDescription');
    break;
  case 'LINDDUN':
    thumbnail = '/images/thumbnail.linddun.jpg';
    defaultTitle = t('threatmodel.diagram.linddun.defaultTitle');
    placeholder = t('threatmodel.diagram.linddun.defaultDescription');
    break;
  case 'STRIDE':
    thumbnail = '/images/thumbnail.stride.jpg';
    defaultTitle = t('threatmodel.diagram.stride.defaultTitle');
    placeholder = t('threatmodel.diagram.stride.defaultDescription');
    break;
  default:
    thumbnail = '/images/thumbnail.jpg';
    defaultTitle = t('threatmodel.diagram.generic.defaultTitle');
    placeholder = t('threatmodel.diagram.generic.defaultDescription');
    type = t('threatmodel.diagram.generic.select');
  }
  model.value.detail.diagrams[idx].diagramType = type;
  model.value.detail.diagrams[idx].placeholder = placeholder;
  model.value.detail.diagrams[idx].thumbnail = thumbnail;
  // if the diagram title is still default, then change it to the new default title
  if (model.value.detail.diagrams[idx].title === t('threatmodel.diagram.cia.defaultTitle')
        || model.value.detail.diagrams[idx].title === t('threatmodel.diagram.linddun.defaultTitle')
        || model.value.detail.diagrams[idx].title === t('threatmodel.diagram.stride.defaultTitle')
        || model.value.detail.diagrams[idx].title === t('threatmodel.diagram.generic.defaultTitle')
  ) {
    model.value.detail.diagrams[idx].title = defaultTitle;
  }
};
const onRemoveDiagramClick = (idx) => {
  model.value.detail.diagrams.splice(idx, 1);
};
const restoreAsync = async () => {
  if (!threatModelStore.modelChanged || await getConfirmModal()) {
    await threatModelStore.restore();
    return true;
  }
  return false;
};
const getConfirmModal = async () => {
  return window.confirm(t('forms.discardTitle') + '! ' + t('forms.discardMessage'));
  // TODO: create temporary modal component
  // return this.$bvModal.msgBoxConfirm(t('forms.discardMessage'), {
  //   title: t('forms.discardTitle'),
  //   okVariant: 'danger',
  //   okTitle: t('forms.ok'),
  //   cancelTitle: t('forms.cancel'),
  //   hideHeaderClose: true,
  //   centered: true
  // });
};
</script>

<template>
  <b-row>
    <b-col v-if="model && model.summary">
      <b-card
        id="parent-card"
        :header="`${t('threatmodel.editing')}: ${model.summary.title}`"
      >
        <b-form @submit="onSubmit">
          <b-form-row>
            <b-col>
              <b-form-group
                id="title-group"
                :label="t('threatmodel.title')"
                label-for="title"
              >
                <b-form-input
                  id="title"
                  v-model="model.summary.title"
                  type="text"
                  required
                />
              </b-form-group>
            </b-col>
          </b-form-row>

          <b-form-row>
            <b-col md="6">
              <b-form-group
                id="owner-group"
                :label="t('threatmodel.owner')"
                label-for="owner"
              >
                <b-form-input
                  id="owner"
                  v-model="model.summary.owner"
                  type="text"
                />
              </b-form-group>
            </b-col>

            <b-col md="6">
              <b-form-group
                id="reviewer-group"
                :label="t('threatmodel.reviewer')"
                label-for="reviewer"
              >
                <b-form-input
                  id="reviewer"
                  v-model="model.detail.reviewer"
                  type="text"
                />
              </b-form-group>
            </b-col>
          </b-form-row>

          <b-form-row>
            <b-col>
              <b-form-group
                id="description-group"
                :label="t('threatmodel.description')"
                label-for="description"
              >
                <b-form-textarea
                  id="description"
                  v-model="model.summary.description"
                  type="text"
                />
              </b-form-group>
            </b-col>
          </b-form-row>

          <b-form-row>
            <b-col>
              <b-form-group
                id="contributors-group"
                :label="t('threatmodel.contributors')"
                label-for="contributors"
              >
                <b-form-tags
                  id="contributors"
                  v-model="contributors"
                  separator=" ,;"
                  :placeholder="t('threatmodel.contributorsPlaceholder')"
                  variant="primary"
                />
              </b-form-group>
            </b-col>
          </b-form-row>

          <b-form-row>
            <b-col>
              <h5>{{ t('threatmodel.diagram.diagrams') }}</h5>
            </b-col>
          </b-form-row>

          <b-form-row>
            <b-col
              v-for="(diagram, idx) in model.detail.diagrams"
              :key="idx"
              md="6"
            >
              <b-input-group
                :id="`diagram-group-${idx}`"
                :label-for="`diagram-${idx}`"
                class="mb-3"
              >
                <b-input-group-prepend>
                  <b-dropdown
                    split
                    variant="secondary"
                    class="select-diagram-type"
                    :text="model.detail.diagrams[idx].diagramType"
                  >
                    <b-dropdown-item-button @click="onDiagramTypeClick(idx, 'CIA')">
                      {{ t('threatmodel.diagram.cia.select') }}
                    </b-dropdown-item-button>
                    <b-dropdown-item-button @click="onDiagramTypeClick(idx, 'LINDDUN')">
                      {{ t('threatmodel.diagram.linddun.select') }}
                    </b-dropdown-item-button>
                    <b-dropdown-item-button @click="onDiagramTypeClick(idx, 'STRIDE')">
                      {{ t('threatmodel.diagram.stride.select') }}
                    </b-dropdown-item-button>
                    <b-dropdown-item-button @click="onDiagramTypeClick(idx, 'Generic')">
                      {{ t('threatmodel.diagram.generic.select') }}
                    </b-dropdown-item-button>
                  </b-dropdown>
                </b-input-group-prepend>
                <b-form-input
                  v-model="model.detail.diagrams[idx].title"
                  type="text"
                  class="td-diagram"
                />
                <b-form-input
                  v-model="model.detail.diagrams[idx].description"
                  :placeholder="model.detail.diagrams[idx].placeholder"
                  type="text"
                  class="td-diagram-description"
                />
                <b-input-group-append>
                  <b-button
                    variant="secondary"
                    class="td-remove-diagram"
                    @click="onRemoveDiagramClick(idx)"
                  >
                    <font-awesome-icon icon="times" />
                    {{ t('forms.remove') }}
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-col>

            <b-col md="6">
              <a
                href="javascript:void(0)"
                class="add-diagram-link m-2"
                @click="onAddDiagramClick"
              >
                <font-awesome-icon icon="plus" />
                {{ t('threatmodel.diagram.addNewDiagram') }}
              </a>
            </b-col>
          </b-form-row>

          <b-form-row>
            <b-col class="text-right mt-5">
              <b-btn-group>
                <td-form-button
                  id="td-save-btn"
                  :is-primary="true"
                  :on-btn-click="onSaveClick"
                  icon="save"
                  :text="t('forms.save')"
                />
                <td-form-button
                  id="td-reload-btn"
                  :on-btn-click="onReloadClick"
                  icon="undo"
                  :text="t('forms.reload')"
                />
                <td-form-button
                  id="td-cancel-btn"
                  :on-btn-click="onCancelClick"
                  icon="times"
                  :text="t('forms.cancel')"
                />
              </b-btn-group>
            </b-col>
          </b-form-row>
        </b-form>
      </b-card>
    </b-col>
  </b-row>
</template>

<style lang="scss" scoped>
@import '@/scss/bootstrap.scss';

.add-diagram-link {
  color: $orange;
  font-size: 14px;
}

.remove-diagram-btn {
  font-size: 12px;
}

.select-diagram-type {
  font-size: 12px;
}
</style>
