import {
    folderClear,
    folderFetch,
    folderSelected,
    folderNavigateBack
} from '../actions/folder.js';
import googleDriveApi from '../../service/api/googleDriveApi';

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
    [folderClear]: ({ commit }) => commit(folderClear),
    [folderFetch]: async ({ commit }, { folderId = '', page = 1 } = {}) => {
        if (!folderId) commit(folderClear);
        const pageToken = state.pageTokens[page - 1] || '';
        const resp = await googleDriveApi.folderAsync(folderId, pageToken);

        if (resp.data.pagination.nextPageToken && !state.pageTokens[page]) {
            state.pageTokens[page] = resp.data.pagination.nextPageToken;
        }

        commit(folderFetch, {
            folders: resp.data.folders,
            page: page,
            pageNext: !!resp.data.pagination.nextPageToken,
            pagePrev: page > 1,
            parentId: resp.data.parentId
        });
    },
    [folderSelected]: ({ commit, dispatch }, folder) => {
        commit(folderSelected, folder.id);
        if (folder.mimeType !== 'application/json') {
            dispatch(folderFetch, { folderId: folder.id });
        }
    },
    [folderNavigateBack]: ({ commit, dispatch, state }) => {
        commit(folderSelected, state.parentId);
        dispatch(folderFetch, { folderId: state.parentId });
    }
};

const mutations = {
    [folderClear]: (state) => clearState(state),
    [folderFetch]: (state, { folders, page, pageNext, pagePrev, parentId }) => {
        state.all.length = 0;
        folders.forEach((folder, idx) => state.all[idx] = folder);
        state.page = page;
        state.pageNext = pageNext;
        state.pagePrev = pagePrev;
        state.parentId = parentId;
    },
    [folderSelected]: (state, folder) => {
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
