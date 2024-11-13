import Vue from 'vue';
import {
    FOLDER_CLEAR,
    FOLDER_FETCH,
    FOLDER_SELECTED,
    FOLDER_NAVIGATE_BACK
} from '../actions/folder.js';
import googleDriveApi from '../../service/api/googleDriveApi.js';

export const clearState = (state) => {
    state.all.length = 0;
    state.selected = 'root';
    state.page = 1;
    state.pageTokens = [''];
    state.pageNext = false;
    state.pagePrev = false;
    state.parentId = '';
};

const state = {
    all: [],
    selected: 'root',
    page: 1,
    pageTokens: [''],
    pageNext: false,
    pagePrev: false,
    parentId: ''
};

const actions = {
    [FOLDER_CLEAR]: ({ commit }) => commit(FOLDER_CLEAR),
    [FOLDER_FETCH]: async ({ commit }, { folderId = '', page = 1 } = {}) => {
        if (!folderId) commit(FOLDER_CLEAR);
        const pageToken = state.pageTokens[page - 1] || '';
        const resp = await googleDriveApi.folderAsync(folderId, pageToken);

        if (resp.data.pagination.nextPageToken && !state.pageTokens[page]) {
            state.pageTokens[page] = resp.data.pagination.nextPageToken;
        }

        commit(FOLDER_FETCH, {
            'folders': resp.data.folders,
            'page': page,
            'pageNext': !!resp.data.pagination.nextPageToken,
            'pagePrev': page > 1,
            'parentId': resp.data.parentId
        });
    },
    [FOLDER_SELECTED]: ({ commit, dispatch }, folder) => {
        commit(FOLDER_SELECTED, folder.id);
        if (folder.mimeType !== 'application/json') {
            dispatch(FOLDER_FETCH, { folderId: folder.id });
        }
    },
    [FOLDER_NAVIGATE_BACK]: ({ commit, dispatch, state }) => {
        commit(FOLDER_SELECTED, state.parentId);
        dispatch(FOLDER_FETCH, { folderId: state.parentId });
    }
};

const mutations = {
    [FOLDER_CLEAR]: (state) => clearState(state),
    [FOLDER_FETCH]: (state, { folders, page, pageNext, pagePrev, parentId, }) => {
        state.all.length = 0;
        folders.forEach((folder, idx) => Vue.set(state.all, idx, folder));
        state.page = page;
        state.pageNext = pageNext;
        state.pagePrev = pagePrev;
        state.parentId = parentId;
    },
    [FOLDER_SELECTED]: (state, folder) => {
        state.selected = folder;
    }
};

const getters = {};

export default {
    state,
    actions,
    mutations,
    getters
};
