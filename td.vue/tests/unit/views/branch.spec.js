import { BootstrapVue, BContainer, BJumbotron, BListGroup, BListGroupItem } from 'bootstrap-vue';
import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import Branch from '@/views/Branch.vue';
import { BRANCH_FETCH, BRANCH_SELECTED } from '@/store/actions/branch.js';
import { REPOSITORY_CLEAR } from '@/store/actions/repository.js';
import router from '@/router/index.js';

describe('Branch.vue', () => {
    const repo = 'someRepo';
    let wrapper, localVue, mockStore;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
        localVue.use(Vuex);
        mockStore = new Vuex.Store({
            state: {
                repo: {
                    selected: repo
                },
                branch: {
                    selected: 'someBranch',
                    all: [ 'b1', 'b2', 'b3' ]
                }
            },
            actions: {
                [BRANCH_FETCH]: () => {},
                [BRANCH_SELECTED]: () => {},
                [REPOSITORY_CLEAR]: () => {}
            }
        });
        jest.spyOn(mockStore, 'dispatch');
        router.push = jest.fn();
        wrapper = mount(Branch, {
            localVue,
            store: mockStore
        });
    });

    it('fetches the branches', () => {
        expect(mockStore.dispatch).toHaveBeenCalledWith(BRANCH_FETCH);
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

        describe('repo link', () => {
            it('has a link to the repository', () => {
                expect(wrapper.find('#repo_link').text()).toEqual(repo);
            });

            it('sets the expected href', () => {
                const expectedHref = `https://www.github.com/${repo}`;
                expect(wrapper.find('#repo_link').attributes('href')).toEqual(expectedHref);
            });

            it('targets _blank', () => {
                expect(wrapper.find('#repo_link').attributes('target')).toEqual('_blank');
            });
        });
    
        it('uses a b-list-group', () => {
            expect(wrapper.findComponent(BListGroup).exists()).toBe(true);
        });
    
        it('lists the branches', () => {
            expect(wrapper.findAllComponents(BListGroupItem).length).toBeGreaterThan(1);
        });
    });

    describe('select another repo', () => {
        it('dispatches the repository_clear event', async () => {
            await wrapper.find('#return-to-repo').trigger('click');
            expect(mockStore.dispatch).toHaveBeenCalledWith(REPOSITORY_CLEAR);
        });

        it('navigates to the repository view', async () => {
            await wrapper.find('#return-to-repo').trigger('click');
            expect(router.push).toHaveBeenCalledWith('/repository');
        });
    });

    describe('select a branch', () => {
        it('dispatches the repository_selected event', async () => {
            await wrapper.findComponent(BListGroupItem).trigger('click');
            expect(mockStore.dispatch).toHaveBeenCalledWith(BRANCH_SELECTED, 'b1');
        });

        it('navigates to the branch view', async () => {
            jest.spyOn(router, 'push');
            await wrapper.findComponent(BListGroupItem).trigger('click');
            expect(router.push).toHaveBeenCalledWith('/threatmodel-select');
        });
    });
});
