import { BootstrapVue, BJumbotron, BButton, BAlert, BListGroupItem } from 'bootstrap-vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import TemplateGallery from '@/views/TemplateGallery.vue';
import templateActions from '@/store/actions/template.js';
import tmActions from '@/store/actions/threatmodel.js';

describe('TemplateGallery.vue', () => {
    let wrapper, localVue, mockRouter, mockStore, toast;

    beforeEach(() => {
        toast = { error: jest.fn(), warning: jest.fn() };
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
        localVue.use(Vuex);
        mockStore = new Vuex.Store({
            state: {
                provider: { selected: 'local' },
                template: {
                    templates: [],
                    contentStore: {
                        status: null,
                        canWrite: false,
                    },
                },
            },
            getters: {
                templates: () => [],
                contentStoreStatus: () => null,
                canWriteStore: () => false,
            },
        });
        mockStore.dispatch = jest.fn();
        mockRouter = { push: jest.fn() };
        wrapper = shallowMount(TemplateGallery, {
            localVue,
            store: mockStore,
            mocks: {
                $t: (key) => key,
                $toast: toast,
                $route: { params: {} },
                $router: mockRouter,
            },
        });
    });

    it('shows the jumbotron title', () => {
        expect(wrapper.findComponent(BJumbotron).text()).toContain(
            'template.select'
        );
    });

    it('shows the jumbotron description', () => {
        expect(wrapper.findComponent(BJumbotron).text()).toContain(
            'template.selectDescription'
        );
    });

    it('shows a button to start from a local template', () => {
        expect(wrapper.findComponent(BButton).text()).toEqual(
            'template.startFromLocalTemplate'
        );
    });
    it('shows an alert if no templates are available', () => {
        expect(wrapper.findComponent(BAlert).text()).toContain(
            'template.templatesLocalSession'
        );
    });

    describe('when content store is NOT_CONFIGURED', () => {
        beforeEach(() => {
            mockStore = new Vuex.Store({
                state: {
                    provider: { selected: 'github' },
                },
                getters: {
                    templates: () => [],
                    contentStoreStatus: () => 'NOT_CONFIGURED',
                    canWriteStore: () => false,
                },
            });
            mockStore.dispatch = jest.fn();
            wrapper = shallowMount(TemplateGallery, {
                localVue,
                store: mockStore,
                mocks: {
                    $t: (key) => key,
                    $toast: toast,
                    $route: { params: {} },
                    $router: mockRouter,
                },
            });
        });

        it('shows the not configured alert', () => {
            expect(wrapper.findComponent(BAlert).text()).toContain(
                'template.status.notConfigured.title'
            );
        });
    });
    describe('when content store is NOT_FOUND', () => {
        beforeEach(() => {
            mockStore = new Vuex.Store({
                state: {
                    provider: { selected: 'github' },
                },
                getters: {
                    templates: () => [],
                    contentStoreStatus: () => 'NOT_FOUND',
                    canWriteStore: () => false,
                },
            });
            mockStore.dispatch = jest.fn();
            wrapper = shallowMount(TemplateGallery, {
                localVue,
                store: mockStore,
                mocks: {
                    $t: (key) => key,
                    $toast: toast,
                    $route: { params: {} },
                    $router: mockRouter,
                },
            });
        });

        it('shows the not configured alert', () => {
            expect(wrapper.findComponent(BAlert).text()).toContain(
                'template.status.notFound.title'
            );
        });
    });
    describe('when content store is NOT_INITIALIZED', () => {
        beforeEach(() => {
            mockStore = new Vuex.Store({
                state: {
                    provider: { selected: 'github' },
                },
                getters: {
                    templates: () => [],
                    contentStoreStatus: () => 'NOT_INITIALIZED',
                    canWriteStore: () => false,
                },
            });
            mockStore.dispatch = jest.fn();
            wrapper = shallowMount(TemplateGallery, {
                localVue,
                store: mockStore,
                mocks: {
                    $t: (key) => key,
                    $toast: toast,
                    $route: { params: {} },
                    $router: mockRouter,
                },
            });
        });

        it('shows the not initialized alert', () => {
            expect(wrapper.findComponent(BAlert).text()).toContain(
                'template.status.notInitialized.title'
            );
        });
    });
    describe('when content repo is configured and templates are available', () => {
        const templates = [
            {
                id: '1',
                name: 'Foo Template',
                description: 'A foo template',
                tags: ['foo'],
                modelRef: 'foo',
            },
        ];
        beforeEach(() => {
            mockStore = new Vuex.Store({
                state: {
                    provider: { selected: 'github' },
                },
                getters: {
                    templates: () => templates,
                    contentStoreStatus: () => null,
                    canWriteStore: () => false,
                },
            });
            mockStore.dispatch = jest.fn();
            wrapper = shallowMount(TemplateGallery, {
                localVue,
                store: mockStore,
                mocks: {
                    $t: (key) => key,
                    $toast: toast,
                    $route: { params: {} },
                    $router: mockRouter,
                },
            });
        });

        it('renders a list item for each template', () => {
            expect(wrapper.findAllComponents(BListGroupItem)).toHaveLength(1);
        });
    });

    describe('when user clicks on a template', () => {
        const templateMetadata = {
            id: '1',
            name: 'Foo Template',
            description: 'A foo template',
            tags: ['foo'],
            modelRef: 'foo',
        };

        beforeEach(async () => {
            mockStore.dispatch = jest.fn().mockResolvedValue({ content: {} });
            await wrapper.vm.onTemplateClick(templateMetadata);
        });

        it('dispatches fetchModelById with the template id', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(
                templateActions.fetchModelById,
                templateMetadata.id
            );
        });

        it('dispatches templateLoad with the template content', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith(
                tmActions.templateLoad,
                { templateData: {} }
            );
        });
    });
});
