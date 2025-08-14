import Vue from 'vue';

import googleDriveApi from '@/service/api/googleDriveApi';
import i18n from '@/i18n/index.js';
import threatmodelApi from '@/service/api/threatmodelApi';

const google = async (rootState, state) => {
    try {
        await googleDriveApi.updateAsync(rootState.folder.selected, state.data);
        Vue.$toast.success(i18n.get().t('threatmodel.prompts.saved'));
    } catch (ex) {
        console.error('Failed to save threat model!');
        console.error(ex);
        Vue.$toast.warning(i18n.get().t('threatmodel.warnings.save'));
        return false;
    }
    return true;
};

const googleCreate = async (rootState, state) => {
    let folder;
    try {
        folder = await googleDriveApi.createAsync(rootState.folder.selected, state.data, `${state.data.summary.title}.json`);
        Vue.$toast.success(i18n.get().t('threatmodel.prompts.created'));
    } catch (ex) {
        console.error('Failed to create threat model!');
        console.error(ex);
        Vue.$toast.warning(i18n.get().t('threatmodel.errors.create'));
        return undefined;
    }
    return folder;
};

const local = async (state) => {
    let result = false;
    if ('showSaveFilePicker' in self) {
        result = await writeFile(state.data, `${state.data.summary.title}.json`);
        if ( result ) {
            Vue.$toast.success(i18n.get().t('threatmodel.prompts.saved'));
        } else {
            Vue.$toast.warning(i18n.get().t('threatmodel.warnings.save'));
        }
    } else {
        result = await downloadFile(state.data, `${state.data.summary.title}.json`);
        Vue.$toast.success(i18n.get().t('threatmodel.prompts.downloading'));
    }
    return result;
};

const repo = async (rootState, state) => {
    try {
        await threatmodelApi.updateAsync(
            rootState.repo.selected,
            rootState.branch.selected,
            state.data.summary.title,
            state.data
        );
        Vue.$toast.success(i18n.get().t('threatmodel.prompts.saved'));
    } catch (ex) {
        console.error('Failed to save threat model!');
        console.error(ex);
        Vue.$toast.error(i18n.get().t('threatmodel.warnings.save'));
        return false;
    }
    return true;
};

const repoCreate = async (rootState, state) => {
    try {
        await threatmodelApi.createAsync(
            rootState.repo.selected,
            rootState.branch.selected,
            state.data.summary.title,
            state.data
        );
        Vue.$toast.success(i18n.get().t('threatmodel.prompts.created'));
    } catch (ex) {
        console.error('Failed to create threat model!');
        console.error(ex);
        Vue.$toast.error(i18n.get().t('threatmodel.errors.create'));
        return false;
    }
    return true;
};

async function downloadFile(data, fileName) {
    const contentType = 'application/json';
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: contentType });
    const a = document.createElement('a');
    console.debug('Save using browser local filesystem download');

    a.href = window.URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
    a.remove();
    return true;
}

async function writeFile(data, fileName) {
    const jsonData = JSON.stringify(data, null, 2);
    let fileHandle = null;
    const options = {
        suggestedName: fileName,
        types: [
            {
                description: 'Threat Model',
                accept: {
                    'application/json': ['.json'],
                },
            },
        ],
    };

    try {
        fileHandle = await window.showSaveFilePicker(options);
    } catch (err) {
        console.warn('Save failed, probably user canceled file picker');
        return false;
    }

    if ( await verifyPermission(fileHandle) ) {
        const writable = await fileHandle.createWritable();
        try {
            await writable.write({ type: 'write', position: 0, data: jsonData });
        } catch (err) {
            console.warn('Save failed, could not write to filesystem');
            await writable.close();
            return false;            
        }
        await writable.close();
        console.debug('Save using browser file picker');
    } else {
        console.warn('Save failed, filesystem permissions not granted');
        return false;
    }

    return true;
}

async function verifyPermission(fileHandle) {
    const options = { mode: 'readwrite' };

    // Check if permission was already granted. If so, return true.
    if ((await fileHandle.queryPermission(options)) === 'granted') {
        return true;
    }

    // Request permission. If the user grants permission, return true.
    if ((await fileHandle.requestPermission(options)) === 'granted') {
        return true;
    }

    return false;
}

export default {
    google,
    googleCreate,
    local,
    repo,
    repoCreate
};
