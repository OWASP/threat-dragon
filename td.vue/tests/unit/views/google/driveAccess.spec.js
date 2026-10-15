import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import { providerSelected } from '@/store/actions/provider.js';
import { folderClear, folderFetch, folderSelected, folderNavigateBack } from '@/store/actions/folder.js';
import DriveAccess from '@/views/google/DriveAccess.vue';
import TdSelectionPage from '@/components/SelectionPage.vue';

const provider = 'google';

const buildStore = () => new Vuex.Store({
    state: {
        provider: { selected: provider },
        folders: { all: [], selected: '', page: 1, pageNext: true, pagePrev: false },
    },
    actions: {
        [providerSelected]: () => {},
        [folderClear]: () => {},
        [folderFetch]: () => {},
        [folderSelected]: () => {},
        [folderNavigateBack]: () => {},
    },
});

const mountComponent = (params, query = {}) => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    mockStore = buildStore();
    mockRouter = { push: jest.fn() };
    jest.spyOn(mockStore, 'dispatch');
    wrapper = shallowMount(DriveAccess, {
	    localVue,
        store: mockStore,
	    mocks: { $route: { params, query }, $router: mockRouter, $t: k => k },
    });
};

let localVue, mockRouter, mockStore, wrapper;

describe('views/DriveAccess.vue', () => {
    describe('mounted', () => {
        it('sets the provider from the route', () => {
            mountComponent({ provider: 'local' }, { page: 1 });
            expect(mockStore.dispatch).toHaveBeenCalledWith(providerSelected, 'local');
        });

        it('fetches with default page 1', () => {
            mountComponent({ provider: provider }, {});
            expect(mockStore.dispatch).toHaveBeenCalledWith(folderFetch, { page: 1 });
        });

        it('uses the page from the route query', () => {
            mountComponent({ provider: provider }, { page: 3 });
            expect(mockStore.dispatch).toHaveBeenCalledWith(folderFetch, { page: 3 });
        });

        it('does not re-dispatch an already-matched provider', () => {
            mountComponent({ provider: provider }, { page: 1 });
            expect(mockStore.dispatch).not.toHaveBeenCalledWith(providerSelected, provider);
        });
    });

    describe('drives', () => {
	    beforeEach(() => mountComponent({ provider: provider }, { page: 1 }));

	    it('renders the selection page wrapper', () => {
	        expect(wrapper.findComponent(TdSelectionPage).exists()).toBe(true);
	    });

    });

});
