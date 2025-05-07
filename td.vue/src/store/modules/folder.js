import {
    FOLDER_CLEAR,
    FOLDER_FETCH,
    FOLDER_SELECTED,
    FOLDER_NAVIGATE_BACK
} from '../actions/folder.js';
import googleDriveApi from '../../service/api/googleDriveApi.js';
import logger from '../../utils/logger.js';

// Create a logger instance for this module
const log = logger.getLogger('store:folder');

export const clearState = (state) => {
    state.all = [];
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
    async [FOLDER_FETCH]({ commit, state }, { folderId = '', page = 1 } = {}) {
        if (!folderId) commit(FOLDER_CLEAR);
        try {
            const pageToken = state.pageTokens[page - 1] || '';
            // Using the updated googleDriveApi that doesn't require an access token parameter
            const resp = await googleDriveApi.folderAsync(folderId, pageToken);
            if (!resp.data || !Array.isArray(resp.data.folders)) {
                log.error('Invalid folder data:', { data: resp.data });
                return;
            }

            if (resp.data.pagination.nextPageToken && !state.pageTokens[page]) {
                state.pageTokens[page] = resp.data.pagination.nextPageToken;
            }

            commit(FOLDER_FETCH, {
                folders: resp.data.folders,
                page,
                pageNext: !!resp.data.pagination.nextPageToken,
                pagePrev: page > 1,
                parentId: resp.data.parentId
            });
        } catch (error) {
            log.error('Error fetching folders:', { error });
        }
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
    [FOLDER_FETCH]: (state, { folders, page, pageNext, pagePrev, parentId }) => {
        state.all = [...folders];
        state.page = page;
        state.pageNext = pageNext;
        state.pagePrev = pagePrev;
        state.parentId = parentId;
    },
    [FOLDER_SELECTED]: (state, folderId) => {
        state.selected = folderId;
    }
};

export default {
    namespaced: true,
    state,
    actions,
    mutations
};
