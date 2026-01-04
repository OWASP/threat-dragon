import { CONFIG_CLEAR, CONFIG_LOADED, CONFIG_ERROR } from '@/store/actions/config.js';
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
                configModule.mutations[CONFIG_CLEAR](state);
                expect(state.config).toBeNull();
                expect(state.configError).toBeNull();
            });
        });

        describe('CONFIG_LOADED', () => {
            it('sets sanitized config from payload and clears error', () => {
                const state = { config: null, configError: 'old error' };
                const payload = { config: { githubEnabled: true, defaultLocale: 'es', allowedLocales: ['es', 'en'] } };
                configModule.mutations[CONFIG_LOADED](state, payload);
                // Recognised provider toggle fields (githubEnabled) are passed through by sanitizeConfig
                expect(state.config).toEqual({ defaultLocale: 'es', allowedLocales: ['es', 'en'], githubEnabled: true });
                expect(state.config.githubEnabled).toEqual(true);
                expect(state.configError).toBeNull();
            });
        });

        describe('CONFIG_ERROR', () => {
            it('sets configError from payload', () => {
                const state = { config: null, configError: null };
                configModule.mutations[CONFIG_ERROR](state, { error: 'network error' });
                expect(state.configError).toBe('network error');
            });
        });
    });

    describe('actions', () => {
        describe('CONFIG_CLEAR', () => {
            it('commits clear', () => {
                const commit = jest.fn();
                configModule.actions[CONFIG_CLEAR]({ commit });
                expect(commit).toHaveBeenCalledWith(CONFIG_CLEAR);
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
                await configModule.actions.CONFIG_FETCH(context);
                expect(dispatch).toHaveBeenCalledWith(CONFIG_CLEAR);
            });

            it('commits CONFIG_LOADED with config from server "data" wrapper', async () => {
                const configData = { githubEnabled: true, defaultLocale: 'es', allowedLocales: ['es', 'en'] };
                api.getAsync.mockResolvedValue({ data: configData });
                await configModule.actions.CONFIG_FETCH(context);
                expect(commit).toHaveBeenCalledWith(CONFIG_LOADED, { config: configData });
            });

            it('handles server response without "data" wrapper', async () => {
                const configData = { githubEnabled: true, defaultLocale: 'en', allowedLocales: [] };
                api.getAsync.mockResolvedValue(configData);
                await configModule.actions.CONFIG_FETCH(context);
                // When response has no .data wrapper, response?.data is undefined,
                // so CONFIG_LOADED is called with undefined config.
                // sanitizeConfig rejects it internally setting configError,
                // but the action still commits CONFIG_LOADED, not CONFIG_ERROR.
                expect(commit).toHaveBeenCalledWith(CONFIG_LOADED, { config: undefined });
            });

            it('logs error and commits CONFIG_ERROR on API failure', async () => {
                const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
                api.getAsync.mockRejectedValue(new Error('network error'));
                await configModule.actions.CONFIG_FETCH(context);
                expect(consoleError).toHaveBeenCalled();
                expect(commit).toHaveBeenCalledWith(CONFIG_ERROR, { error: 'network error' });
                consoleError.mockRestore();
            });

            it('does not dispatch locale actions (re-evaluation moved to store/index.js)', async () => {
                context.rootState.locale.locale = 'fr';
                const configData = { defaultLocale: 'en', allowedLocales: ['de', 'en'] };
                context.rootState.config.config = configData;
                api.getAsync.mockResolvedValue({ data: configData });
                await configModule.actions.CONFIG_FETCH(context);
                expect(dispatch).not.toHaveBeenCalledWith(expect.stringContaining('LOCALE'), expect.any(String));
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
