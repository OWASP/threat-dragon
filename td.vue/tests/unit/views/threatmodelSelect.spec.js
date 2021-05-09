import { BootstrapVue, BContainer, BJumbotron, BListGroup, BListGroupItem } from 'bootstrap-vue';
import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import { BRANCH_CLEAR } from '@/store/actions/branch.js';
import { REPOSITORY_CLEAR } from '@/store/actions/repository.js';
import { THREATMODEL_FETCH_ALL, THREATMODEL_SELECTED } from '@/store/actions/threatmodel.js';
import ThreatmodelSelect from '@/views/ThreatmodelSelect.vue';
import router from '@/router/index.js';

describe('ThreatmodelSelect.vue', () => {
    const repo = 'repo';
    const branch = 'branch';
    const threatModels = [ 'tm1', 'tm2' ];
    let wrapper, localVue, mockStore;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
        localVue.use(Vuex);
        mockStore = new Vuex.Store({
            state: {
                repo: { selected: repo },
                branch: { selected: branch },
                threatmodel: { all: threatModels }
            },
            actions: {
                [BRANCH_CLEAR]: () => {},
                [REPOSITORY_CLEAR]: () => {},
                [THREATMODEL_FETCH_ALL]: () => {},
                [THREATMODEL_SELECTED]: () => {}
            }
        });
        jest.spyOn(mockStore, 'dispatch');
        router.push = jest.fn();
        wrapper = mount(ThreatmodelSelect, {
            localVue,
            store: mockStore
        });
    });

    it('loads the threatmodels', () => {
        expect(mockStore.dispatch).toHaveBeenCalledWith(THREATMODEL_FETCH_ALL);
    });

    describe('layout', () => {
        it('renders the branch view', () => {
            expect(wrapper.exists()).toBe(true);
        });
    
        it('has a b-container', () => {
            expect(wrapper.findComponent(BContainer).exists()).toBe(true);
        });
    
        it('has a jumbotron with instructions', () => {
            expect(wrapper.findComponent(BJumbotron).text()).toContain('from the list below');
        });
    
        it('uses a b-list-group', () => {
            expect(wrapper.findComponent(BListGroup).exists()).toBe(true);
        });
    
        it('lists the branches', () => {
            expect(wrapper.findAllComponents(BListGroupItem).length).toBeGreaterThan(1);
        });
    });

    describe('going back to repo page', () => {
        it('dispatches the repository_clear event', async () => {
            await wrapper.find('#return-to-repo').trigger('click');
            expect(mockStore.dispatch).toHaveBeenCalledWith(REPOSITORY_CLEAR);
        });

        it('navigates to the repository view', async () => {
            await wrapper.find('#return-to-repo').trigger('click');
            expect(router.push).toHaveBeenCalledWith('/repository');
        });
    });

    describe('going back to branch page', () => {
        it('dispatches the branch_clear event', async () => {
            await wrapper.find('#return-to-branch').trigger('click');
            expect(mockStore.dispatch).toHaveBeenCalled();
        });

        it('navigates to the branch view', async () => {
            jest.spyOn(router, 'push');
            await wrapper.find('#return-to-branch').trigger('click');
            expect(router.push).toHaveBeenCalledWith('/branch');
        });
    });

    describe('selecting a threat model', () => {
        it('dispatches the threatmodel_selected event', async () => {
            await wrapper.findComponent(BListGroupItem).trigger('click');
            expect(mockStore.dispatch).toHaveBeenCalledWith(THREATMODEL_SELECTED, 'tm1');
        });

        it('navigates to the threatmodel view', async () => {
            await wrapper.findComponent(BListGroupItem).trigger('click');
            expect(router.push).toHaveBeenCalledWith('/threatmodel');
        });
    });
});
