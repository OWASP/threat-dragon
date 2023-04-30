<script>
export default {
  name: 'TdThreatEditDialog'
};
</script>
<script setup>
import { useCellStore } from '@/stores/cell';
import { useThreatModelStore } from '@/stores/threatmodel';
import { computed , ref} from 'vue';
import { useI18n } from 'vue-i18n';
import dataChanged from '@/service/x6/graph/data-changed.js';
import threatModels from '@/service/threats/models/index.js';

const cellStore = useCellStore();
const threatModelStore = useThreatModelStore();

const { t } = useI18n();

const editModal = ref(null);

const cellRef = computed(() => cellStore.ref);
const threatTop = computed(() => threatModelStore.data.detail.threatTop);
const threatTypes = computed(() => {
  if (!threat.value || !threat.value.modelType) {
    return [];
  }

  const res = [];
  const threatTypes = threatModels.getThreatTypesByElement(threat.value.modelType, cellRef.value.data.type);
  Object.keys(threatTypes).forEach((type) => {
    res.push(t(threatTypes[type]));
  }, this);
  return res;
});
const statuses = computed(() => {
  return [
    { value: 'NotApplicable', text: t('threats.status.notApplicable') },
    { value: 'Open', text: t('threats.status.open') },
    { value: 'Mitigated', text: t('threats.status.mitigated') }
  ];
});
const priorities = computed(() => {
  return [
    { value: 'Low', text: t('threats.priority.low') },
    { value: 'Medium', text: t('threats.priority.medium') },
    { value: 'High', text: t('threats.priority.high') }
  ];
});
const modalTitle = computed(() => { return t('threats.edit') + ' #' + number.value; });

let threat = ref({});
// const modelTypes = [
//   'CIA',
//   'LINDDUN',
//   'STRIDE'
// ];
let newThreat = ref(true);
let number = ref(0);

const editThreat = (threatId)  => {
  threat.value = cellRef.value.data.threats.find(x => x.id === threatId);
  if (!threat.value) {
    // this should never happen with a valid threatId
    console.warn('Trying to access a non-existent threatId: ' + threatId);
  } else {
    editModal.value.show();
  }
  newThreat.value = threat.value.new;

  if (threat.value.new === true) {
    // provide a new threat number that is unique project wide
    if (threatTop.value) {
      number.value = threatTop.value + 1;
    } else {
      number.value = 1;
    }
    threatModelStore.update({ threatTop: number.value });
  } else {
    number.value = threat.value.number;
  }
};
const updateThreat = () => {
  if (newThreat.value) {
    threat.value.number = number.value;
    threat.value.new = false;
    newThreat.value = false;
  }

  cellStore.dataUpdated(cellRef.value.data);
  dataChanged.updateStyleAttrs(cellRef.value);

  hideModal();
};
const deleteThreat = () => {
  cellRef.value.data.threats = cellRef.value.data.threats.filter(x => x.id !== threat.value.id);
  cellRef.value.data.hasOpenThreats = cellRef.value.data.threats.length > 0;
  cellStore.dataUpdated(cellRef.value.data);
  dataChanged.updateStyleAttrs(cellRef.value);
  newThreat.value = false;
};
const hideModalClick = () => {
  if (newThreat.value) {
    immediateDelete();
  }
};
const hideModal= () => {
  editModal.value.hide();
};
const confirmDelete = async () => {
  const confirmed = window.confirm(t('threats.confirmDeleteTitle') + '! ' + t('threats.confirmDeleteMessage'));
  // TODO: create temporary modal component
  // const confirmed = await this.$bvModal.msgBoxConfirm(t('threats.confirmDeleteMessage'), {
  //   title: t('threats.confirmDeleteTitle'),
  //   okTitle: t('forms.delete'),
  //   cancelTitle: t('forms.cancel'),
  //   okVariant: 'danger'
  // });

  if (!confirmed) { return; }

  deleteThreat();
  hideModal();
};
const immediateDelete = async () => {
  number.value = number.value - 1;
  threatModelStore.update({ threatTop: number.value });

  deleteThreat();
  hideModal();
};

defineExpose({ editThreat });
</script>

<template>
  <div>
    <b-modal
      v-if="!!threat"
      id="threat-edit"
      ref="editModal"
      size="lg"
      ok-variant="primary"
      header-bg-variant="primary"
      header-text-variant="light"
      :title="modalTitle"
      @hide="hideModalClick"
    >
      <b-form>
        <b-form-row>
          <b-col>
            <b-form-group
              id="title-group"
              :label="t('threats.properties.title')"
              label-for="title"
            >
              <b-form-input
                id="title"
                v-model="threat.title"
                type="text"
                required
              />
            </b-form-group>
          </b-col>
        </b-form-row>

        <b-form-row>
          <b-col>
            <b-form-group
              id="threat-type-group"
              :label="t('threats.properties.type')"
              label-for="threat-type"
            >
              <b-form-select
                id="threat-type"
                v-model="threat.type"
                :options="threatTypes"
              />
            </b-form-group>
          </b-col>
        </b-form-row>

        <b-form-row>
          <b-col md="5">
            <b-form-group
              id="status-group"
              class="float-left"
              :label="t('threats.properties.status')"
              label-for="status"
            >
              <b-form-radio-group
                id="status"
                v-model="threat.status"
                :options="statuses"
                buttons
              />
            </b-form-group>
          </b-col>

          <b-col md="2">
            <b-form-group
              id="score-group"
              :label="t('threats.properties.score')"
              label-for="score"
            >
              <b-form-input
                id="score"
                v-model="threat.score"
                type="text"
              />
            </b-form-group>
          </b-col>

          <b-col md="5">
            <b-form-group
              id="priority-group"
              class="float-right"
              :label="t('threats.properties.priority')"
              label-for="priority"
            >
              <b-form-radio-group
                id="priority"
                v-model="threat.severity"
                :options="priorities"
                buttons
              />
            </b-form-group>
          </b-col>
        </b-form-row>

        <b-form-row>
          <b-col>
            <b-form-group
              id="description-group"
              :label="t('threats.properties.description')"
              label-for="description"
            >
              <b-form-textarea
                id="description"
                v-model="threat.description"
                rows="5"
              />
            </b-form-group>
          </b-col>
        </b-form-row>

        <b-form-row>
          <b-col>
            <b-form-group
              id="mitigation-group"
              :label="t('threats.properties.mitigation')"
              label-for="mitigation"
            >
              <b-form-textarea
                id="mitigation"
                v-model="threat.mitigation"
                rows="5"
              />
            </b-form-group>
          </b-col>
        </b-form-row>
      </b-form>

      <template #modal-footer>
        <div class="w-100">
          <b-button
            v-if="!newThreat"
            variant="danger"
            class="float-left"
            @click="confirmDelete()"
          >
            {{ t('forms.delete') }}
          </b-button>
          <b-button
            v-if="newThreat"
            variant="danger"
            class="float-left"
            @click="immediateDelete()"
          >
            {{ t('forms.remove') }}
          </b-button>
          <b-button
            variant="secondary"
            class="float-right"
            @click="updateThreat()"
          >
            {{ t('forms.apply') }}
          </b-button>
          <b-button
            v-if="!newThreat"
            variant="secondary"
            class="float-right"
            @click="hideModal()"
          >
            {{ t('forms.cancel') }}
          </b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>
