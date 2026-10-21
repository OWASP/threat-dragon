import { BootstrapVue, BCardText } from 'bootstrap-vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Vuex from 'vuex';

import TdGraphMeta from '@/components/GraphMeta.vue';
import TdGraphThreats from '@/components/GraphThreats.vue';
import TdResizeHandle from '@/components/ResizeHandle.vue';
import analytics from '@/service/analytics.js';

jest.mock('@/service/analytics.js', () => ({
    track: jest.fn()
}));

describe('components/GraphMeta.vue', () => {
    let wrapper;

    beforeEach(() => analytics.track.mockClear());

    describe('emptyState', () => {
        beforeEach(() => {
            const localVue = createLocalVue();
            localVue.use(Vuex);
            localVue.use(BootstrapVue);
            localVue.component('font-awesome-icon', FontAwesomeIcon);
            localVue.use(Vuex);
            const mockStore = new Vuex.Store({
                state: {
                    cell: {
                        ref: null
                    }
                }
            });
            wrapper = shallowMount(TdGraphMeta, {
                localVue,
                store: mockStore,
                mocks: {
                    $t: key => key
                }
            });
        });

        it('displays the empty threat message', () => {
            expect(wrapper.findComponent(BCardText).text()).toContain('threats.emptyThreat');
        });

        it('hides the header new threat action', () => {
            expect(wrapper.find('.threats-header-action').exists()).toEqual(false);
        });
    });

    describe('with data', () => {
        let entityData;

        beforeEach(() => {
            entityData = {
                threats: [{
                    status: 'Open',
                    severity: 'Medium',
                    description: 'describing the thing',
                    title: 'Some Threat',
                    type: 'Spoofing',
                    mitigation: 'Unmitigated'
                }]
            };
            const localVue = createLocalVue();
            localVue.use(Vuex);
            localVue.use(BootstrapVue);
            localVue.component('font-awesome-icon', FontAwesomeIcon);
            localVue.use(Vuex);
            const mockStore = new Vuex.Store({
                state: {
                    cell: {
                        ref: {
                            data: entityData
                        },
                        threats: entityData.threats
                    },
                    threatmodel: {
                        selectedDiagram: {
                            diagramType: 'LINDDUN'
                        },
                        data:{
                            detail:{
                                threatTop:0,
                            },
                        }
                    }
                }
            });
            wrapper = shallowMount(TdGraphMeta, {
                localVue,
                store: mockStore,
                mocks: {
                    $t: key => key
                }
            });
        });

        it('displays the threat card', () => {
            expect(wrapper.findComponent(TdGraphThreats).exists()).toEqual(true);
        });

        it('displays the header new threat action', () => {
            expect(wrapper.find('.threats-header-action').exists()).toEqual(true);
        });

        it('updates the properties width from its handle', async () => {
            wrapper.findComponent(TdResizeHandle).vm.$emit('resize', 80);
            await wrapper.vm.$nextTick();

            expect(wrapper.vm.propertiesOffset).toEqual(80);
        });

        it('creates a threat from the header action', async () => {
            const newThreat = jest.spyOn(wrapper.vm, 'newThreat').mockImplementation(() => {});
            await wrapper.find('.threats-header-action').trigger('click');

            expect(newThreat).toHaveBeenCalledTimes(1);
        });

        it('creates a threat from the lower action', async () => {
            const newThreat = jest.spyOn(wrapper.vm, 'newThreat').mockImplementation(() => {});
            await wrapper.findAll('.new-threat-by-type').at(0).trigger('click');

            expect(newThreat).toHaveBeenCalledTimes(1);
        });

        it('requests type suggestions from its link', async () => {
            await wrapper.findAll('.new-threat-by-type').at(1).trigger('click');

            expect(wrapper.emitted('threatSuggest')[0]).toEqual(['type']);
        });

        it('requests context suggestions from its link', async () => {
            await wrapper.findAll('.new-threat-by-type').at(2).trigger('click');

            expect(wrapper.emitted('threatSuggest')[0]).toEqual(['context']);
        });
    });

    describe('threatSelected', () => {
        let emitter, entityData;

        beforeEach(() => {
            entityData = {
                threats: [{
                    status: 'Open',
                    severity: 'Medium',
                    description: 'describing the thing',
                    title: 'Some Threat',
                    type: 'Spoofing',
                    mitigation: 'Unmitigated'
                }]
            };
            const localVue = createLocalVue();
            localVue.use(Vuex);
            localVue.use(BootstrapVue);
            localVue.component('font-awesome-icon', FontAwesomeIcon);
            localVue.use(Vuex);
            const mockStore = new Vuex.Store({
                state: {
                    cell: {
                        ref: {
                            data: entityData
                        },
                        threats: entityData.threats
                    },
                    threatmodel: {
                        selectedDiagram: {
                            diagramType: 'LINDDUN'
                        },
                        data:{
                            detail:{
                                threatTop:0,
                            },
                        }
                    }
                }
            });
            wrapper = shallowMount(TdGraphMeta, {
                localVue,
                store: mockStore,
                mocks: {
                    $t: key => key,
                    $emit: emitter = jest.fn()
                }
            });
        });

        it('emits the threatSelected event with the threat id', () => {
            wrapper.vm.threatSelected('id1', 'new');
            expect(emitter).toHaveBeenCalledWith('threatSelected', 'id1', 'new');
        });
    });

    describe('newThreat', () => {
        let entityData;

        beforeEach(() => {
            entityData = {
                threats: [{
                    status: 'Open',
                    severity: 'Medium',
                    description: 'describing the thing',
                    title: 'Some Threat',
                    type: 'Linkability',
                    mitigation: 'Unmitigated',
                    modelType: 'LINDDUN'
                }],
                hasOpenThreats: true
            };
            const localVue = createLocalVue();
            localVue.use(Vuex);
            localVue.use(BootstrapVue);
            localVue.component('font-awesome-icon', FontAwesomeIcon);
            localVue.use(Vuex);
            const mockStore = new Vuex.Store({
                state: {
                    cell: {
                        ref: {
                            data: entityData,
                            getData: jest.fn()
                        },
                        threats: entityData.threats
                    },
                    threatmodel: {
                        selectedDiagram: {
                            diagramType: 'LINDDUN'
                        },
                        data:{
                            detail:{
                                threatTop:0,
                            },
                        }
                    }
                },
                actions:{ threatmodelUpdate: () => {}},
            });
            wrapper = shallowMount(TdGraphMeta, {
                localVue,
                store: mockStore,
                mocks: {
                    $t: key => key
                }
            });
            wrapper.vm.threatSelected = jest.fn();
            mockStore.dispatch = jest.fn();
            wrapper.vm.newThreat();
        });

        it('adds a threat to the cell data', () => {
            expect(wrapper.vm.threatSelected).toHaveBeenCalledWith(expect.anything(), 'new');
        });

        it('tracks manual threat creation', () => {
            expect(analytics.track).toHaveBeenCalledWith('THREAT_CREATED_MANUALLY', { status: 'Open' });
        });
    });

    describe('threat suggestions', () => {
        it('tracks requests from the threat type engine', () => {
            TdGraphMeta.methods.AddThreatByType.call({ $emit: jest.fn() });
            expect(analytics.track).toHaveBeenCalledWith('THREAT_SUGGESTIONS_REQUESTED', { source: 'type' });
        });

        it('tracks requests from the context engine', () => {
            TdGraphMeta.methods.AddThreatByContext.call({ $emit: jest.fn() });
            expect(analytics.track).toHaveBeenCalledWith('THREAT_SUGGESTIONS_REQUESTED', { source: 'context' });
        });
    });

});
