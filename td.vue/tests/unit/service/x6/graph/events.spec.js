import events from '@/service/x6/graph/events.js';
import shapes from '@/service/x6/shapes/index.js';
import store from '@/store/index.js';
import dataChanged from '../../../../../src/service/x6/graph/data-changed';

describe('service/x6/graph/events.js', () => {
    let cell, node, edge, graph, mockStore;

    beforeEach(() => {
        console.log = jest.fn();
        mockStore = { dispatch: jest.fn() };
        store.get = jest.fn().mockReturnValue(mockStore);
        graph = {
            evts: {},
            off: jest.fn(),
            on: function(evt, cb) { this.evts[evt] = cb; },
            resetSelection: jest.fn()
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
            position: jest.fn().mockReturnValue({ x: 1, y: 2 })
        };
        cell.getData.mockImplementation(() => ({ name: 'test' }));
        node = {
            data: { isTrustBoundary: true }
        };
        edge = {};
    });

    describe('edge:connected', () => {
        describe('new edge', () => {
            beforeEach(() => {
                graph.on.mockImplementation((evt, fn) => fn({ isNew: true, edge, node, cell }));
                events.listen(graph);
            });

            it('listens to the event', () => {
                expect(graph.on).toHaveBeenCalledWith('edge:connected', expect.any(Function));
            });

            it('adds the smooth connector to the edge', () => {
                expect(edge.connector).toEqual('smooth');
            });
        });

        describe('old edge', () => {
            beforeEach(() => {
                graph.on.mockImplementation((evt, fn) => fn({ isNew: false, edge, node, cell }));
                events.listen(graph);
            });

            it('does not set the connector', () => {
                expect(edge.connector).toBeUndefined();
            });
        });
    });

    describe('edge:dblclick', () => {
        describe('select edge', () => {
            beforeEach(() => {
                graph.on.mockImplementation((evt, fn) => fn({ isNew: false, edge, node, cell }));
                events.listen(graph);
            });

            it('listens to the edge double click event', () => {
                expect(graph.on).toHaveBeenCalledWith('edge:dblclick', expect.any(Function));
            });

            it('listens to the edge move event', () => {
                expect(graph.on).toHaveBeenCalledWith('edge:move', expect.any(Function));
            });
        });
    });

    describe('removeCellTools', () => {
        describe('hasTools is true', () => {
            beforeEach(() => {
                cell.hasTools.mockImplementation(() => true);
                graph.on.mockImplementation((evt, fn) => fn({ isNew: false, edge, node, cell }));
                events.listen(graph);
            });

            it('calls removeTools', () => {
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
            beforeEach(() => {
                cell.hasTools.mockImplementation(() => false);
                graph.on.mockImplementation((evt, fn) => fn({ isNew: false, edge, node, cell }));
                events.listen(graph);
            });

            it('calls removeTools', () => {
                expect(cell.removeTools).not.toHaveBeenCalled();
            });
        });
    });

    describe('cell:mouseenter', () => {

        describe('isNode is true', () => {
            beforeEach(() => {
                cell.isNode.mockImplementation(() => true);
                graph.on.mockImplementation((evt, fn) => fn({ isNew: false, edge, node, cell }));
                events.listen(graph);
            });

            it('listens to the mouseenter event', () => {
                expect(graph.on).toHaveBeenCalledWith('cell:mouseenter', expect.any(Function));
            });

            it('adds the expected tools', () => {
                expect(cell.addTools).toHaveBeenCalledWith(['boundary', 'button-remove']);
            });
        });

        describe('isNode is false', () => {
            beforeEach(() => {
                cell.isNode.mockImplementation(() => false);
                graph.on.mockImplementation((evt, fn) => fn({ isNew: false, edge, node, cell }));
                events.listen(graph);
            });

            it('adds the expected tools', () => {
                expect(cell.addTools).toHaveBeenCalledWith(['boundary', 'button-remove', 'vertices', 'source-arrowhead', 'target-arrowhead']);
            });
        });
    });

    describe('cell:added', () => {
        beforeEach(() => {
            graph.addEdge = jest.fn().mockReturnValue(cell);
        });

        describe('not a trust boundary curve', () => {
            beforeEach(() => {
                cell.isNode.mockImplementation(() => true);
                cell.constructor = { name: 'other' };
                graph.on.mockImplementation((evt, fn) => fn({ isNew: false, edge, node, cell }));
                events.listen(graph);
            });

            it('listens to the cell added event', () => {
                expect(graph.on).toHaveBeenCalledWith('cell:added', expect.any(Function));
            });

            it('does not add an edge', () => {
                expect(graph.addEdge).not.toHaveBeenCalled();
            });
        });

        describe('a node without data', () => {
            beforeEach(() => {
                cell.convertToEdge = true;
                cell.isNode.mockImplementation(() => true);
                cell.constructor = { name: 'Store' };
                cell.type = shapes.StoreShape.prototype.type;
                if (cell.data) { delete cell.data; }
                cell.setData.mockImplementation((data) => cell.data = data);
                graph.on.mockImplementation((evt, fn) => fn({ isNew: false, edge, node, cell }));
                events.listen(graph);
            });

            it('does not add an edge', () => {
                expect(graph.addEdge).not.toHaveBeenCalled();
            });
        });

        describe('trust boundary curve', () => {
            beforeEach(() => {
                cell.convertToEdge = true;
                cell.isNode.mockImplementation(() => true);
                cell.constructor = { name: 'TrustBoundaryCurveStencil' };
                cell.type = shapes.TrustBoundaryCurveStencil.prototype.type;
                graph.on.mockImplementation((evt, fn) => fn({ isNew: false, edge, node, cell }));
                events.listen(graph);
            });

            it('gets the cell\'s position', () => {
                expect(cell.position).toHaveBeenCalledTimes(1);
            });

            it('adds the edge to the graph', () => {
                expect(graph.addEdge).toHaveBeenCalled();
            });

            it('removes the cell', () => {
                expect(cell.remove).toHaveBeenCalledTimes(1);
            });
        });

        describe('flow stencil', () => {
            beforeEach(() => {
                cell.convertToEdge = true;
                cell.isNode.mockImplementation(() => true);
                cell.constructor = { name: 'FlowStencil' };
                cell.type = shapes.FlowStencil.prototype.type;
                graph.on.mockImplementation((evt, fn) => fn({ isNew: false, edge, node, cell }));
                events.listen(graph);
            });

            it('gets the cell\'s position', () => {
                expect(cell.position).toHaveBeenCalledTimes(1);
            });

            it('adds the edge to the graph', () => {
                expect(graph.addEdge).toHaveBeenCalled();
            });

            it('removes the cell', () => {
                expect(cell.remove).toHaveBeenCalledTimes(1);
            });
        });

        describe('flow stencil without data', () => {
            beforeEach(() => {
                cell.convertToEdge = true;
                cell.isNode.mockImplementation(() => false);
                cell.isEdge.mockImplementation(() => true);
                cell.constructor = { name: 'FlowStencil' };
                cell.type = shapes.FlowStencil.prototype.type;
                if (cell.data) { delete cell.data; }
                dataChanged.updateStyleAttrs = jest.fn();
                cell.setData.mockImplementation((data) => cell.data = data);
                graph.on.mockImplementation((evt, fn) => fn({ isNew: false, edge, node, cell }));
                events.listen(graph);
            });

            it('gets the cell\'s position', () => {
                expect(cell.position).toHaveBeenCalledTimes(1);
            });

            it('adds the edge to the graph', () => {
                expect(graph.addEdge).toHaveBeenCalled();
            });

            it('removes the cell', () => {
                expect(cell.remove).toHaveBeenCalledTimes(1);
            });
        });

        describe('cell:unselected', () => {
            beforeEach(() => {
                cell.hasTools.mockImplementation(() => true);
                cell.setName = jest.fn();
                dataChanged.updateStyleAttrs = jest.fn();
                cell.getData.mockImplementation(() => ({ name: 'test' }));
                events.listen(graph);
                graph.evts['cell:unselected']({ cell });
            });

            it('listens to the cell unselected event', () => {
                expect(graph.on).toHaveBeenCalledWith('cell:unselected', expect.any(Function));
            });

            it('does not update the style attributes', () => {
                expect(dataChanged.updateStyleAttrs).toHaveBeenCalledTimes(0);
            });
        });

        describe('cell:selected', () => {
            beforeEach(() => {
                cell.hasTools.mockImplementation(() => true);
                cell.isNode.mockImplementation(() => false);
                events.listen(graph);
            });

            it('listens to the cell selected event', () => {
                expect(graph.on).toHaveBeenCalledWith('cell:selected', expect.any(Function));
            });

            describe('trust boundary', () => {
                beforeEach(() => {
                    cell.data.isTrustBoundary = true;
                    cell.getLabels.mockImplementation(() => ([
                        { attrs: { label: { text: 'test' }}}
                    ]));
                    events.listen(graph);
                    graph.evts['cell:selected']({ cell });
                });

                it('sets the name', () => {
                    expect(cell.data.name).toEqual('test');
                });
            });

            describe('edge', () => {
                beforeEach(() => {
                    cell.getLabels.mockImplementation(() => ([
                        { attrs: { label: { text: 'test' }}}
                    ]));
                    events.listen(graph);
                    graph.evts['cell:selected']({ cell });
                });

                it('sets the name', () => {
                    expect(cell.data.name).toEqual('test');
                });
            });

            describe('without getLabels', () => {
                it('does not set the name', () => {
                    delete cell.getLabels;
                    events.listen(graph);
                    graph.evts['cell:selected']({ cell });
                    expect(cell.data.name).toBeUndefined();
                });
            });
        });

        describe('node events', () => {
            beforeEach(() => {
                node.data.isTrustBoundary = true;
                graph.on.mockImplementation((evt, fn) => fn({ node, edge, cell }));
                events.listen(graph);
            });

            it('listens to the node double click event', () => {
                expect(graph.on).toHaveBeenCalledWith('node:dblclick', expect.any(Function));
            });

            it('listens to the node move event', () => {
                expect(graph.on).toHaveBeenCalledWith('node:move', expect.any(Function));
            });

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

        it('removes the cell:unselected listener again', () => {
            expect(graph.off).toHaveBeenCalledWith('cell:unselected', expect.anything());
        });

        it('removes the node:dblclick listener', () => {
            expect(graph.off).toHaveBeenCalledWith('node:dblclick', expect.anything());
        });

        it('removes the node:move listener', () => {
            expect(graph.off).toHaveBeenCalledWith('node:move', expect.anything());
        });

        it('removes the cell:added listener again', () => {
            expect(graph.off).toHaveBeenCalledWith('cell:added', expect.anything());
        });
    });
});
