import events from '@/service/x6/graph/events.js';
import shapes from '@/service/x6/shapes';
import store from '@/store/index.js';
import dataChanged from '../../../../../src/service/x6/graph/data-changed';

describe('service/x6/graph/events.js', () => {
    let cell, node, edge, graph, mockStore;

    beforeEach(() => {
        console.debug = jest.fn();
        console.log = jest.fn();
        console.warn = jest.fn();
        mockStore = { dispatch: jest.fn() };
        store.get = jest.fn().mockReturnValue(mockStore);
        graph = {
            evts: {},
            off: jest.fn(),
            on: function(evt, cb) { this.evts[evt] = cb; },
            addEdge: jest.fn(),
            resetSelection: jest.fn(),
            select: jest.fn()
        };
        jest.spyOn(graph, 'on');
        cell = {
            hasTools: jest.fn(),
            removeTools: jest.fn(),
            isNode: jest.fn(),
            isEdge: jest.fn(),
            addTools: jest.fn(),
            remove: jest.fn(),
            getData: jest.fn(),
            setData: jest.fn(),
            getLabel: jest.fn(),
            getLabels: jest.fn().mockReturnValue([]),
            data: {},
            id: 'foobar',
            position: jest.fn().mockReturnValue({ x: 1, y: 2 }),
            setLabels: jest.fn(),
            setName: jest.fn()
        };
        cell.getData.mockImplementation(() => ({ name: 'test' }));
        node = {
            data: { isTrustBoundary: true }
        };
        edge = {
            remove: jest.fn(),
            data: { name: 'edgeName' },
            constructor: { name: 'Edge' }
        };

        // Mock shapes
        shapes.Flow = {
            fromEdge: jest.fn().mockReturnValue({ data: { name: 'flowName' }, setLabels: jest.fn(), setName: jest.fn() })
        };

        // Set up DOM
        const container = document.createElement('div');
        container.id = 'graph-container';
        document.body.appendChild(container);

        // Add ports to test showPorts
        const port1 = document.createElement('div');
        port1.classList.add('x6-port-body');
        const port2 = document.createElement('div');
        port2.classList.add('x6-port-body');
        container.appendChild(port1);
        container.appendChild(port2);
    });

    afterEach(() => {
        // Clean up DOM
        const container = document.getElementById('graph-container');
        if (container && container.parentNode) {
            container.parentNode.removeChild(container);
        }
    });

    describe('edge:connected', () => {
        beforeEach(() => {
            events.listen(graph);
        });

        describe('new edge', () => {
            it('listens to the event', () => {
                expect(graph.on).toHaveBeenCalledWith('edge:connected', expect.any(Function));
            });

            it('replaces the edge with flow', () => {
                graph.evts['edge:connected']({ isNew: true, edge, node, cell });
                expect(graph.addEdge).toHaveBeenCalled();
                expect(edge.remove).toHaveBeenCalled();
            });
        });

        describe('old edge', () => {
            it('does not set the connector', () => {
                graph.evts['edge:connected']({ isNew: false, edge, node, cell });
                expect(edge.connector).toBeUndefined();
            });
        });
    });

    describe('edge:dblclick', () => {
        beforeEach(() => {
            events.listen(graph);
        });

        describe('select edge', () => {
            it('listens to the edge move event', () => {
                expect(graph.on).toHaveBeenCalledWith('edge:move', expect.any(Function));
            });
        });
    });

    describe('removeCellTools', () => {
        beforeEach(() => {
            events.listen(graph);
        });

        describe('hasTools is true', () => {
            it('calls removeTools', () => {
                cell.hasTools.mockImplementation(() => true);
                graph.evts['cell:mouseleave']({ cell });
                expect(cell.removeTools).toHaveBeenCalled();
            });

            it('listens to cell:mouseleave', () => {
                expect(graph.on).toHaveBeenCalledWith('cell:mouseleave', expect.any(Function));
            });

            it('listens to cell:unselected', () => {
                expect(graph.on).toHaveBeenCalledWith('cell:unselected', expect.any(Function));
            });

            it('listens to cell:change:data', () => {
                expect(graph.on).toHaveBeenCalledWith('cell:change:data', expect.any(Function));
            });
        });

        describe('hasTools is false', () => {
            it('does not call removeTools', () => {
                cell.hasTools.mockImplementation(() => false);
                graph.evts['cell:mouseleave']({ cell });
                expect(cell.removeTools).not.toHaveBeenCalled();
            });
        });
    });

    describe('cell:mouseenter', () => {
        beforeEach(() => {
            events.listen(graph);
        });

        it('listens to the cell:mouseenter event', () => {
            expect(graph.on).toHaveBeenCalledWith('cell:mouseenter', expect.any(Function));
        });

        describe('isNode is true', () => {
            it('adds the expected tools', () => {
                cell.isNode.mockImplementation(() => true);
                graph.evts['cell:mouseenter']({ cell });
                expect(cell.addTools).toHaveBeenCalledWith(['boundary', 'button-remove']);
            });
        });

        describe('isNode is false', () => {
            it('adds the expected tools', () => {
                cell.isNode.mockImplementation(() => false);
                graph.evts['cell:mouseenter']({ cell });
                expect(cell.addTools).toHaveBeenCalledWith(['boundary', 'button-remove', 'vertices', 'source-arrowhead', 'target-arrowhead']);
            });
        });
    });

    describe('cell:added', () => {
        beforeEach(() => {
            graph.addEdge = jest.fn().mockReturnValue(cell);
            events.listen(graph);
        });

        describe('not a flow or trust boundary curve', () => {
            beforeEach(() => {
                cell.shape = 'actor';
                cell.isNode.mockImplementation(() => true);
                cell.convertToEdge = false;
            });

            it('listens to the cell added event', () => {
                expect(graph.on).toHaveBeenCalledWith('cell:added', expect.any(Function));
            });

            it('does not add an edge', () => {
                graph.evts['cell:added']({ cell });
                expect(graph.addEdge).not.toHaveBeenCalled();
            });

            it('selects the cell', () => {
                graph.evts['cell:added']({ cell });
                expect(graph.select).toHaveBeenCalled();
            });
        });

        describe('trust boundary curve', () => {
            beforeEach(() => {
                cell.shape = 'path';
                cell.convertToEdge = true;
                cell.isNode.mockImplementation(() => true);
                cell.type = shapes.TrustBoundaryCurveStencil.prototype.type;
            });

            it('gets the cell\'s position', () => {
                graph.evts['cell:added']({ cell });
                expect(cell.position).toHaveBeenCalledTimes(1);
            });

            it('adds the edge to the graph', () => {
                graph.evts['cell:added']({ cell });
                expect(graph.addEdge).toHaveBeenCalled();
            });

            it('removes the cell', () => {
                graph.evts['cell:added']({ cell });
                expect(cell.remove).toHaveBeenCalledTimes(1);
            });

            it('does not select the cell', () => {
                graph.evts['cell:added']({ cell });
                expect(graph.select).not.toHaveBeenCalled();
            });
        });

        describe('unknown edge', () => {
            beforeEach(() => {
                cell.convertToEdge = true;
                cell.isNode.mockImplementation(() => true);
                cell.type = 'unknown';
            });

            it('warns about unknown edge', () => {
                graph.evts['cell:added']({ cell });
                expect(console.warn).toHaveBeenCalledWith('Unknown edge stencil');
            });
        });
    });

    describe('cell:unselected', () => {
        beforeEach(() => {
            cell.hasTools.mockImplementation(() => true);
            cell.setName = jest.fn();
            dataChanged.updateStyleAttrs = jest.fn();
            cell.getData.mockImplementation(() => ({ name: 'test' }));
            events.listen(graph);
        });

        it('listens to the cell unselected event', () => {
            expect(graph.on).toHaveBeenCalledWith('cell:unselected', expect.any(Function));
        });

        it('does not update the style attributes', () => {
            graph.evts['cell:unselected']({ cell });
            expect(dataChanged.updateStyleAttrs).toHaveBeenCalledTimes(0);
        });
    });

    describe('cell:selected', () => {
        beforeEach(() => {
            cell.hasTools.mockImplementation(() => true);
            events.listen(graph);
        });

        it('listens to the cell selected event', () => {
            expect(graph.on).toHaveBeenCalledWith('cell:selected', expect.any(Function));
        });

        describe('cell has data', () => {
            beforeEach(() => {
                cell.data = {};
            });

            describe('cell has data name', () => {
                beforeEach(() => {
                    cell.isNode.mockImplementation(() => false);
                    cell.data.name = 'Edge Name';
                });

                it('uses existing data name', () => {
                    graph.evts['cell:selected']({ cell });
                    expect(cell.data.name).toEqual('Edge Name');
                });
            });

            describe('cell does not have data name', () => {
                beforeEach(() => {
                    cell.isNode.mockImplementation(() => false);
                    cell.data.name = undefined;
                    cell.getLabels.mockReturnValue([{ attrs: { label: { text: 'Edge Label' } } }]);
                });

                it('sets the name from label', () => {
                    graph.evts['cell:selected']({ cell });
                    expect(cell.data.name).toEqual('Edge Label');
                });
            });

            describe('cell does not have data name nor labels', () => {
                beforeEach(() => {
                    cell.isNode.mockImplementation(() => false);
                    cell.data.name = undefined;
                    cell.getLabels.mockReturnValue([]);
                });

                it('name remains undefined', () => {
                    graph.evts['cell:selected']({ cell });
                    expect(cell.data.name).toBeUndefined();
                });
            });

            describe('cell does not have getLabels', () => {
                beforeEach(() => {
                    cell.isNode.mockImplementation(() => false);
                    cell.data.name = undefined;
                    delete cell.getLabels;
                });

                it('name remains undefined', () => {
                    graph.evts['cell:selected']({ cell });
                    expect(cell.data.name).toBeUndefined();
                });
            });
        });
    });

    describe('node events', () => {
        beforeEach(() => {
            node.data.isTrustBoundary = true;
            events.listen(graph);
        });

        it('listens to the node move event', () => {
            expect(graph.on).toHaveBeenCalledWith('node:move', expect.any(Function));
        });
    });

    describe('resize event', () => {
        beforeEach(() => {
            events.listen(graph);
        });

        it('listens to the resize event', () => {
            expect(graph.on).toHaveBeenCalledWith('resize', expect.any(Function));
        });

        it('handles the resize event', () => {
            const width = 800;
            const height = 600;
            graph.evts['resize']({ width, height });
            expect(console.debug).toHaveBeenCalledWith('canvas resized to width ', width, ' height ', height);
        });
    });

    describe('removeListeners', () => {
        beforeEach(() => {
            events.removeListeners(graph);
        });

        it('removes the edge:connected listener', () => {
            expect(graph.off).toHaveBeenCalledWith('edge:connected', expect.anything());
        });

        it('removes the edge:dblclick listener', () => {
            expect(graph.off).toHaveBeenCalledWith('edge:dblclick', expect.anything());
        });

        it('removes the edge:move listener', () => {
            expect(graph.off).toHaveBeenCalledWith('edge:move', expect.anything());
        });

        it('removes the cell:mouseleave listener', () => {
            expect(graph.off).toHaveBeenCalledWith('cell:mouseleave', expect.anything());
        });

        it('removes the cell:mouseenter listener', () => {
            expect(graph.off).toHaveBeenCalledWith('cell:mouseenter', expect.anything());
        });

        it('removes the cell:added listener', () => {
            expect(graph.off).toHaveBeenCalledWith('cell:added', expect.anything());
        });

        it('removes the cell:removed listener', () => {
            expect(graph.off).toHaveBeenCalledWith('cell:removed', expect.anything());
        });

        it('removes the cell:change:data listener', () => {
            expect(graph.off).toHaveBeenCalledWith('cell:change:data', expect.anything());
        });

        it('removes the cell:selected listener', () => {
            expect(graph.off).toHaveBeenCalledWith('cell:selected', expect.anything());
        });

        it('removes the cell:unselected listener', () => {
            expect(graph.off).toHaveBeenCalledWith('cell:unselected', expect.anything());
        });

        it('removes the node:move listener', () => {
            expect(graph.off).toHaveBeenCalledWith('node:move', expect.anything());
        });
    });
});

