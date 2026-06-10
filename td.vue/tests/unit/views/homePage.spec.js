import { BootstrapVue, BContainer } from 'bootstrap-vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import { AUTH_SET_LOCAL } from '@/store/actions/auth.js';
import configActions from '@/store/actions/config.js';
import { PROVIDER_SELECTED } from '@/store/actions/provider.js';
import HomePage, { resolveProviders } from '@/views/HomePage.vue';
import TdHero from '@/components/Hero.vue';
import TdImage from '@/components/Image.vue';
import TdProviderLoginButton from '@/components/ProviderLoginButton.vue';

jest.mock('@/assets/threatdragon_logo_image.svg', () => 'threatdragon_logo_image.svg');
jest.mock('is-electron', () => jest.fn());

// Helper: wrap shallowMount with controlled async mount resolution.
// Returns { wrapper, resolve } — call resolve() to let mounted() finish.
const createControlledMount = (store, mocks = {}) => {
    let resolveMount;
    const mountPromise = new Promise((resolve) => { resolveMount = resolve; });

    // Intercept the dispatch that mounted() awaits, so we control timing
    store.dispatch = jest.fn().mockReturnValue(mountPromise);

    const localVue = createLocalVue();
    localVue.use(Vuex);
    localVue.use(BootstrapVue);
    localVue.component('font-awesome-icon', FontAwesomeIcon);

    const wrapper = shallowMount(HomePage, {
        localVue,
        store,
        mocks: {
            $t: (key) => key,
            $toast: { error: jest.fn() },
            ...mocks
        }
    });

    return { wrapper, resolve: resolveMount };
};

// ──────────────────────────────────────────
// Pure function: resolveProviders
// ──────────────────────────────────────────
describe('resolveProviders()', () => {
    it('returns desktop only in Electron environment', () => {
        const result = resolveProviders({ localEnabled: true }, true);
        expect(result).toEqual({ desktop: expect.any(Object) });
    });

    it('returns local provider when serverConfig is null in browser', () => {
        const result = resolveProviders(null, false);
        expect(result).toEqual({ local: expect.any(Object) });
    });

    it('returns empty object when no providers enabled', () => {
        const result = resolveProviders({
            githubEnabled: false,
            bitbucketEnabled: false,
            gitlabEnabled: false,
            googleEnabled: false,
            localEnabled: false
        }, false);
        expect(result).toEqual({});
    });

    it('includes each enabled provider', () => {
        const result = resolveProviders({
            githubEnabled: true,
            bitbucketEnabled: true,
            gitlabEnabled: true,
            googleEnabled: true,
            localEnabled: true
        }, false);
        expect(result).toEqual({
            github: expect.any(Object),
            bitbucket: expect.any(Object),
            gitlab: expect.any(Object),
            google: expect.any(Object),
            local: expect.any(Object)
        });
    });
});

// ──────────────────────────────────────────
// Component: HomePage.vue
// ──────────────────────────────────────────
describe('HomePage.vue', () => {
    let wrapper;

    const createStore = (configOverrides = {}) => {
        const defaults = {
            githubEnabled: false,
            bitbucketEnabled: false,
            gitlabEnabled: false,
            googleEnabled: false,
            localEnabled: false
        };
        return new Vuex.Store({
            state: {
                config: {
                    config: { ...defaults, ...configOverrides }
                }
            },
            actions: {
                [AUTH_SET_LOCAL]: () => {},
                [configActions.fetch]: () => {},
                [PROVIDER_SELECTED]: () => {}
            }
        });
    };

    beforeEach(() => {
        const isElectron = require('is-electron');
        isElectron.mockReturnValue(false);
    });

    describe('layout', () => {
        beforeEach(async () => {
            const store = createStore({ githubEnabled: true });
            const { wrapper: w, resolve } = createControlledMount(store);
            resolve();
            // Wait for Vue to process the resolved promise + ready flip
            await w.vm.$nextTick();
            await w.vm.$nextTick();
            wrapper = w;
        });

        it('renders the home view', () => {
            expect(wrapper.exists()).toBe(true);
        });

        it('has a b-container', () => {
            expect(wrapper.findComponent(BContainer).exists()).toBe(true);
        });

        it('has a hero section', () => {
            expect(wrapper.findComponent(TdHero).exists()).toBe(true);
        });

        it('displays the title', () => {
            expect(wrapper.find('h1.display-3').text()).toContain('home.title');
        });

        it('displays the threat dragon logo', () => {
            expect(wrapper.findComponent(TdImage).props('src'))
                .toContain('threatdragon_logo_image');
        });

        it('is ready after mount resolves', () => {
            expect(wrapper.vm.ready).toBe(true);
        });
    });

    describe('loading state', () => {
        it('shows spinner and hides content before mount resolves', () => {
            const store = createStore({ githubEnabled: true });
            const { wrapper: w } = createControlledMount(store);

            expect(w.vm.ready).toBe(false);
            expect(w.find('b-spinner-stub').exists()).toBe(true);
            expect(w.find('.td-description').exists()).toBe(false);
        });

        it('shows content and hides spinner after mount resolves', async () => {
            const store = createStore({ githubEnabled: true });
            const { wrapper: w, resolve } = createControlledMount(store);

            resolve();
            await w.vm.$nextTick();
            await w.vm.$nextTick();

            expect(w.vm.ready).toBe(true);
            expect(w.find('b-spinner-stub').exists()).toBe(false);
            expect(w.find('.td-description').exists()).toBe(true);
        });
    });

    describe('providers', () => {
        it('renders a login button per enabled provider', async () => {
            const store = createStore({ githubEnabled: true, localEnabled: true });
            const { wrapper: w, resolve } = createControlledMount(store);
            resolve();
            await w.vm.$nextTick();
            await w.vm.$nextTick();

            const buttons = w.findAllComponents(TdProviderLoginButton);
            expect(buttons).toHaveLength(2);
        });
    });

    describe('config error', () => {
        it('shows a toast when configError is present after fetch', async () => {
            const mockToastError = jest.fn();
            const store = new Vuex.Store({
                state: {
                    config: {
                        config: null,
                        configError: 'Failed to fetch'
                    }
                },
                actions: {
                    [AUTH_SET_LOCAL]: () => {},
                    [configActions.fetch]: () => {},
                    [PROVIDER_SELECTED]: () => {}
                }
            });

            const { wrapper: w, resolve } = createControlledMount(store, {
                $toast: { error: mockToastError }
            });

            resolve();

            // Wait for microtask queue (async mounted) to drain
            await new Promise(process.nextTick);
            await w.vm.$nextTick();

            expect(mockToastError).toHaveBeenCalledWith('home.errors.configLoadFailed');
        });
    });
});
