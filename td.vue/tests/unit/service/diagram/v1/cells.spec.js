import cells from '@/service/diagram/v1/cells.js';
import edges from '@/service/diagram/v1/edges.js';
import data from '@/service/diagram/v1/data.js';
import nodes from '@/service/diagram/v1/nodes.js';
import shapes from '@/service/x6/shapes/index.js';

describe('service/diagram/v1/cells.js', () => {
    let cell;

    const getEdge = (type) => ({
        type,
        source: {
            id: 'foobar'
        },
        target: {
            id: 'barbaz'
        }
    });

    beforeEach(() => {
        nodes.map = jest.fn().mockReturnValue(jest.fn());
        edges.map = jest.fn().mockReturnValue(jest.fn());
        data.map = jest.fn();
    });

    it('returns empty arrays if there is no diagram json', () => {
        expect(cells.map({})).toEqual({ nodes: [], edges: [] });
    });

    describe('actor', () => {
        beforeEach(() => {
            cell = { type: 'tm.Actor' };
            cells.map({ diagramJson: { cells: [ cell ]}});
        });

        it('calls the nodes mapper', () => {
            expect(nodes.map).toHaveBeenCalledWith(shapes.ActorShape);
        });

        it('adds the data', () => {
            expect(data.map).toHaveBeenCalledWith(undefined, cell);
        });
    });

    describe('boundary', () => {
        beforeEach(() => {
            cell = getEdge('tm.Boundary');
            data.map.mockReturnValue(cell);
            cells.map({ diagramJson: { cells: [ cell ]}});
        });

        it('calls the edges mapper', () => {
            expect(edges.map).toHaveBeenCalledWith(shapes.TrustBoundaryCurve);
        });

        it('adds the data', () => {
            expect(data.map).toHaveBeenCalledWith(undefined, cell);
        });
    });

    describe('flow', () => {
        beforeEach(() => {
            cell = getEdge('tm.Flow');
            data.map.mockReturnValue(cell);
            cells.map({ diagramJson: { cells: [ cell ]}});
        });

        it('calls the edges mapper', () => {
            expect(edges.map).toHaveBeenCalledWith(shapes.TrustBoundaryCurve);
        });

        it('adds the data', () => {
            expect(data.map).toHaveBeenCalledWith(undefined, cell);
        });
    });

    describe('process', () => {
        beforeEach(() => {
            cell = { type: 'tm.Process' };
            cells.map({ diagramJson: { cells: [ cell ]}});
        });

        it('calls the nodes mapper', () => {
            expect(nodes.map).toHaveBeenCalledWith(shapes.ActorShape);
        });

        it('adds the data', () => {
            expect(data.map).toHaveBeenCalledWith(undefined, cell);
        });
    });

    describe('store', () => {
        beforeEach(() => {
            cell = { type: 'tm.Store' };
            cells.map({ diagramJson: { cells: [ cell ]}});
        });

        it('calls the nodes mapper', () => {
            expect(nodes.map).toHaveBeenCalledWith(shapes.ActorShape);
        });

        it('adds the data', () => {
            expect(data.map).toHaveBeenCalledWith(undefined, cell);
        });
    });

    describe('without source and target ids', () => {
        beforeEach(() => {
            cell = getEdge('tm.Flow');
            delete cell.source.id;
            delete cell.target.id;
            data.map.mockReturnValue(cell);
            cells.map({ diagramJson: { cells: [ cell ]}});
        });

        it('calls the edges mapper', () => {
            expect(edges.map).toHaveBeenCalledWith(shapes.TrustBoundaryCurve);
        });

        it('adds the data', () => {
            expect(data.map).toHaveBeenCalledWith(undefined, cell);
        });
    });

    describe('relating edges', () => {
        let nodeSource, nodeTarget, res;

        beforeEach(() => {
            cell = getEdge('tm.Flow');
            nodeSource = { id: cell.source.id, type: 'tm.Process' };
            nodeTarget = { id: cell.target.id, type: 'tm.Actor' };
            data.map
                .mockReturnValueOnce(cell)
                .mockReturnValueOnce(nodeSource)
                .mockReturnValueOnce(nodeTarget);
            res = cells.map({ diagramJson: { cells: [ cell, nodeSource, nodeTarget ]}});
        });

        it('relates the source', () => {
            expect(res.edges[0].source).toEqual(nodeSource);
        });

        it('relates the target', () => {
            expect(res.edges[0].target).toEqual(nodeTarget);
        });
    });
});
