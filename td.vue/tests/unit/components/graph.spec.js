import { BootstrapVue } from 'bootstrap-vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import TdGraph from '@/components/Graph.vue';
import TdGraphButtons from '@/components/GraphButtons.vue';
import TdGraphMeta from '@/components/GraphMeta.vue';
import TdKeyboardShortcuts from '@/components/KeyboardShortcuts.vue';
import TdResizeHandle from '@/components/ResizeHandle.vue';
import TdThreatEditDialog from '@/components/ThreatEditDialog.vue';

import diagramService from '@/service/diagram/diagram.js';
import stencilService from '@/service/x6/stencil.js';
import saveDiagram from '@/service/diagram/save.js';
import tmActions from '@/store/actions/threatmodel.js';
import analytics, { methodologyForDiagramType } from '@/service/analytics.js';

jest.mock('@/service/diagram/save.js', () => ({
    __esModule: true,
    default: {
        save: jest.fn()
    }
}));
jest.mock('@/service/analytics.js', () => ({
    startEditing: jest.fn(),
    finishEditing: jest.fn(),
    track: jest.fn(),
    methodologyForDiagramType: jest.fn()
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
                [tmActions.diagramClosed]: () => {},
                [tmActions.notModified]: () => {},
            },
            getters: {
                modelChanged: (state) => !!state.threatmodel.modified
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
        methodologyForDiagramType.mockReturnValue('STRIDE');
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
        localVue.use(Vuex);

        graphMock = {
            resize: jest.fn(),
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

    it('places the graph height resize handle below the canvas', () => {
        expect(wrapper.find('.td-graph-canvas [data-resize="graph-height"]').exists())
            .toEqual(true);
    });

    it('gives the graph its own viewport host', () => {
        expect(wrapper.find('.td-graph-viewport #graph-container').exists()).toEqual(true);
    });

    it('labels the canvas resize handle separately from the stencil handle', () => {
        const handles = wrapper.findAllComponents(TdResizeHandle);

        expect(handles.at(1).props('label')).toEqual('Resize canvas height');
    });

    it('updates the graph height offset', async () => {
        wrapper.findAllComponents(TdResizeHandle).at(1).vm.$emit('resize', 100);
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.graphHeightOffset).toEqual(100);
    });

    it('updates the stencil width from its handle', async () => {
        wrapper.findAllComponents(TdResizeHandle).at(0).vm.$emit('resize', 80);
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.stencilOffset).toEqual(80);
    });

    it('applies the stencil offset after bounding the responsive starting width', async () => {
        await wrapper.vm.resizeStencilWidth(80);

        expect(wrapper.element.style.getPropertyValue('--stencil-width'))
            .toEqual('max(160px, calc(clamp(160px, 22%, 480px) + 80px))');
    });

    it('allows the canvas height to grow beyond the responsive starting height', async () => {
        await wrapper.vm.resizeCanvasHeight(100);

        expect(wrapper.element.style.getPropertyValue('--graph-height'))
            .toEqual('max(320px, calc(max(320px, 65vh) + 100px))');
    });

    it('resizes X6 to the viewport during a height drag without waiting for release', async () => {
        Object.defineProperties(wrapper.vm.$refs.graph_viewport, {
            clientWidth: { value: 600 },
            clientHeight: { value: 500 }
        });
        wrapper.findAllComponents(TdResizeHandle).at(1).vm.$emit('resize', 100);
        await wrapper.vm.$nextTick();

        expect(graphMock.resize).toHaveBeenCalledWith(600, 500);
    });

    it('reads the updated viewport dimensions after Vue applies the height', async () => {
        Object.defineProperties(wrapper.vm.$refs.graph_viewport, {
            clientWidth: { value: 600 },
            clientHeight: { get: () => 400 + wrapper.vm.graphHeightOffset }
        });
        await wrapper.vm.resizeCanvasHeight(-80);

        expect(graphMock.resize).toHaveBeenCalledWith(600, 320);
    });

    it('resizes X6 during a width drag without waiting for release', async () => {
        Object.defineProperties(wrapper.vm.$refs.graph_viewport, {
            clientWidth: { value: 600 },
            clientHeight: { value: 500 }
        });
        wrapper.findAllComponents(TdResizeHandle).at(0).vm.$emit('resize', 80);
        await wrapper.vm.$nextTick();

        expect(graphMock.resize).toHaveBeenCalledWith(600, 500);
    });

    it.each([80, -80])('reads the updated viewport after a width change of %i', async (offset) => {
        Object.defineProperties(wrapper.vm.$refs.graph_viewport, {
            clientWidth: { get: () => 600 - wrapper.findAllComponents(TdResizeHandle).at(0).props('value') },
            clientHeight: { value: 500 }
        });
        await wrapper.vm.resizeStencilWidth(offset);

        expect(graphMock.resize).toHaveBeenCalledWith(600 - offset, 500);
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

    it('tracks diagram modifications from history changes', () => {
        const cells = [{ id: 'process' }];
        graphMock.toJSON.mockReturnValue({ cells });
        graphMock.getPlugin('history').on.mock.calls[0][1]();

        expect(storeMock.dispatch).toHaveBeenCalledWith(tmActions.diagramModified, {
            ...storeMock.state.threatmodel.selectedDiagram,
            cells
        });
    });

    it('opens the requested threat suggestions', () => {
        const showModal = jest.fn();
        TdGraph.methods.threatSuggest.call({ $refs: { threatSuggestDialog: { showModal } } }, 'type');

        expect(showModal).toHaveBeenCalledWith('type');
    });

    it('closes an unmodified diagram without prompting', async () => {
        await wrapper.vm.closed();

        expect(wrapper.vm.$bvModal.msgBoxConfirm).not.toHaveBeenCalled();
    });

    it('returns to the model after confirming unsaved changes', async () => {
        storeMock.state.threatmodel.modified = true;
        await wrapper.vm.closed();

        expect(routerMock.push).toHaveBeenCalledWith({
            name: `${wrapper.vm.providerType}ThreatModel`,
            params: routerMock.params
        });
    });

    it('keeps the diagram open when discarding changes is cancelled', async () => {
        storeMock.state.threatmodel.modified = true;
        wrapper.vm.$bvModal.msgBoxConfirm.mockResolvedValue(false);
        await wrapper.vm.closed();

        expect(routerMock.push).not.toHaveBeenCalled();
    });

    it('ignores desktop saves when the graph is not initialized', () => {
        wrapper.vm.graph = null;
        wrapper.vm.handleDesktopSaveRequest();

        expect(saveDiagram.save).not.toHaveBeenCalled();
    });

    it('starts an editing session', () => {
        expect(analytics.startEditing).toHaveBeenCalledWith('diagram');
    });

    it('uses the analytics methodology mapping when its diagram editor opens', () => {
        wrapper.destroy();
        methodologyForDiagramType.mockClear();
        wrapper = mountComponent('github', 'CIA');

        expect(methodologyForDiagramType).toHaveBeenCalledWith('CIA');
    });

    it('tracks the mapped methodology when its diagram editor opens', () => {
        wrapper.destroy();
        analytics.track.mockClear();
        methodologyForDiagramType.mockReturnValue('CIA');
        wrapper = mountComponent('github', 'CIA');

        expect(analytics.track).toHaveBeenCalledWith('DIAGRAM_METHODOLOGY_USED', { methodology: 'CIA' });
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
