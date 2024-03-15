import { BootstrapVue, BCardText } from 'bootstrap-vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Vuex from 'vuex';

import TdGraphMeta from '@/components/GraphMeta.vue';
import TdGraphThreats from '@/components/GraphThreats.vue';

describe('components/GraphMeta.vue', () => {
    let wrapper;

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
            wrapper.vm.threatSelected('id1','new');
            expect(emitter).toHaveBeenCalledWith('threatSelected', 'id1','new');
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
                actions:{ THREATMODEL_UPDATE: ()=> {}},
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
            expect(wrapper.vm.threatSelected).toHaveBeenCalledWith(expect.anything(),'new');
        });
    });

});
