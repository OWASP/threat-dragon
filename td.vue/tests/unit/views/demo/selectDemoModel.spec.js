import { BootstrapVue, BJumbotron, BListGroupItem } from 'bootstrap-vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import demoThreatModel from '@/service/demo/v2-threat-model';
import SelectDemoModel from '@/views/demo/SelectDemoModel.vue';

describe('views/demo/SelectDemoModel.vue', () => {

    let wrapper, localVue, mockRouter, mockStore;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
        localVue.use(Vuex);

        mockStore = new Vuex.Store({
            actions: {
                THREATMODEL_CLEAR: () => {},
                THREATMODEL_LOAD_DEMOS: () => {},
                THREATMODEL_SELECTED: () => {}
            }
        });
        mockStore.dispatch = jest.fn();

        mockRouter = { push: jest.fn() };
        wrapper = shallowMount(SelectDemoModel, {
            localVue,
            store: mockStore,
            mocks: {
                $t: key => key,
                $route: {
                    params: {}
                },
                $router: mockRouter
            }
        });
    });

    it('displays the title', () => {
        expect(wrapper.findComponent(BJumbotron).text()).toEqual('demo.select');
    });

    it('displays the Demo Threat Model', () => {
        expect(
            wrapper.findAllComponents(BListGroupItem)
                .filter(x => x.text() === 'Demo Threat Model')
                .at(0)
                .exists()
        ).toEqual(true);
    });

    it('displays the HuskyAI demo model', () => {
        expect(
            wrapper.findAllComponents(BListGroupItem)
                .filter(x => x.text() === 'Husky AI')
                .at(0)
                .exists()
        ).toEqual(true);
    });

    it('displays the Cryptocurrency Wallet demo model', () => {
        expect(
            wrapper.findAllComponents(BListGroupItem)
                .filter(x => x.text() === 'Cryptocurrency Wallet')
                .at(0)
                .exists()
        ).toEqual(true);
    });

    it('displays the Generic CMS demo model', () => {
        expect(
            wrapper.findAllComponents(BListGroupItem)
                .filter(x => x.text() === 'Generic CMS')
                .at(0)
                .exists()
        ).toEqual(true);
    });

    it('displays the IoT Device demo model', () => {
        expect(
            wrapper.findAllComponents(BListGroupItem)
                .filter(x => x.text() === 'IoT Device')
                .at(0)
                .exists()
        ).toEqual(true);
    });

    it('displays the Online Game demo model', () => {
        expect(
            wrapper.findAllComponents(BListGroupItem)
                .filter(x => x.text() === 'Online Game')
                .at(0)
                .exists()
        ).toEqual(true);
    });

    it('displays the Payments Processing Platform demo model', () => {
        expect(
            wrapper.findAllComponents(BListGroupItem)
                .filter(x => x.text() === 'Payments Processing Platform')
                .at(0)
                .exists()
        ).toEqual(true);
    });

    it('displays the Renting Car Startup demo model', () => {
        expect(
            wrapper.findAllComponents(BListGroupItem)
                .filter(x => x.text() === 'Renting Car Startup')
                .at(0)
                .exists()
        ).toEqual(true);
    });

    it('displays the Three Tier Web Application demo model', () => {
        expect(
            wrapper.findAllComponents(BListGroupItem)
                .filter(x => x.text() === 'Three Tier Web Application')
                .at(0)
                .exists()
        ).toEqual(true);
    });

    it('displays the New Blank Model', () => {
        expect(
            wrapper.findAllComponents(BListGroupItem)
                .filter(x => x.text() === 'New Blank Model')
                .at(0)
                .exists()
        ).toEqual(true);
    });

    it('clears the threatmodels', () => {
        expect(mockStore.dispatch).toHaveBeenCalledWith('THREATMODEL_CLEAR');
    });

    it('loads the demo models', () => {
        expect(mockStore.dispatch).toHaveBeenCalledWith('THREATMODEL_LOAD_DEMOS');
    });

    describe('selecting a demo model with local provider', () => {
        let demoModelItem;

        beforeEach(async () => {
            mockStore = new Vuex.Store({
                state: {
                    provider: { selected: 'local' }
                },
                actions: {
                    THREATMODEL_CLEAR: () => {},
                    THREATMODEL_LOAD_DEMOS: () => {},
                    THREATMODEL_SELECTED: () => {},
                    THREATMODEL_STASH: () => {}
                }
            });
            mockStore.dispatch = jest.fn();

            wrapper = shallowMount(SelectDemoModel, {
                localVue,
                store: mockStore,
                mocks: {
                    $t: key => key,
                    $route: { params: {} },
                    $router: mockRouter
                }
            });

            demoModelItem = await wrapper.findAllComponents(BListGroupItem)
                .filter(x => x.text() === 'Demo Threat Model')
                .at(0);
            await demoModelItem.trigger('click');
        });

        it('dispatches the selected event', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith('THREATMODEL_SELECTED', demoThreatModel);
        });

        it('navigates to the local threat model page', () => {
            expect(mockRouter.push).toHaveBeenCalledWith(
                { name: 'localThreatModel', params: { threatmodel: 'Demo Threat Model' }}
            );
        });

        it('does not stash the model', () => {
            expect(mockStore.dispatch).not.toHaveBeenCalledWith('THREATMODEL_STASH');
        });
    });


     
    describe('selecting a demo model with github provider', () => {
        let demoModelItem;

        beforeEach(async () => {
            mockStore = new Vuex.Store({
                state: {
                    provider: { selected: 'github' }
                },
                actions: {
                    THREATMODEL_CLEAR: () => {},
                    THREATMODEL_LOAD_DEMOS: () => {},
                    THREATMODEL_SELECTED: () => {},
                    THREATMODEL_STASH: () => {}
                }
            });
            mockStore.dispatch = jest.fn();

            wrapper = shallowMount(SelectDemoModel, {
                localVue,
                store: mockStore,
                mocks: {
                    $t: key => key,
                    $route: { params: {} },
                    $router: mockRouter
                }
            });

            demoModelItem = await wrapper.findAllComponents(BListGroupItem)
                .filter(x => x.text() === 'Demo Threat Model')
                .at(0);
            await demoModelItem.trigger('click');
        });

        it('dispatches the selected event', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith('THREATMODEL_SELECTED', demoThreatModel);
        });

        it('stashes the model', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith('THREATMODEL_STASH');
        });

        it('navigates to the repository selection page', () => {
            expect(mockRouter.push).toHaveBeenCalledWith({
                name: 'gitRepository',
                params: { provider: 'github' },
                query: { action: 'create' }
            });
        });
    });


    describe('selecting a demo model with google provider', () => {
        let demoModelItem;

        beforeEach(async () => {
            mockStore = new Vuex.Store({
                state: {
                    provider: { selected: 'google' }
                },
                actions: {
                    THREATMODEL_CLEAR: () => {},
                    THREATMODEL_LOAD_DEMOS: () => {},
                    THREATMODEL_SELECTED: () => {},
                    THREATMODEL_STASH: () => {}
                }
            });
            mockStore.dispatch = jest.fn();

            wrapper = shallowMount(SelectDemoModel, {
                localVue,
                store: mockStore,
                mocks: {
                    $t: key => key,
                    $route: { params: {} },
                    $router: mockRouter
                }
            });

            demoModelItem = await wrapper.findAllComponents(BListGroupItem)
                .filter(x => x.text() === 'Demo Threat Model')
                .at(0);
            await demoModelItem.trigger('click');
        });

        it('dispatches the selected event', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith('THREATMODEL_SELECTED', demoThreatModel);
        });

        it('stashes the model', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith('THREATMODEL_STASH');
        });

        it('navigates to the folder selection page', () => {
            expect(mockRouter.push).toHaveBeenCalledWith({
                name: 'googleFolder',
                params: { provider: 'google' },
                query: { action: 'create' }
            });
        });
    });
});