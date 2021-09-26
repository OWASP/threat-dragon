import { BootstrapVue, BJumbotron, BListGroupItem } from 'bootstrap-vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import demoThreatModel from '@/service/demo/demo-threat-model.js';
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
                THREATMODEL_FETCH_ALL: () => {},
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

    it('displays the demo threat model', () => {
        expect(
            wrapper.findAllComponents(BListGroupItem)
                .filter(x => x.text() === 'Demo Threat Model')
                .at(0)
                .exists()
        ).toEqual(true);
    });
    
    it('clears the threatmodels', () => {
        expect(mockStore.dispatch).toHaveBeenCalledWith('THREATMODEL_CLEAR');
    });

    it('fetches the demo models', () => {
        expect(mockStore.dispatch).toHaveBeenCalledWith('THREATMODEL_FETCH_ALL');
    });

    describe('selecting a demo model', () => {
        let demoModelItem;

        beforeEach(async () => {
            demoModelItem = await wrapper.findAllComponents(BListGroupItem)
                .filter(x => x.text() === 'Demo Threat Model')
                .at(0);
            await demoModelItem.trigger('click');
        });

        it('dispatches the selected event', () => {
            expect(mockStore.dispatch).toHaveBeenCalledWith('THREATMODEL_SELECTED', demoThreatModel);
        });

        it('navigates to the threat model page', () => {
            expect(mockRouter.push).toHaveBeenCalledWith(
                { name: 'localThreatModel', params: { threatmodel: 'Demo Threat Model' }}
            );
        });
    });
});