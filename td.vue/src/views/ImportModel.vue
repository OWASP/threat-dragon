<script>
export default {
  name: 'ImportModel'
};
</script>
<script setup>
import TdFormButton from '@/components/FormButton.vue';
import { useProviderStore } from '@/stores/provider';
import { useThreatModelStore } from '@/stores/threatmodel';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import isElectron from 'is-electron';
import { getProviderType } from '@/service/provider/providers.js';

// only search for text files
const pickerFileOptions = {
  types: [
    { description: 'Threat models', accept: { 'text/*': ['.json'] } }
  ],
  multiple: false
};

const providerStore = useProviderStore();
const threatModelStore = useThreatModelStore();
const router = useRouter();
const toast = useToast();
const { t } = useI18n();

const providerType = computed(() => getProviderType(providerStore.selected));
const prompt = computed(() => { return '{ ' + t('threatmodel.dragAndDrop') + t('threatmodel.jsonPaste') + ' ... }'; });
let tmJson = '';

const onDropFile = (event) => {
  if (event.dataTransfer.files.length === 1) {
    let file = event.dataTransfer.files[0];
    if (file.name.endsWith('.json')) {
      file.text().then(text => {
        tmJson = text;
        threatModelStore.update({ fileName: file.name });
        onImportClick(file.name);
      }).catch(e => toast.error(e));
    } else {
      toast.error(t('threatmodel.errors.onlyJsonAllowed'));
    }
  } else {
    toast.error(t('threatmodel.errors.dropSingleFileOnly'));
  }
};
const onOpenClick = async () => {
  if ('showOpenFilePicker' in window) {
    // Chrome and Edge browsers return an array of file handles
    try {
      const [handle] = await window.showOpenFilePicker(pickerFileOptions);
      let file = await handle.getFile();
      if (file.name.endsWith('.json')) {
        tmJson = await file.text();
        threatModelStore.update({ fileName: file.name });
        onImportClick(file.name);
      } else {
        toast.error(t('threatmodel.errors.onlyJsonAllowed'));
      }
    } catch (e) {
      // any error is most likely due to the picker being cancelled, which is benign so just warn
      toast.warning(t('threatmodel.errors.open'));
      console.warn(e);
    }
  } else {
    toast.error('File picker is not yet supported on this browser: use Paste or Drag and Drop');
  }
};
const onImportClick = (fileName) => {
  let jsonModel;
  // check for JSON syntax errors, schema errors come later
  try {
    jsonModel = JSON.parse(tmJson);
  } catch (e) {
    toast.error(t('threatmodel.errors.invalidJson'));
    console.error(e);
    return;
  }

  // ToDo: need to catch invalid threat model schemas, possibly using npmjs.com/package/ajv

  if (isElectron()) {
    // tell the desktop server that the model has changed
    window.electronAPI.modelOpened(fileName);
  }

  // save the threat model in the stores
  threatModelStore.setSelected(jsonModel);

  let params;
  // this will fail if the threat model does not have a title in the summary
  try {
    params = Object.assign({}, router.currentRoute.value.params, {
      threatmodel: jsonModel.summary.title
    });
  } catch (e) {
    toast.error(t('threatmodel.errors.invalidJson') + ' : ' + e.message);
    console.error(e);
    return;
  }

  router.push({ name: `${providerType.value}ThreatModel`, params });
};
</script>

<template>
  <div>
    <b-row>
      <b-col>
        <b-jumbotron class="text-center">
          <h4>
            {{ t('forms.open') }} / {{ t('dashboard.actions.importExisting') }}
          </h4>
        </b-jumbotron>
      </b-col>
    </b-row>
    <b-row>
      <b-col
        md="8"
        offset="2"
      >
        <b-form>
          <b-form-row>
            <b-col
              @drop.prevent="onDropFile"
              @dragenter.prevent
              @dragover.prevent
            >
              <b-form-group
                id="json-input-group"
                label-for="json-input"
              >
                <b-form-textarea
                  id="json-input"
                  v-model="tmJson"
                  :placeholder="prompt"
                  rows="16"
                />
              </b-form-group>
            </b-col>
          </b-form-row>
        </b-form>
      </b-col>
    </b-row>
    <b-row>
      <b-col
        md="4"
        offset="2"
        class="text-left"
      >
        <b-btn-group>
          <td-form-button
            id="td-open-btn"
            :on-btn-click="onOpenClick"
            icon="folder-open"
            :text="t('forms.open')"
          />
        </b-btn-group>
      </b-col>
      <b-col
        md="4"
        class="text-right"
      >
        <b-btn-group>
          <td-form-button
            id="td-import-btn"
            :is-primary="true"
            :on-btn-click="onImportClick"
            icon="file-import"
            :text="t('forms.import')"
          />
        </b-btn-group>
      </b-col>
    </b-row>
  </div>
</template>
