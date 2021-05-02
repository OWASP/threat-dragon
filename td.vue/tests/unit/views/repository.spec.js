import { BootstrapVue, BContainer, BJumbotron, BListGroup, BListGroupItem } from 'bootstrap-vue';
import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import Repository from '@/views/Repository.vue';
import { DATASOURCE_REPOSITORY_SELECTED } from '@/store/actions/datasource.js';
import router from '@/router/index.js';

describe('Repository.vue', () => {
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
                [DATASOURCE_REPOSITORY_SELECTED]: () => {}
            }
        });
        jest.spyOn(mockStore, 'dispatch');
        wrapper = mount(Repository, {
            localVue,
            store: mockStore
        });
    });

    describe('layout', () => {
        it('renders the repository view', () => {
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
    
        it('lists the repositories', () => {
            expect(wrapper.findAllComponents(BListGroupItem).length).toBeGreaterThan(1);
        });
    });

    describe('selecting a repo', () => {
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
            expect(router.push).toHaveBeenCalledWith('/branch');
        });
    });
});
