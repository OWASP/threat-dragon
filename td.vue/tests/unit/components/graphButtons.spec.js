import { BootstrapVue } from 'bootstrap-vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import TdFormButton from '@/components/FormButton.vue';
import TdGraphButtons from '@/components/GraphButtons.vue';

describe('components/GraphButtons.vue', () => {
    let btn, graph, localVue, wrapper;

    beforeEach(() => {
        graph = {};
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
        localVue.use(Vuex);
        wrapper = shallowMount(TdGraphButtons, {
            localVue,
            mocks: {
                $t: (t) => t
            },
            propsData: {
                graph
            },
            store: new Vuex.Store({
                state: {
                    provider: {
                        selected: 'github'
                    }
                }
            })
        });
    });

    const getButtonByIcon = (icon) => wrapper.findAllComponents(TdFormButton)
        .filter(x => x.attributes('icon') === icon)
        .at(0);

    describe('save', () => {
        beforeEach(() => {
            btn = getButtonByIcon('save');
        });

        it('has the save translation text', () => {
            expect(btn.attributes('text')).toEqual('forms.save');
        });

        it('is not implemented yet', () => {
            wrapper.vm.$toast = { info: jest.fn() };
            wrapper.vm.notImplemented();
            expect(wrapper.vm.$toast.info).toHaveBeenCalledTimes(1);
        });
    });

    describe('close', () => {
        beforeEach(() => {
            btn = getButtonByIcon('times');
            wrapper.vm.$router = { push: jest.fn() };
            wrapper.vm.$route = { params: {} };
        });

        it('has the save translation text', () => {
            expect(btn.attributes('text')).toEqual('forms.close');
        });

        it('closes the diagram', () => {
            wrapper.vm.closeDiagram();
            expect(wrapper.vm.$router.push).toHaveBeenCalledWith(
                { name: 'gitThreatModel', params: {} }
            );
        });
    });

    describe('keyboard shortcuts', () => {
        beforeEach(() => {
            btn = getButtonByIcon('keyboard');
        });

        it('does not have any text', () => {
            expect(btn.attributes('text')).toEqual('');
        });

        it('is a noOp', () => {
            expect(() => wrapper.vm.noOp()).not.toThrow();
        });
    });

    describe('undo', () => {
        beforeEach(() => {
            btn = getButtonByIcon('undo');
        });

        it('does not have any text', () => {
            expect(btn.attributes('text')).toEqual('');
        });

        describe('graph can undo', () => {
            beforeEach(() => {
                graph.canUndo = () => true;
                graph.undo = jest.fn();
                wrapper.vm.undo();
            });

            it('calls undo', () => {
                expect(graph.undo).toHaveBeenCalledTimes(1);
            });
        });

        describe('graph cannot undo', () => {
            beforeEach(() => {
                graph.canUndo = () => false;
                graph.undo = jest.fn();
                wrapper.vm.undo();
            });

            it('calls undo', () => {
                expect(graph.undo).not.toHaveBeenCalled();
            });
        });
    });

    describe('redo', () => {
        beforeEach(() => {
            btn = getButtonByIcon('redo');
        });

        it('does not have any text', () => {
            expect(btn.attributes('text')).toEqual('');
        });

        describe('graph can redo', () => {
            beforeEach(() => {
                graph.canRedo = () => true;
                graph.redo = jest.fn();
                wrapper.vm.redo();
            });

            it('calls redo', () => {
                expect(graph.redo).toHaveBeenCalledTimes(1);
            });
        });

        describe('graph cannot redo', () => {
            beforeEach(() => {
                graph.canRedo = () => false;
                graph.redo = jest.fn();
                wrapper.vm.redo();
            });

            it('calls redo', () => {
                expect(graph.redo).not.toHaveBeenCalled();
            });
        });
    });

    describe('zoom in', () => {
        beforeEach(() => {
            btn = getButtonByIcon('search-plus');
        });

        it('does not have any text', () => {
            expect(btn.attributes('text')).toEqual('');
        });

        it('zooms in the graph', () => {
            graph.zoom = jest.fn();
            wrapper.vm.zoomIn();
            expect(graph.zoom).toHaveBeenCalledWith(0.2);
        });
    });

    describe('zoom out', () => {
        beforeEach(() => {
            btn = getButtonByIcon('search-minus');
        });

        it('does not have any text', () => {
            expect(btn.attributes('text')).toEqual('');
        });

        it('zooms out the graph', () => {
            graph.zoom = jest.fn();
            wrapper.vm.zoomOut();
            expect(graph.zoom).toHaveBeenCalledWith(-0.2);
        });
    });

    describe('delete', () => {
        beforeEach(() => {
            btn = getButtonByIcon('trash');
        });

        it('does not have any text', () => {
            expect(btn.attributes('text')).toEqual('');
        });

        it('removes the selected cells', () => {
            graph.getSelectedCells = jest.fn();
            graph.removeCells = jest.fn();
            wrapper.vm.deleteSelected();
            expect(graph.getSelectedCells).toHaveBeenCalled();
            expect(graph.removeCells).toHaveBeenCalled();
        });
    });

    describe('toggle grid', () => {
        beforeEach(() => {
            btn = getButtonByIcon('th');
        });

        it('does not have any text', () => {
            expect(btn.attributes('text')).toEqual('');
        });

        describe('hide', () => {
            beforeEach(() => {
                graph.hideGrid = jest.fn();
                graph.showGrid = jest.fn();
                wrapper.vm.toggleGrid();
            });

            it('hides the grid', () => {
                expect(graph.hideGrid).toHaveBeenCalledTimes(1);
            });

            describe('show', () => {
                it('shows the grid', () => {
                    wrapper.vm.toggleGrid();
                    expect(graph.showGrid).toHaveBeenCalledTimes(1);
                });
            });
        });
    });
});
