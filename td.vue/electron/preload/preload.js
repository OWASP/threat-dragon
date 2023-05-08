import { useAuthStore } from '@/stores/auth';
import { useProviderStore } from '@/stores/provider';
import { useThreatModelStore } from '@/stores/threatmodel.js';
import { providerNames } from '@/service/provider/providers.js';
import { contextBridge, ipcRenderer } from 'electron';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

if (process.env.IS_TEST === 'true') {
  require('wdio-electron-service/preload');
}

contextBridge.exposeInMainWorld('electronAPI', {
  // renderer to electron main
  updateMenu: (locale) => ipcRenderer.send('update-menu', locale),
  modelClosed: (fileName) => ipcRenderer.send('model-closed', fileName),
  modelOpened: (fileName) => ipcRenderer.send('model-opened', fileName),
  modelPrint: (printer) => ipcRenderer.send('model-print', printer),
  modelSaved: (modelData, fileName) => ipcRenderer.send('model-saved', modelData, fileName),

  // electron main to renderer
  // informing renderer that electron menu shell has closed the model
  onCloseModel: (_event, fileName) =>  {
    console.warn('TODO check that any existing open model has not been modified');
    // getConfirmModal();
    console.debug('Closing model with file name : ' + fileName);
    useThreatModelStore().clearState();
    this.localAuth();
    useRouter().push({ name: 'MainDashboard' }).catch(error => {
      if (error.name !== 'NavigationDuplicated') {
        throw error;
      }
    });
  },

  // request from electron menu shell -> renderer to start a new model
  onNewModel: async (_event, fileName) =>  {
    console.warn('TODO check that any existing open model has not been modified');
    // getConfirmModal();
    console.debug('New model with file name : ' + fileName);
    useThreatModelStore().update({ fileName: fileName });
    this.localAuth();
    await useRouter().push({ name: `${providerNames.local}NewThreatModel` });
  },

  // informing renderer that electron menu shell is providing new model cntents
  onOpenModel: async (_event, fileName, jsonModel) =>  {
    // already checked that any existing open model has not been modified
    console.debug('Open model with file name : ' + fileName);
    let params;
    // this will fail if the threat model does not have a title in the summary
    try {
      params = Object.assign({}, useRouter().currentRoute.value.params, {
        threatmodel: jsonModel.summary.title
      });
    } catch (e) {
      const { t } = useI18n();
      useToast().error(t('threatmodel.errors.invalidJson') + ' : ' + e.message);
      await useRouter().push({ name: 'HomePage' }).catch(error => {
        if (error.name !== 'NavigationDuplicated') {
          throw error;
        }
      });
      return;
    }
    useThreatModelStore().update({ fileName: fileName });
    useThreatModelStore().setSelected(jsonModel);
    this.localAuth();
    await useRouter().push({ name: `${providerNames.local}ThreatModel`, params });
  },

  // request from electron menu shell -> renderer to print the model report
  onPrintModel: (_event, fileName) =>  {
    console.debug('Print report for model with file name : ' + fileName);
    this.localAuth();
    useRouter().push({ name: `${providerNames.local}Report` }).catch(error => {
      if (error.name !== 'NavigationDuplicated') {
        throw error;
      }
    });
  },

  // request from electron menu shell -> renderer to save the model
  onSaveModel: async (_event, fileName) =>  {
    console.debug('Save model for file name : ' + fileName);
    await useThreatModelStore().save();
  },

  localAuth: () => {
    useProviderStore().selected = providerNames.local;
    useAuthStore().setLocal();
  }
});
