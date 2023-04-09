import { defineStore } from 'pinia';

import { useBranchStore } from '@/stores/branch';
import { useProviderStore } from '@/stores/provider';
import { useRepositoryStore } from '@/stores/repository';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import isElectron from 'is-electron';
import demo from '@/service/demo';
import save from '@/service/save.js';
import threatmodelApi from '@/service/api/threatmodelApi.js';
import { getProviderType } from '@/service/provider/providers';
import { providerTypes } from '@/service/provider/providerTypes';

export const useThreatModelStore = defineStore('threatModelStore', {
  state: () => ({
    all: [],
    data: {},
    fileName: '',
    immutableCopy: {},
    selectedDiagram: {}
  }),
  getters: {
    contributors: (state) => {
      let contributors = [];
      if (state.data && state.data.detail && state.data.detail.contributors) {
        contributors = state.data.detail.contributors;
      }
      return contributors.map(x => x.name);
    },
    modelChanged: (state) => JSON.stringify(state.data) !== state.immutableCopy,
    isV1Model: (state) => Object.keys(state.data).length > 0 && (state.data.version == null || state.data.version.startsWith('1.'))
  },
  actions: {
    clearState() {
      if (isElectron()) {
        // tell any electron server that the model has closed
        window.electronAPI.modelClosed(this.fileName);
      }
      this.$reset();
    },
    setThreatModel(threatModel) {
      this.data = threatModel;
      this.immutableCopy = JSON.stringify(threatModel);
    },
    async create() {
      try {
        if (getProviderType(useProviderStore().selected) !== providerTypes.local) {
          await threatmodelApi.createAsync(
            useBranchStore().selected,
            useRepositoryStore().selected,
            this.data.summary.title,
            this.data
          );
          const toast = useToast();
          const { t } = useI18n();
          toast.success(t('threatmodel.saved') + ' : ' + this.fileName);
        } else if (isElectron()) {
          // desktop version always saves locally
          await window.electronAPI.modelSaved(this.data, this.fileName);
        } else {
          // save locally for web app when local login
          save.local(this.data, `${this.data.summary.title}.json`);
        }
        this.setInmutableCopy();
      } catch (ex) {
        console.error('Failed to update threat model!');
        console.error(ex);
        const toast = useToast();
        const { t } = useI18n();
        toast.error(t('threatmodel.errors.save'));
      }
    },
    diagramSelected(diagram) {
      this.selectedDiagram = diagram;
      console.debug('Threatmodel diagram selected: ' + this.selectedDiagram.id);
    },
    diagramUpdated(diagram) {
      const idx = this.data.detail.diagrams.findIndex(x => x.id === diagram.id);
      this.selectedDiagram = diagram;
      this.data.detail.diagrams[idx] = diagram;
      this.data.version = diagram.version;
      console.debug('Threatmodel diagram updated: ' + diagram.id + ' at index: ' + idx);
      this.setThreatModel(this, this.data);
    },
    async fetch(threatModel) {
      this.clearState();
      const resp = await threatmodelApi.modelAsync(
        useBranchStore().selected,
        useRepositoryStore().selected,
        threatModel
      );
      this.setThreatModel(resp.data);
    },
    async fetchAll() {
      if (getProviderType(useProviderStore().selected) !== providerTypes.local) {
        const resp = await threatmodelApi.modelsAsync(
          useBranchStore().selected,
          useRepositoryStore().selected
        );
        this.all.length = 0;
        resp.data.forEach((model, idx) => this.all[idx] = model);
      } else {
        this.all.length = 0;
        demo.models.forEach((model, idx) => this.all[idx] = model);
      }
    },
    contributorsUpdated(contributors) {
      this.data.detail.contributors.length = 0;
      contributors.forEach((name, idx) => this.data.detail.contributors[idx] = { name });
    },
    async restore() {
      let originalModel = JSON.parse(this.immutableCopy);
      if (getProviderType(useProviderStore().selected) !== providerTypes.local) {
        const originalTitle = (JSON.parse(this.immutableCopy)).summary.title;
        const resp = await threatmodelApi.modelAsync(
          useBranchStore().selected,
          useRepositoryStore().selected,
          originalTitle
        );
        originalModel = resp.data;
      }
      this.setThreatModel(this, originalModel);
    },
    async save() {
      try {
        if (getProviderType(useProviderStore().selected) !== providerTypes.local) {
          await threatmodelApi.updateAsync(
            useBranchStore().selected,
            useRepositoryStore().selected,
            this.data.summary.title,
            this.data
          );
          const toast = useToast();
          const { t } = useI18n();
          toast.success(t('threatmodel.saved') + ' : ' + this.fileName);
        } else if (isElectron()) {
          // desktop version always saves locally
          await window.electronAPI.modelSaved(this.data, this.fileName);
        } else {
          // save locally for web app when local login
          save.local(this.data, `${this.data.summary.title}.json`);
        }
        this.setInmutableCopy();
      } catch (ex) {
        console.error('Failed to update threat model!');
        console.error(ex);
        const toast = useToast();
        const { t } = useI18n();
        toast.error(t('threatmodel.errors.save'));
      }
    },
    selected(threatModel) {
      this.setThreatModel(threatModel);
    },
    setInmutableCopy() {
      this.immutableCopy = JSON.stringify(this.data);
    },
    update(update) {
      if (update.version) {
        this.data.version = update.version;
      }
      if (update.diagramTop) {
        this.data.detail.diagramTop = update.diagramTop;
      }
      if (update.threatTop) {
        this.data.detail.threatTop = update.threatTop;
      }
      if (update.fileName) {
        this.fileName = update.fileName;
      }
    }
  }
});
