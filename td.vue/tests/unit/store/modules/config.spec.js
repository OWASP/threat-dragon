import { configClear, configLoaded, configError, configFetch } from '@/store/actions/config.js';
import { resolveLocale } from '@/store/actions/locale.js';
import configModule from '@/store/modules/config.js';

jest.mock('@/service/api/api', () => ({
    getAsync: jest.fn()
}));

import api from '@/service/api/api';

describe('store/modules/config.js', () => {

    describe('state', () => {
        it('defines a state object', () => {
            expect(configModule.state).toBeInstanceOf(Object);
        });

        it('has config initially null', () => {
            expect(configModule.state.config).toBeNull();
        });

        it('has configError initially null', () => {
            expect(configModule.state.configError).toBeNull();
        });
    });

    describe('mutations', () => {
        describe('CONFIG_CLEAR', () => {
            it('resets config and configError to null', () => {
                const state = { config: { githubEnabled: true }, configError: 'previous error' };
                configModule.mutations[configClear](state);
                expect(state.config).toBeNull();
                expect(state.configError).toBeNull();
            });
        });

        describe('CONFIG_LOADED', () => {
            it('sets sanitized config from payload and clears error', () => {
                const state = { config: null, configError: 'old error' };
                const payload = { config: { githubEnabled: true, defaultLocale: 'es', allowedLocales: ['es', 'en'] } };
                configModule.mutations[configLoaded](state, payload);
                // Recognised provider toggle fields (githubEnabled) are passed through by sanitizeConfig
                expect(state.config).toEqual({ defaultLocale: 'es', allowedLocales: ['es', 'en'], githubEnabled: true });
                expect(state.config.githubEnabled).toEqual(true);
                expect(state.configError).toBeNull();
            });
        });

        describe('CONFIG_ERROR', () => {
            it('sets configError from payload', () => {
                const state = { config: null, configError: null };
                configModule.mutations[configError](state, { error: 'network error' });
                expect(state.configError).toBe('network error');
            });
        });
    });

    describe('actions', () => {
        describe('CONFIG_CLEAR', () => {
            it('commits clear', () => {
                const commit = jest.fn();
                configModule.actions[configClear]({ commit });
                expect(commit).toHaveBeenCalledWith(configClear);
            });
        });

        describe('CONFIG_FETCH', () => {
            let commit;
            let dispatch;
            let context;

            beforeEach(() => {
                jest.clearAllMocks();
                api.getAsync.mockReset();
                commit = jest.fn();
                dispatch = jest.fn();
                const rootState = {
                    locale: { locale: 'en' },
                    config: { config: null }
                };
                context = { commit, dispatch, rootState };
            });

            it('dispatches CONFIG_CLEAR on start', async () => {
                api.getAsync.mockResolvedValue({ data: { githubEnabled: true } });
                await configModule.actions[configFetch](context);
                expect(dispatch).toHaveBeenCalledWith(configClear);
            });

            it('requests config with a five-second timeout', async () => {
                api.getAsync.mockResolvedValue({ data: { githubEnabled: true } });
                await configModule.actions[configFetch](context);
                expect(api.getAsync).toHaveBeenCalledWith('/api/config', { timeout: 5000 });
            });

            it('commits CONFIG_LOADED with config from server "data" wrapper', async () => {
                const configData = { githubEnabled: true, defaultLocale: 'es', allowedLocales: ['es', 'en'] };
                api.getAsync.mockResolvedValue({ data: configData });
                await configModule.actions[configFetch](context);
                expect(commit).toHaveBeenCalledWith(configLoaded, { config: configData });
            });

            it('handles server response without "data" wrapper', async () => {
                const configData = { githubEnabled: true, defaultLocale: 'en', allowedLocales: [] };
                api.getAsync.mockResolvedValue(configData);
                await configModule.actions[configFetch](context);
                // When response has no .data wrapper, response?.data is undefined,
                // so CONFIG_LOADED is called with undefined config.
                // sanitizeConfig rejects it internally setting configError,
                // but the action still commits CONFIG_LOADED, not CONFIG_ERROR.
                expect(commit).toHaveBeenCalledWith(configLoaded, { config: undefined });
            });

            it('logs error and commits CONFIG_ERROR on API failure', async () => {
                const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
                api.getAsync.mockRejectedValue(new Error('network error'));
                await configModule.actions[configFetch](context);
                expect(consoleError).toHaveBeenCalled();
                expect(commit).toHaveBeenCalledWith(configError, { error: 'network error' });
                consoleError.mockRestore();
            });

            it('dispatches locale resolution after loading config', async () => {
                context.rootState.locale.locale = 'fr';
                const configData = { defaultLocale: 'en', allowedLocales: ['de', 'en'] };
                context.rootState.config.config = configData;
                api.getAsync.mockResolvedValue({ data: configData });
                await configModule.actions[configFetch](context);
                expect(dispatch).toHaveBeenCalledWith(resolveLocale, null, { root: true });
            });
        });
    });

    describe('getters', () => {
        describe('allowedLocales', () => {
            it('returns empty array when config is null', () => {
                const state = { config: null };
                expect(configModule.getters.allowedLocales(state)).toEqual([]);
            });

            it('returns empty array when allowedLocales is not an array', () => {
                const state = { config: { allowedLocales: 'en' } };
                expect(configModule.getters.allowedLocales(state)).toEqual([]);
            });

            it('returns empty array when allowedLocales is empty', () => {
                const state = { config: { allowedLocales: [] } };
                expect(configModule.getters.allowedLocales(state)).toEqual([]);
            });

            it('returns allowedLocales array when present', () => {
                const state = { config: { allowedLocales: ['en', 'fr'] } };
                const result = configModule.getters.allowedLocales(state);
                expect(result).toEqual(['en', 'fr']);
            });
        });

        describe('defaultLocale', () => {
            it('returns undefined when config is null', () => {
                const state = { config: null };
                expect(configModule.getters.defaultLocale(state)).toBeUndefined();
            });

            it('returns undefined when defaultLocale is not set', () => {
                const state = { config: { allowedLocales: ['en'] } };
                expect(configModule.getters.defaultLocale(state)).toBeUndefined();
            });

            it('returns defaultLocale when present', () => {
                const state = { config: { defaultLocale: 'de' } };
                expect(configModule.getters.defaultLocale(state)).toBe('de');
            });
        });
    });
});
