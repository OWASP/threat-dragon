import { configClear, configLoaded, configError, configFetch } from '@/store/actions/config';
import { resolveLocale } from '@/store/actions/locale';
import configModule from '@/store/modules/config';

jest.mock('@/service/api/api', () => ({
    getAsync: jest.fn()
}));

jest.mock('@/service/analytics.js', () => ({
    configure: jest.fn(),
    disable: jest.fn()
}));

import api from '@/service/api/api';
import analytics from '@/service/analytics.js';

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
        describe('clear', () => {
            it('resets config and configError to null', () => {
                const state = { config: { githubEnabled: true }, configError: 'previous error' };
                configModule.mutations[configClear](state);
                expect(state.config).toBeNull();
                expect(state.configError).toBeNull();
            });
        });

        describe('loaded', () => {
            const state = { config: null, configError: 'foo' };

            it('sets sanitized config and clears error', () => {
                const config = {
                    githubEnabled: true,
                    defaultLocale: 'es',
                    allowedLocales: ['es', 'en']
                };
                configModule.mutations[configLoaded](state, {config: config});
                expect(state.config).toEqual(config);
                expect(state.config.githubEnabled).toEqual(true);
                expect(state.configError).toBeNull();
            });

            it('sets sanitized config with no locales', () => {
                const config = {
                    bitbucketEnabled: false,
                    gitlabEnabled: false,
                    googleEnabled: false,
                    localEnabled: true
                };
                configModule.mutations[configLoaded](state, {config: config});
                expect(state.config).toEqual(config);
                expect(state.config.localEnabled).toEqual(true);
                expect(state.configError).toBeNull();
            });

            it('drops an allowed locale list with no supported values', () => {
                const state = { config: null, configError: null };
                configModule.mutations[configLoaded](state, {
                    config: { localEnabled: true, allowedLocales: ['xx'] }
                });
                expect(state.config).toEqual({ localEnabled: true });
            });

            it('retains all boolean provider settings', () => {
                const state = { config: null, configError: null };
                configModule.mutations[configLoaded](state, {
                    config: {
                        localEnabled: true,
                        bitbucketEnabled: true,
                        gitlabEnabled: false,
                        googleEnabled: true
                    }
                });
                expect(state.config).toEqual({
                    localEnabled: true,
                    bitbucketEnabled: true,
                    gitlabEnabled: false,
                    googleEnabled: true
                });
            });

            it('rejects empty config and sets error', () => {
                const config = {
                    defaultLocale: 'foobar',
                    allowedLocales: ['foo', 'bar']
                };
                configModule.mutations[configLoaded](state, {config: config});
                expect(state.config).toBeNull();
                expect(state.configError).toContain('rejected');
            });

            it('rejects unrecognized locales and sets error', () => {
                configModule.mutations[configLoaded](state, { config: {} });
                expect(state.config).toBeNull();
                expect(state.configError).toContain('rejected');
            });

            it('rejects unsanitized config and sets error', () => {
                const payload = { config: null};
                configModule.mutations[configLoaded](state, payload);
                // Recognised provider toggle fields (githubEnabled) are passed through by sanitizeConfig
                expect(state.config).toBeNull();
                expect(state.configError).toContain('rejected');
            });
        });

        it('retains complete analytics configuration', () => {
            const state = { config: null, configError: null };
            const analyticsConfig = {
                enabled: true,
                dashboardUrl: 'https://plausible.test/share/threatdragon',
                eventNames: ['PAGE_VIEW_HOME']
            };
            configModule.mutations[configLoaded](state, { config: { analytics: analyticsConfig } });
            expect(state.config.analytics).toEqual(analyticsConfig);
        });

        it('retains an explicitly disabled analytics configuration', () => {
            const state = { config: null, configError: null };
            const analyticsConfig = { enabled: false, dashboardUrl: null, eventNames: [] };
            configModule.mutations[configLoaded](state, { config: { analytics: analyticsConfig } });
            expect(state.config.analytics).toEqual(analyticsConfig);
        });

        it('rejects a malformed analytics dashboard URL', () => {
            const state = { config: null, configError: null };
            configModule.mutations[configLoaded](state, {
                config: { analytics: { enabled: true, dashboardUrl: 'not-a-url', eventNames: ['PAGE_VIEW_HOME'] } }
            });
            expect(state.config).toBeNull();
        });

        it('rejects an analytics dashboard URL with an unsafe protocol', () => {
            const state = { config: null, configError: null };
            configModule.mutations[configLoaded](state, {
                config: {
                    analytics: {
                        enabled: true,
                        dashboardUrl: 'javascript:alert(1)',
                        eventNames: ['PAGE_VIEW_HOME']
                    }
                }
            });
            expect(state.configError).toContain('Server config rejected');
        });

        it('rejects analytics configuration with a non-boolean enabled value', () => {
            const state = { config: null, configError: null };
            configModule.mutations[configLoaded](state, {
                config: { analytics: { enabled: 'true', dashboardUrl: null, eventNames: [] } }
            });
            expect(state.config).toBeNull();
        });

        it('rejects analytics configuration with non-string event names', () => {
            const state = { config: null, configError: null };
            configModule.mutations[configLoaded](state, {
                config: { analytics: { enabled: false, dashboardUrl: null, eventNames: [null] } }
            });
            expect(state.config).toBeNull();
        });

        it('rejects analytics configuration arrays', () => {
            const state = { config: null, configError: null };
            configModule.mutations[configLoaded](state, { config: { analytics: [] } });
            expect(state.config).toBeNull();
        });

        describe('error', () => {
            it('sets configError from payload', () => {
                const state = { config: null, configError: null };
                configModule.mutations[configError](state, { error: 'network error' });
                expect(state.configError).toBe('network error');
            });
        });
    });

    describe('actions', () => {
        describe('clear', () => {
            it('commits clear', () => {
                const commit = jest.fn();
                configModule.actions[configClear]({ commit });
                expect(commit).toHaveBeenCalledWith(configClear);
            });
        });

        describe('fetch', () => {
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

            it('dispatches configClear on start', async () => {
                api.getAsync.mockResolvedValue({ data: { githubEnabled: true } });
                await configModule.actions[configFetch](context);
                expect(dispatch).toHaveBeenCalledWith(configClear);
            });

            it('fetches config with a five-second timeout', async () => {
                api.getAsync.mockResolvedValue({ data: { githubEnabled: true } });
                await configModule.actions[configFetch](context);
                expect(api.getAsync).toHaveBeenCalledWith('/api/config', { timeout: 5000 });
            });

            it('commits configLoaded with config from server "data" wrapper', async () => {
                const configData = { githubEnabled: true, defaultLocale: 'es', allowedLocales: ['es', 'en'] };
                api.getAsync.mockResolvedValue({ data: configData });
                await configModule.actions[configFetch](context);
                expect(commit).toHaveBeenCalledWith(configLoaded, { config: configData });
            });

            it('enables analytics only from the server response', async () => {
                const analyticsConfig = {
                    enabled: true,
                    dashboardUrl: 'https://plausible.test/share/threatdragon',
                    eventNames: ['PAGE_VIEW_HOME']
                };
                api.getAsync.mockResolvedValue({ data: { analytics: analyticsConfig } });
                await configModule.actions[configFetch](context);
                expect(analytics.configure).toHaveBeenCalledWith(analyticsConfig);
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

            it('logs error and commits configError on API failure', async () => {
                const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
                api.getAsync.mockRejectedValue(new Error('network error'));
                await configModule.actions[configFetch](context);
                expect(consoleError).toHaveBeenCalled();
                expect(commit).toHaveBeenCalledWith(configError, { error: 'network error' });
                consoleError.mockRestore();
            });

            it('logs error and commits configError default message', async () => {
                const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
                api.getAsync.mockRejectedValue(new Error(''));
                await configModule.actions[configFetch](context);
                expect(consoleError).toHaveBeenCalled();
                expect(commit).toHaveBeenCalledWith(configError, { error: 'Unknown error fetching config' });
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

        describe('analytics', () => {
            it('reports analytics as disabled without server configuration', () => {
                expect(configModule.getters.analyticsEnabled({ config: null })).toBe(false);
            });

            it('reports analytics as enabled from server configuration', () => {
                const state = { config: { analytics: { enabled: true } } };
                expect(configModule.getters.analyticsEnabled(state)).toBe(true);
            });

            it('returns no dashboard URL without server configuration', () => {
                expect(configModule.getters.analyticsDashboardUrl({ config: null })).toBeNull();
            });

            it('returns the server-configured dashboard URL', () => {
                const state = { config: { analytics: { dashboardUrl: 'https://plausible.test/share/td' } } };
                expect(configModule.getters.analyticsDashboardUrl(state)).toBe('https://plausible.test/share/td');
            });
        });
    });
});
