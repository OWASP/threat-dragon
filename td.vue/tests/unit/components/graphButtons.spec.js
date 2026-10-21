import { BootstrapVue } from 'bootstrap-vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import TdDropdown from '@/components/Dropdown.vue';
import TdFormButton from '@/components/FormButton.vue';
import TdGraphButtons from '@/components/GraphButtons.vue';
import analytics from '@/service/analytics.js';

jest.mock('@/service/analytics.js', () => ({
    track: jest.fn()
}));

describe('components/GraphButtons.vue', () => {
    let btn, graph, localVue, wrapper, mockUndo, mockRedo, mockCanUndo, mockCanRedo;

    beforeEach(() => {
        mockUndo = jest.fn();
        mockRedo = jest.fn();
        mockCanUndo = jest.fn().mockReturnValue(true);
        mockCanRedo = jest.fn().mockReturnValue(true);
        analytics.track.mockClear();
        graph = {
            history: {},
            getPlugin: (name) => {
                if (name === 'history') {
                    return {
                        canUndo: mockCanUndo,
                        canRedo: mockCanRedo,
                        undo: mockUndo,
                        redo: mockRedo
                    };
                }
            }
        };
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
        localVue.use(Vuex);
        wrapper = shallowMount(TdGraphButtons, {
            localVue,
            stubs: {
                TdDropdown: false
            },
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
                    },
                    threatmodel: {
                        selectedDiagram: { title: 'Test diagram' }
                    }
                }
            })
        });
    });

    afterEach(() => {
        wrapper.destroy();
        jest.useRealTimers();
        jest.resetAllMocks();
    });

    const getButtonByIcon = (icon) =>
        wrapper
            .findAllComponents(TdFormButton)
            .filter((x) => x.attributes('icon') === icon)
            .at(0);

    describe('save', () => {
        beforeEach(() => {
            btn = getButtonByIcon('save');
            wrapper.vm.save();
        });

        it('has the save translation text', () => {
            expect(btn.attributes('text')).toEqual('forms.save');
        });
    });

    describe('close', () => {
        beforeEach(() => {
            btn = getButtonByIcon('times');
            wrapper.vm.closeDiagram();
        });

        it('has the save translation text', () => {
            expect(btn.attributes('text')).toEqual('forms.close');
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
                wrapper.vm.undo();
            });

            it('calls undo', () => {
                expect(mockUndo).toHaveBeenCalledTimes(1);
            });
        });

        describe('graph cannot undo', () => {
            beforeEach(() => {
                mockCanUndo = jest.fn().mockReturnValue(false);
                wrapper.vm.undo();
            });

            it('does not call undo', () => {
                expect(mockUndo).not.toHaveBeenCalled();
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
                wrapper.vm.redo();
            });

            it('calls redo', () => {
                expect(mockRedo).toHaveBeenCalledTimes(1);
            });
        });

        describe('graph cannot redo', () => {
            beforeEach(() => {
                mockCanRedo = jest.fn().mockReturnValue(false);
                wrapper.vm.redo();
            });

            it('calls redo', () => {
                expect(mockRedo).not.toHaveBeenCalled();
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

        it('zooms in by a smaller increment below full scale', () => {
            graph.zoom = jest.fn().mockReturnValue(0.5);
            wrapper.vm.zoomIn();
            expect(graph.zoom).toHaveBeenCalledWith(0.1);
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

        it('zooms out by a smaller increment below full scale', () => {
            graph.zoom = jest.fn().mockReturnValue(0.5);
            wrapper.vm.zoomOut();
            expect(graph.zoom).toHaveBeenCalledWith(-0.1);
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

    describe('export', () => {
        beforeEach(async () => {
            jest.useFakeTimers();
            graph.zoom = jest.fn().mockReturnValue(0.5);
            graph.zoomTo = jest.fn();
            graph.exportPNG = jest.fn();
            graph.exportSVG = jest.fn();
            graph.getSelectedCells = jest.fn().mockReturnValue([]);
            graph.cleanSelection = jest.fn();
            graph.select = jest.fn();
            graph.getContentBBox = jest.fn().mockReturnValue({ x: 1454, y: 900, width: 400, height: 200 });
            btn = wrapper
                .findAllComponents(TdDropdown)
                .filter((x) => x.attributes('id') === 'export-graph-btn')
                .at(0);
            await btn.find('.td-dropdown-toggle').trigger('click');
        });

        it('has the export translation text', () => {
            expect(btn.attributes('text')).toEqual('forms.export');
        });

        it('right aligns the export menu', () => {
            expect(btn.attributes('right')).toEqual('true');
        });

        it('uses the secondary variant', () => {
            expect(btn.attributes('variant')).toEqual('secondary');
        });

        it('has a dropdown item for PNG', () => {
            expect(btn.find('#export-graph-png').exists()).toBe(true);
        });

        it('has a dropdown item for SVG', () => {
            expect(btn.find('#export-graph-svg').exists()).toBe(true);
        });

        const exportDiagram = (format) => {
            const pending = wrapper.vm[`export${format}`]();
            jest.advanceTimersByTime(100);
            return pending;
        };

        it('lets the PNG exporter calculate its padded bounds', async () => {
            await exportDiagram('PNG');
            expect(graph.exportPNG).toHaveBeenCalledWith('Test diagram.png', { padding: 50 });
        });

        it('uses the translated content bounds for SVG', async () => {
            await exportDiagram('SVG');
            expect(graph.exportSVG).toHaveBeenCalledWith('Test diagram.svg', {
                viewBox: { x: 1454, y: 900, width: 400, height: 200 }
            });
        });

        it('measures SVG bounds after normalizing the export zoom', async () => {
            await exportDiagram('SVG');
            expect(graph.zoomTo.mock.invocationCallOrder[0]).toBeLessThan(graph.getContentBBox.mock.invocationCallOrder[0]);
        });

        describe.each(['PNG', 'SVG'])('%s', (format) => {
            it('exports through the dropdown item click', async () => {
                await btn.find(`#export-graph-${format.toLowerCase()}`).trigger('click');
                jest.advanceTimersByTime(100);
                await wrapper.vm.$nextTick();
                expect(graph[`export${format}`]).toHaveBeenCalledWith(
                    `Test diagram.${format.toLowerCase()}`,
                    format === 'PNG' ? { padding: 50 } : { viewBox: graph.getContentBBox.mock.results[0].value }
                );
            });

            it('closes the dropdown after choosing the format', async () => {
                await btn.find(`#export-graph-${format.toLowerCase()}`).trigger('click');
                jest.advanceTimersByTime(100);
                await wrapper.vm.$nextTick();
                expect(btn.find('.td-dropdown-menu').exists()).toBe(false);
            });

            it('tracks the format without its file name', async () => {
                await exportDiagram(format);
                expect(analytics.track).toHaveBeenCalledWith('DIAGRAM_EXPORTED', { format });
            });

            it('waits for the selection highlight to clear before exporting', async () => {
                const pending = wrapper.vm[`export${format}`]();
                const exportedBeforeRender = graph[`export${format}`].mock.calls.length;
                jest.advanceTimersByTime(100);
                await pending;
                expect(exportedBeforeRender).toBe(0);
            });

            it('clears the selection before exporting', async () => {
                await exportDiagram(format);
                expect(graph.cleanSelection).toHaveBeenCalledTimes(1);
            });

            it('does not select cells when the original selection was empty', async () => {
                await exportDiagram(format);
                expect(graph.select).not.toHaveBeenCalled();
            });

            it('restores the original selection', async () => {
                const cells = [{ id: 'selected-cell' }];
                graph.getSelectedCells.mockReturnValue(cells);
                await exportDiagram(format);
                expect(graph.select).toHaveBeenCalledWith(cells);
            });

            it('restores the original zoom', async () => {
                await exportDiagram(format);
                expect(graph.zoomTo.mock.calls).toEqual([[1], [0.5]]);
            });

            it('propagates an export failure', async () => {
                graph[`export${format}`].mockImplementation(() => { throw new Error('Export failed'); });
                await expect(exportDiagram(format)).rejects.toThrow('Export failed');
            });

            it('restores the zoom after an export failure', async () => {
                graph[`export${format}`].mockImplementation(() => { throw new Error('Export failed'); });
                await exportDiagram(format).catch(() => {});
                expect(graph.zoomTo).toHaveBeenLastCalledWith(0.5);
            });

            it('restores the selection after an export failure', async () => {
                const cells = [{ id: 'selected-cell' }];
                graph.getSelectedCells.mockReturnValue(cells);
                graph[`export${format}`].mockImplementation(() => { throw new Error('Export failed'); });
                await exportDiagram(format).catch(() => {});
                expect(graph.select).toHaveBeenCalledWith(cells);
            });

            it('does not track a failed export', async () => {
                graph[`export${format}`].mockImplementation(() => { throw new Error('Export failed'); });
                await exportDiagram(format).catch(() => {});
                expect(analytics.track).not.toHaveBeenCalled();
            });
        });
    });
});
