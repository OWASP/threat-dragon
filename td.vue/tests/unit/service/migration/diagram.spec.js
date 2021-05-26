
import diagram from '@/service/migration/diagram.js';
import { Actor } from '../../../../src/service/x6/shapes/actor';

describe('service/migration/diagram.js', () => {
    const size = { width: 100, height: 200 };
    const position = { x: 0, y: 5 };
    const id = 'myid';
    const zIndex = 2;
    const vertices = [{x:1, y:1}];

    const getV1Cell = () => ({
        diagramJson: {
            cells: [
                {
                    type: 'tm.Actor',
                    size,
                    position,
                    id,
                    z: zIndex,
                    attrs: {
                        text: {
                            text: 'foobar'
                        }
                    }
                }
            ]
        }
    });

    const getV1Edge = () => {
        const v1 = getV1Cell();
        v1.diagramJson.cells.push({
            type: 'tm.Flow',
            source: { id },
            target: { id },
            vertices,
            labels: [
                {
                    position,
                    attrs: { text: { text: 'foobar' }}
                }
            ]
        });
        return v1;
    };

    let edges, nodes;

    describe('cell with complete data', () => {
        beforeEach(() => {
            const res = diagram.mapDiagram(getV1Cell());
            edges = res.edges;
            nodes = res.nodes;
        });

        it('is a node', () => {
            expect(nodes.length).toEqual(1);
            expect(edges.length).toEqual(0);
        });

        it('maps the text attribute', () => {
            expect(nodes[0].getAttrs().text.text).toEqual('foobar');
        });

        it('maps the width and height', () => {
            expect(nodes[0].size()).toEqual(size);
        });

        it('maps the position', () => {
            expect(nodes[0].position()).toEqual(position);
        });

        it('sets the id', () => {
            expect(nodes[0].id).toEqual(id);
        });
        
        it('sets the z-index', () => {
            expect(nodes[0].zIndex).toEqual(zIndex);
        });
    });

    describe('cell with empty labels', () => {
        beforeEach(() => {
            const v1 = getV1Cell();
            delete v1.diagramJson.cells[0].attrs;
            const res = diagram.mapDiagram(v1);
            nodes = res.nodes;
        });

        it('uses the default text', () => {
            expect(nodes[0].getAttrs().text.text).toEqual('Actor');
        });
    });

    describe('cell missing attributes', () => {
        beforeEach(() => {
            const v1 = getV1Cell();
            delete v1.diagramJson.cells[0].attrs;
            const res = diagram.mapDiagram(v1);
            nodes = res.nodes;
        });

        it('uses the default text', () => {
            expect(nodes[0].getAttrs().text.text).toEqual('Actor');
        });
    });

    describe('edges using id ref', () => {
        beforeEach(() => {
            const v1 = getV1Edge();
            const res = diagram.mapDiagram(v1);
            edges = res.edges;
        });

        it('creates the edge', () => {
            expect(edges.length).toEqual(1);
        });

        it('maps the source', () => {
            expect(edges[0].source).toBeInstanceOf(Actor);
        });

        it('maps the target', () => {
            expect(edges[0].target).toBeInstanceOf(Actor);
        });

        it('maps the vertices', () => {
            expect(edges[0].vertices).toEqual(vertices);
        });

        it('uses the smooth connector', () => {
            expect(edges[0].connector).toEqual('smooth');
        });

        it('maps the labels', () => {
            expect(edges[0].labels[0].attrs.label.text).toEqual('foobar');
        });
    });

    describe('edge without labels, with absolute source/target', () => {
        const target = { x: 555, y: 333 };

        beforeEach(() => {
            const v1 = getV1Edge();
            delete v1.diagramJson.cells[1].labels;
            v1.diagramJson.cells[1].source = position;
            v1.diagramJson.cells[1].target = target;
            const res = diagram.mapDiagram(v1);
            edges = res.edges;
        });

        it('does not have a label', () => {
            expect(edges[0].labels.length).toEqual(0);
        });

        it('uses absolute position for source', () => {
            expect(edges[0].source).toEqual(position);
        });

        it('uses absolute position for source', () => {
            expect(edges[0].target).toEqual(target);
        });
    });

    describe('metadata', () => {
        const threats = [ 't1' ];
        beforeEach(() => {
            const v1 = getV1Cell();
            v1.diagramJson.cells[0].hasOpenThreats = true;
            v1.diagramJson.cells[0].outOfScope = true;
            v1.diagramJson.cells[0].threats = threats;
            const res = diagram.mapDiagram(v1);
            nodes = res.nodes;
        });

        it('adds the open threats property', () => {
            expect(nodes[0].data.hasOpenThreats).toEqual(true);
        });

        it('adds the threats', () => {
            expect(nodes[0].data.threats).toEqual(threats);
        });

        it('adds the out of scope property', () => {
            expect(nodes[0].data.outOfScope).toEqual(true);
        });

        it('adds the isEncrypted property', () => {
            expect(nodes[0].data.isEncrypted).toEqual(false);
        });

        it('adds the isPublicNetwork property', () => {
            expect(nodes[0].data.isPublicNetwork).toEqual(false);
        });

        it('adds the protocol property', () => {
            expect(nodes[0].data.protocol).toEqual('');
        });

        it('adds the isTrustBoundary property', () => {
            expect(nodes[0].data.isTrustBoundary).toEqual(false);
        });
    });

    describe('blank diagram', () => {
        beforeEach(() => {
            const res = diagram.mapDiagram({});
            nodes = res.nodes;
            edges = res.edges;
        });

        it('has no nodes', () => {
            expect(nodes.length).toEqual(0);
        });

        it('has no edges', () => {
            expect(edges.length).toEqual(0);
        });
    });
});
