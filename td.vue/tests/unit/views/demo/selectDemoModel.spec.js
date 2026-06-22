import { BootstrapVue, BListGroupItem } from 'bootstrap-vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import demoThreatModel from '@/service/demo/v2-threat-model';
import newModel from '@/service/demo/v2-new-model';
import otmModel from '@/service/demo/mobile-cloud.otm';
import tmBomModel from '@/service/demo/huskyai.tmbom';
import SelectDemoModel from '@/views/demo/SelectDemoModel.vue';

import TdHero from '@/components/Hero.vue';
import { importOtm } from '@/service/migration/otm/otm';
import { importTmbom } from '@/service/migration/tmBom/tmBom';

jest.mock('@/service/migration/otm/otm');
jest.mock('@/service/migration/tmBom/tmBom');

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
        expect(wrapper.findComponent(TdHero).text()).toEqual('demo.select');
    });

    it('displays the Demo Threat Model', () => {
        expect(
            wrapper.findAllComponents(BListGroupItem)
                .filter(x => x.text() === 'Demo Threat Model')
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

    it('displays the HuskyAI demo model', () => {
        expect(
            wrapper.findAllComponents(BListGroupItem)
                .filter(x => x.text() === 'Husky AI')
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

    it('displays the Mobile to Public Cloud demo model', () => {
        expect(
            wrapper.findAllComponents(BListGroupItem)
                .filter(x => x.text() === 'Mobile to Public Cloud')
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

    describe('selecting a new model with desktop provider', () => {
        let newModelItem;

        beforeEach(async () => {
            mockStore = new Vuex.Store({
                state: {
                    provider: { selected: 'desktop' }
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

            window.electronAPI = {
                modelOpened: jest.fn()
            };

            newModelItem = wrapper.findAllComponents(BListGroupItem)
                .filter(x => x.text() === 'New Blank Model')
                .at(0);
            await newModelItem.trigger('click');
        });

        it('notifies the desktop server', () => {
            expect(window.electronAPI.modelOpened).toHaveBeenCalledWith(newModel.summary.title);
        });

        it('dispatches the selected event', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith('THREATMODEL_SELECTED', newModel);
        });

        it('navigates to the local threat model page', () => {
            expect(mockRouter.push).toHaveBeenCalledWith(
                { name: 'desktopThreatModel', params: { threatmodel: 'New Blank Model' }}
            );
        });

        it('does not stash the model', () => {
            expect(mockStore.dispatch).not.toHaveBeenCalledWith('THREATMODEL_STASH');
        });
    });

    describe('selecting a model with local provider', () => {

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
        });

        describe('selecting the demo model', () => {
            let demoModelItem;

            beforeEach(async () => {
                demoModelItem = wrapper.findAllComponents(BListGroupItem)
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

        describe('selecting an OTM model', () => {
            let otmModelItem;

            beforeEach(async () => {
                otmModelItem = wrapper.findAllComponents(BListGroupItem)
                    .filter(x => x.text() === 'Mobile to Public Cloud')
                    .at(0);
                await otmModelItem.trigger('click');
            });

            it('navigates to the local threat model page', () => {
                expect(mockRouter.push).toHaveBeenCalledWith(
                    { name: 'localThreatModel', params: { threatmodel: 'Mobile to Public Cloud' }}
                );
            });

            it('converts the model from OTM', () => {
                expect(importOtm).toHaveBeenCalledWith(otmModel);
            });
        });

        describe('selecting a TM-BOM model', () => {
            let tmBomModelItem;

            beforeEach(async () => {
                tmBomModelItem = wrapper.findAllComponents(BListGroupItem)
                    .filter(x => x.text() === 'Husky AI')
                    .at(0);
                await tmBomModelItem.trigger('click');
            });

            it('navigates to the local threat model page', () => {
                expect(mockRouter.push).toHaveBeenCalledWith(
                    { name: 'localThreatModel', params: { threatmodel: 'Husky AI' }}
                );
            });

            it('converts the model from TM-BOM', () => {
                expect(importTmbom).toHaveBeenCalledWith(tmBomModel);
            });
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

            demoModelItem = wrapper.findAllComponents(BListGroupItem)
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

            demoModelItem = wrapper.findAllComponents(BListGroupItem)
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
