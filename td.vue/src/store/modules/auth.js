import { AUTH_CLEAR, AUTH_SET_JWT, AUTH_SET_LOCAL, LOGOUT } from '../actions/auth.js';
import { BRANCH_CLEAR } from '../actions/branch.js';
import loginApi from '../../service/api/loginApi.js';
import { PROVIDER_CLEAR } from '../actions/provider.js';
import providers from '../../service/provider/providers.js';
import { REPOSITORY_CLEAR } from '../actions/repository.js';
import { THREATMODEL_CLEAR } from '../actions/threatmodel.js';
import logger from '@/utils/logger.js';

// Create a context-specific logger
const log = logger.getLogger('store:auth');
export const clearState = (state) => {
    state.jwt = '';
    state.refreshToken = '';
    state.jwtBody = {};
    state.user = {};
    
    // Clear Bitbucket workspace from localStorage
    try {
        localStorage.removeItem('td_bitbucket_workspace');
    } catch (e) {
        // Ignore errors when clearing localStorage
    }
};

export const state = {
    jwt: '',
    refreshToken: '',
    jwtBody: {},
    user: {}
};
const actions = {
    [AUTH_CLEAR]: ({ commit }) => commit(AUTH_CLEAR),
    [AUTH_SET_JWT]: ({ commit }, tokens) => commit(AUTH_SET_JWT, tokens),
    [AUTH_SET_LOCAL]: ({ commit }) => commit(AUTH_SET_LOCAL),
    [LOGOUT]: async ({ dispatch, state, rootState }) => {
        try {
            if (
                rootState.provider.selected !== providers.allProviders.local.key &&
                rootState.provider.selected !== providers.allProviders.desktop.key
            ) {
                await loginApi.logoutAsync(state.refreshToken);
            }
        } catch (e) {
            log.error('Error calling logout api', { error: e });
        }
        dispatch(AUTH_CLEAR);
        dispatch(BRANCH_CLEAR);
        dispatch(PROVIDER_CLEAR);
        dispatch(REPOSITORY_CLEAR);
        dispatch(THREATMODEL_CLEAR);
    }
};
const mutations = {
    [AUTH_CLEAR]: (state) => clearState(state),
    [AUTH_SET_JWT]: (state, tokens) => {
        try {
            log.info('AUTH_SET_JWT mutation called', { tokensPresent: Boolean(tokens) });
            if (!tokens || !tokens.accessToken || !tokens.refreshToken) {
                log.error('Invalid tokens received');
                return;
            }

            const { accessToken, refreshToken } = tokens;
            log.info('Processing tokens', {
                accessTokenPresent: Boolean(accessToken),
                refreshTokenPresent: Boolean(refreshToken)
            });
            const tokenParts = accessToken.split('.');
            log.debug('Token structure', { parts: tokenParts.length });
            const tokenBody = tokenParts[1];
            if (!tokenBody) {
                log.error('Token body missing, malformed JWT');
                return;
            }
            const decodedBody = window.atob(tokenBody);
            log.debug('Decoded token body', { length: decodedBody.length });
            const jwtBody = JSON.parse(decodedBody);
            
            // Add detailed logging to understand the JWT structure
            log.info('JWT structure', {
                hasProvider: Boolean(jwtBody.provider),
                providerKeys: jwtBody.provider ? Object.keys(jwtBody.provider) : [],
                hasUser: Boolean(jwtBody.user),
                userKeys: jwtBody.user ? Object.keys(jwtBody.user) : []
            });
            
            // Determine the provider name from the JWT token
            // The provider can be structured in different ways:
            // 1. { provider: { name: 'bitbucket', ... } }
            // 2. { provider: { bitbucket: '...' } }
            let providerName = null;
            if (jwtBody.provider) {
                if (jwtBody.provider.name) {
                    providerName = jwtBody.provider.name;
                } else {
                    // Check if provider is an object with a provider name as a key
                    const providerKeys = Object.keys(jwtBody.provider);
                    if (providerKeys.includes('bitbucket')) {
                        providerName = 'bitbucket';
                    } else if (providerKeys.includes('github')) {
                        providerName = 'github';
                    } else if (providerKeys.includes('gitlab')) {
                        providerName = 'gitlab';
                    } else if (providerKeys.includes('google')) {
                        providerName = 'google';
                    }
                }
            }
            
            log.info('Detected provider', { providerName });
            
            // If this is a Bitbucket user, ensure the username and actual_username are set
            if (providerName === 'bitbucket' && jwtBody.user) {
                log.info('Bitbucket user detected', {
                    hasUsername: Boolean(jwtBody.user.username),
                    hasActualUsername: Boolean(jwtBody.user.actual_username),
                    userObject: JSON.stringify(jwtBody.user)
                });
                
                // For Bitbucket, the server should have set username to display_name already,
                // but if not, we'll set it here as a fallback
                if (!jwtBody.user.username) {
                    jwtBody.user.username = jwtBody.user.display_name || 'bitbucket-user';
                    log.info('Set username for Bitbucket user', { username: jwtBody.user.username });
                }
                
                // Log the actual username if it exists
                if (jwtBody.user.actual_username) {
                    log.info('Bitbucket actual username found', { actual_username: jwtBody.user.actual_username });
                }
            }
            
            // Log only username, not full user object which might contain sensitive info
            log.info('JWT body parsed', { username: jwtBody.user?.username || 'unknown' });
            state.jwt = accessToken;
            state.jwtBody = jwtBody;
            state.user = jwtBody.user;
            state.refreshToken = refreshToken;
            
            // Store Bitbucket workspace in localStorage if available
            if (providerName === 'bitbucket' && jwtBody.user && jwtBody.user.workspace) {
                try {
                    log.info('Storing Bitbucket workspace in localStorage', { workspace: jwtBody.user.workspace });
                    localStorage.setItem('td_bitbucket_workspace', jwtBody.user.workspace);
                } catch (storageError) {
                    log.error('Error storing Bitbucket workspace in localStorage', { error: storageError.message });
                }
            }
            
            log.info('Auth state updated successfully');
        } catch (e) {
            log.error('Error decoding JWT', { error: e });
            throw e;
        }
    },
    [AUTH_SET_LOCAL]: (state) => {
        state.user = {
            username: 'local-user'
        };
    }
};
const getters = {
    username: (state) => state.user.username || '',
    actualUsername: (state) => state.user.actual_username || state.user.username || ''
};
export default {
    state,
    actions,
    mutations,
    getters
};
