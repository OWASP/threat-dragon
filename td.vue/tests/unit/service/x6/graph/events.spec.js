import events from '@/service/x6/graph/events.js';

describe('service/x6/graph/events.js', () => {
    let cell, edge, graph;

    beforeEach(() => {
        graph = {
            on: jest.fn()
        };
        cell = {
            hasTools: jest.fn(),
            removeTools: jest.fn(),
            isNode: jest.fn(),
            addTools: jest.fn()
        };
        edge = {};
    });

    describe('edge:connected', () => {
        describe('new edge', () => {
            beforeEach(() => {
                graph.on.mockImplementation((evt, fn) => fn({ isNew: true, edge, cell }));
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
                graph.on.mockImplementation((evt, fn) => fn({ isNew: false, edge, cell }));
                events.listen(graph);
            });

            it('does not set the connector', () => {
                expect(edge.connector).toBeUndefined();
            });
        });
    });

    describe('removeCellTools', () => {
        describe('hasTools is true', () => {
            beforeEach(() => {
                cell.hasTools.mockImplementation(() => true);
                graph.on.mockImplementation((evt, fn) => fn({ isNew: false, edge, cell }));
                events.listen(graph);
            });

            it('calls removeTools', () => {
                expect(cell.removeTools).toHaveBeenCalled();
            });

            it('listens to cell:mouseleave', () => {
                expect(graph.on).toHaveBeenCalledWith('cell:mouseleave', expect.any(Function));
            });

            it('listens to cell:changed:position', () => {
                expect(graph.on).toHaveBeenCalledWith('cell:changed:position', expect.any(Function));
            });

            it('listens to cell:added', () => {
                expect(graph.on).toHaveBeenCalledWith('cell:added', expect.any(Function));
            });

            it('listens to cell:unselected', () => {
                expect(graph.on).toHaveBeenCalledWith('cell:unselected', expect.any(Function));
            });
        });

        describe('hasTools is false', () => {
            beforeEach(() => {
                cell.hasTools.mockImplementation(() => false);
                graph.on.mockImplementation((evt, fn) => fn({ isNew: false, edge, cell }));
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
                graph.on.mockImplementation((evt, fn) => fn({ isNew: false, edge, cell }));
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
                graph.on.mockImplementation((evt, fn) => fn({ isNew: false, edge, cell }));
                events.listen(graph);
            });

            it('adds the expected tools', () => {
                expect(cell.addTools).toHaveBeenCalledWith(['boundary', 'button-remove', 'vertices', 'source-arrowhead', 'target-arrowhead']);
            });
        });
    });
});
