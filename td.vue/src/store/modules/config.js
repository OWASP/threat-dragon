import {CONFIG_CLEAR, CONFIG_LOADED} from '@/store/actions/config';
import api from '@/service/api/api';

export const clearState = (state) => {
    state.config = null;
};

const state = {
    config: null,
};

const actions = {
    [CONFIG_CLEAR]: ({ commit }) => commit(CONFIG_CLEAR),

    CONFIG_FETCH: async ( { commit, dispatch }) => {
        dispatch(CONFIG_CLEAR);
        try {
            console.log('FETCHING');
            const response = await api.getAsync('/api/config',);

            commit(CONFIG_LOADED, { config: response.data });
        } catch (error) {
            console.error('Error fetching config:', error);
        }
    },
};

const mutations = {

    [CONFIG_CLEAR]: (state) => clearState(state),

    [CONFIG_LOADED]: (state, { config }) => {
        console.log('LOADED  config');
        state.config = config;
    }
};
const getters = {};

//
// const getters = {
//     config: (state) => state.config,
// };


export default {
    state,
    actions,
    mutations,
    getters
};
