import { BootstrapVue } from 'bootstrap-vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import TdGraph from '@/components/Graph.vue';
import TdGraphButtons from '@/components/GraphButtons.vue';
import TdGraphMeta from '@/components/GraphMeta.vue';
import TdKeyboardShortcuts from '@/components/KeyboardShortcuts.vue';
import TdThreatEditDialog from '@/components/ThreatEditDialog.vue';

import diagramService from '@/service/migration/diagram.js';
import stencilService from '@/service/x6/stencil.js';
import providerService from '@/service/provider/providers.js';
import tmActions from '@/store/actions/threatmodel.js';

describe('components/GraphButtons.vue', () => {
    let graphMock, localVue, routerMock, storeMock, threatEditStub, wrapper;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
        localVue.use(Vuex);
        
        graphMock = {
            toJSON: jest.fn().mockReturnValue({ cells: [] }),
            history: {
                on: jest.fn()
            }
        };
        routerMock = { push: jest.fn(), params: {} };
        diagramService.edit = jest.fn().mockReturnValue(graphMock);
        diagramService.dispose = jest.fn();
        stencilService.get = jest.fn();
        providerService.getProviderType = jest.fn();
        threatEditStub = {
            render: jest.fn(),
            methods: {
                editThreat: jest.fn()
            }
        };

        storeMock = new Vuex.Store({
            state: {
                provider: {
                    selected: 'github'
                },
                locale: {
                    locale: 'eng'
                },
                threatmodel: {
                    selectedDiagram: {
                        title: 'foo',
                        cells: []
                    }
                }
            },
            actions: {
                [tmActions.diagramSaved]: () => {}
            }
        });
        jest.spyOn(storeMock, 'dispatch');
        wrapper = shallowMount(TdGraph, {
            localVue,
            stubs: {
                'td-threat-edit-dialog': threatEditStub
            },
            store: storeMock,
            mocks: {
                $t: (t) => t,
                $toast: { info: jest.fn() },
                $route: routerMock,
                $router: routerMock
            },
        });
        jest.spyOn(wrapper.vm.$bvModal, 'msgBoxConfirm').mockResolvedValue(true);
    });

    it('has a stencil container', () => {
        expect(wrapper.findComponent({ ref: 'stencil_container' }).exists())
            .toEqual(true);
    });

    it('displays the graph title', () => {
        expect(wrapper.find('.td-graph-title').text())
            .toEqual('foo');
    });

    it('has the graph buttons', () => {
        expect(wrapper.findComponent(TdGraphButtons).exists())
            .toEqual(true);
    });

    it('has the graph meta component', () => {
        expect(wrapper.findComponent(TdGraphMeta).exists())
            .toEqual(true);
    });

    it('has the keyboard shortcuts modal', () => {
        expect(wrapper.findComponent(TdKeyboardShortcuts).exists())
            .toEqual(true);
    });

    it('has the threat edit modal dialog', () => {
        expect(wrapper.findComponent(TdThreatEditDialog).exists())
            .toEqual(true);
    });

    it('creates the stencil', () => {
        expect(stencilService.get).toHaveBeenCalled();
    });

    it('creates the diagram', () => {
        expect(diagramService.edit).toHaveBeenCalled();
    });

    it('shows the threat edit modal dialog', () => {
        wrapper.vm.threatSelected('asdf');
        expect(threatEditStub.methods.editThreat).toHaveBeenCalledWith('asdf');
    });

    it('saves the threat model diagram', () => {
        wrapper.vm.saved();
    });

    it.skip('closes the diagram if there were no changes', () => {
        wrapper.vm.closed();
        expect(routerMock.push)
            .toHaveBeenCalledWith({
                name: 'gitThreatModel',
                params: routerMock.params
            });
    });

    it.skip('prompts the user before closing if data has changed', () => {
        wrapper.setData({ diagram: { cells: [ 1, 2 ]}});
        storeMock.state.threatmodel.modified = true;
        wrapper.vm.closed();
        expect(wrapper.vm.$bvModal.msgBoxConfirm)
            .toHaveBeenCalled();
    });

    it.skip('does not close if the user selects no', () => {
        wrapper.vm.$bvModal.msgBoxConfirm.mockResolvedValue(false);
        wrapper.setData({ diagram: { cells: [ 1, 2 ]}});
        storeMock.state.threatmodel.modified = true;
        wrapper.vm.closed();
        expect(routerMock.push).not.toHaveBeenCalled();
    });

    it('disposes the graph', () => {
        wrapper.destroy();
        expect(diagramService.dispose).toHaveBeenCalled();
    });
});
