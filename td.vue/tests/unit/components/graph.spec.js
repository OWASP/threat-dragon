import { BootstrapVue } from 'bootstrap-vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import TdGraph from '@/components/Graph.vue';
import TdGraphButtons from '@/components/GraphButtons.vue';
import TdGraphMeta from '@/components/GraphMeta.vue';
import TdKeyboardShortcuts from '@/components/KeyboardShortcuts.vue';
import TdThreatEditDialog from '@/components/ThreatEditDialog.vue';

import diagramService from '@/service/diagram/diagram.js';
import stencilService from '@/service/x6/stencil.js';
import saveDiagram from '@/service/diagram/save.js';
import tmActions from '@/store/actions/threatmodel.js';
import analytics from '@/service/analytics.js';

jest.mock('@/service/diagram/save.js', () => ({
    __esModule: true,
    default: {
        save: jest.fn()
    }
}));
jest.mock('@/service/analytics.js', () => ({
    startEditing: jest.fn(),
    finishEditing: jest.fn(),
    track: jest.fn()
}));

describe('components/GraphButtons.vue', () => {
    let graphMock, localVue, routerMock, storeMock, threatEditStub, wrapper;

    const mountComponent = (provider = 'github', diagramType = 'STRIDE') => {
        storeMock = new Vuex.Store({
            state: {
                provider: {
                    selected: provider
                },
                locale: {
                    locale: 'en'
                },
                threatmodel: {
                    selectedDiagram: {
                        title: 'foo',
                        diagramType,
                        cells: []
                    }
                }
            },
            actions: {
                [tmActions.diagramSaved]: () => {},
                [tmActions.notModified]: () => {},
            }
        });
        jest.spyOn(storeMock, 'dispatch');

        return shallowMount(TdGraph, {
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
    };

    beforeEach(() => {
        saveDiagram.save.mockClear();
        analytics.startEditing.mockClear();
        analytics.finishEditing.mockClear();
        analytics.track.mockClear();
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
        localVue.use(Vuex);

        graphMock = {
            toJSON: jest.fn().mockReturnValue({ cells: [] }),
            history: {
                on: jest.fn()
            },
            getPlugin: jest.fn().mockReturnValue({ on: jest.fn() })
        };
        routerMock = { push: jest.fn(), params: {} };
        diagramService.edit = jest.fn().mockReturnValue(graphMock);
        diagramService.dispose = jest.fn();
        stencilService.get = jest.fn();
        threatEditStub = {
            render: jest.fn(),
            methods: {
                editThreat: jest.fn()
            }
        };
        wrapper = mountComponent();
        jest.spyOn(wrapper.vm.$bvModal, 'msgBoxConfirm').mockResolvedValue(true);
    });

    afterEach(() => {
        wrapper.destroy();
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

    it('starts an editing session', () => {
        expect(analytics.startEditing).toHaveBeenCalledTimes(1);
    });

    it.each([
        ['CIA', 'CIA'],
        ['DIE', 'CIADIE'],
        ['CIADIE', 'CIADIE'],
        ['LINDDUN', 'LINDDUN'],
        ['PLOT4ai', 'PLOT4AI'],
        ['STRIDE', 'STRIDE'],
        ['EOP', 'EOP'],
        ['Generic', 'GENERIC']
    ])('tracks %s when its diagram editor opens', (diagramType, methodology) => {
        wrapper.destroy();
        analytics.track.mockClear();
        wrapper = mountComponent('github', diagramType);

        expect(analytics.track).toHaveBeenCalledWith('DIAGRAM_METHODOLOGY_USED', { methodology });
    });

    it('shows the threat edit modal dialog', () => {
        wrapper.vm.threatSelected('asdf', 'new');
        expect(threatEditStub.methods.editThreat).toHaveBeenCalledWith('asdf', 'new');
    });

    it('uses the shared save service when saving', () => {
        wrapper.vm.saved();

        expect(saveDiagram.save).toHaveBeenCalledWith(storeMock, graphMock, storeMock.state.threatmodel.selectedDiagram);
    });

    it('ignores desktop save request events outside the desktop provider', () => {
        window.dispatchEvent(new CustomEvent('td-save-diagram-request'));

        expect(saveDiagram.save).not.toHaveBeenCalled();
    });

    it('uses the shared save service for desktop save request events on the desktop provider', () => {
        wrapper.destroy();
        wrapper = mountComponent('desktop');

        window.dispatchEvent(new CustomEvent('td-save-diagram-request'));

        expect(saveDiagram.save).toHaveBeenCalledWith(storeMock, graphMock, storeMock.state.threatmodel.selectedDiagram);
    });

    it('disposes the graph', () => {
        wrapper.destroy();
        expect(diagramService.dispose).toHaveBeenCalled();
    });

    it('finishes the editing session when the graph unmounts', () => {
        wrapper.destroy();
        expect(analytics.finishEditing).toHaveBeenCalledTimes(1);
    });
});
