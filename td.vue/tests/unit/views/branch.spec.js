import { BootstrapVue, BContainer, BJumbotron, BListGroup, BListGroupItem } from 'bootstrap-vue';
import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import Branch from '@/views/Branch.vue';
import { DATASOURCE_REPOSITORY_CLEAR, DATASOURCE_BRANCH_SELECTED } from '@/store/actions/datasource.js';
import router from '@/router/index.js';

describe('Branch.vue', () => {
    let wrapper, localVue, mockStore;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
        localVue.use(Vuex);
        mockStore = new Vuex.Store({
            state: {
                datasource: {
                    provider: 'github',
                    github: {}
                }
            },
            actions: {
                [DATASOURCE_REPOSITORY_CLEAR]: () => {},
                [DATASOURCE_BRANCH_SELECTED]: () => {}
            }
        });
        jest.spyOn(mockStore, 'dispatch');
        wrapper = mount(Branch, {
            localVue,
            store: mockStore
        });
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
        beforeEach(() => {
            router.push('/');
        });

        it('dispatches the repository_clear event', async () => {
            await wrapper.find('#return-to-repo').trigger('click');
            expect(mockStore.dispatch).toHaveBeenCalled();
        });

        it('navigates to the repository view', async () => {
            jest.spyOn(router, 'push');
            await wrapper.find('#return-to-repo').trigger('click');
            expect(router.push).toHaveBeenCalledWith('/repository');
        });
    });

    describe('selecting a branch', () => {
        beforeEach(() => {
            router.push('/');
        });

        it('dispatches the repository_selected event', async () => {
            await wrapper.findComponent(BListGroupItem).trigger('click');
            expect(mockStore.dispatch).toHaveBeenCalled();
        });

        it('navigates to the branch view', async () => {
            jest.spyOn(router, 'push');
            await wrapper.findComponent(BListGroupItem).trigger('click');
            expect(router.push).toHaveBeenCalledWith('/threatmodel-select');
        });
    });
});
