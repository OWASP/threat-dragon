import { BRANCH_CLEAR, BRANCH_CREATE, BRANCH_FETCH, BRANCH_SELECTED } from '../actions/branch.js';
import threatmodelApi from '../../service/api/threatmodelApi.js';

export const clearState = (state) => {
    state.all.length = 0;
    state.selected = '';
    state.page = 1;
    state.pageNext = false;
    state.pagePrev = false;
};

const state = {
    all: [],
    selected: '',
    page: 1,
    pageNext: false,
    pagePrev: false
};

const actions = {
    [BRANCH_CLEAR]: ({ commit }) => commit(BRANCH_CLEAR),
    [BRANCH_FETCH]: async ({ commit, dispatch, rootState }, page = 1) => {
        // Import logger dynamically to avoid circular dependencies
        const logger = await import('@/utils/logger.js');
        const log = logger.default.getLogger('store:modules:branch');
        
        log.debug('BRANCH_FETCH action called', {
            page,
            selectedRepo: rootState.repo.selected
        });
        
        dispatch(BRANCH_CLEAR);
        
        try {
            log.debug('Calling branchesAsync', {
                repository: rootState.repo.selected,
                page
            });
            
            const resp = await threatmodelApi.branchesAsync(rootState.repo.selected, page);
            
            log.debug('branchesAsync response received', {
                branchCount: resp.data?.branches?.length || 0,
                pagination: resp.data?.pagination
            });
            
            commit(BRANCH_FETCH, {
                branches: resp.data.branches,
                page: resp.data.pagination.page,
                pageNext: resp.data.pagination.next,
                pagePrev: resp.data.pagination.prev
            });
        } catch (error) {
            log.error('Error fetching branches', {
                error: error.message,
                stack: error.stack,
                repository: rootState.repo.selected
            });
            
            // Re-throw the error to allow proper error handling
            throw error;
        }
    },
    [BRANCH_SELECTED]: ({ commit }, branch) => commit(BRANCH_SELECTED, branch),
    [BRANCH_CREATE]: async ({ dispatch, rootState }, { branchName, refBranch }) => {
        await threatmodelApi.createBranchAsync(rootState.repo.selected, branchName, refBranch);
        await dispatch(BRANCH_FETCH);
    }
};

const mutations = {
    [BRANCH_CLEAR]: (state) => clearState(state),
    [BRANCH_FETCH]: (state, { branches, page, pageNext, pagePrev }) => {
        // Replace Vue.set with direct assignment (Vue 3 reactivity)
        state.all = [...branches];
        state.page = page;
        state.pageNext = pageNext;
        state.pagePrev = pagePrev;
    },
    [BRANCH_SELECTED]: (state, repo) => {
        state.selected = repo;
    }
};

const getters = {};

export default {
    state,
    actions,
    mutations,
    getters
};
