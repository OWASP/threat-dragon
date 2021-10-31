
import diagram from '@/service/migration/diagram.js';

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

    describe('trust boundary', () => {
        beforeEach(() => {
            const v1 = getV1Edge();
            v1.diagramJson.cells[1].type = 'tm.Boundary';
            v1.diagramJson.cells[1].labels[0].attrs.text.text = '';
            const res = diagram.mapDiagram(v1);
            edges = res.edges;
        });

        it('does not add default text', () => {
            expect(edges[0].labels[0].attrs.label.text).toEqual('');
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
            v1.diagramJson.cells[1].protocol = 'HTTPS';
            const res = diagram.mapDiagram(v1);
            edges = res.edges;
        });

        it('creates the edge', () => {
            expect(edges.length).toEqual(1);
        });

        it('maps the source', () => {
            expect(edges[0].source).toEqual({ cell: id });
        });

        it('maps the target', () => {
            expect(edges[0].target).toEqual({ cell: id });
        });

        it('maps the vertices', () => {
            expect(edges[0].vertices).toEqual(vertices);
        });

        it('uses the smooth connector', () => {
            expect(edges[0].connector).toEqual('smooth');
        });

        it('maps the labels', () => {
            expect(edges[0].labels[0].attrs.label.text).toContain('foobar');
        });

        it('adds the protocol to the edge label', () => {
            expect(edges[0].labels[0].attrs.label.text).toContain('(HTTPS)');
        });
    });

    describe('edge with label without protocol', () => {
        beforeEach(() => {
            const v1 = getV1Edge();
            const res = diagram.mapDiagram(v1);
            edges = res.edges;
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

    describe('process metaData', () => {
        describe('with privilegeLevel defined', () => {
            beforeEach(() => {
                const v1 = getV1Cell();
                v1.diagramJson.cells.push({
                    type: 'tm.Process',
                    privilegeLevel: 'foobar',
                    position: { x: 1, y: 0 },
                    size: { width: 20, height: 20 }
                });
                const res = diagram.mapDiagram(v1);
                nodes = res.nodes;
            });

            it('it has the privilegeLevel in the data', () => {
                const tdProcess = nodes.find(x => x.type === 'tm.Process');
                expect(tdProcess.data.privilegeLevel).toEqual('foobar');
            });
        });

        describe('with privilegeLevel undefined', () => {
            beforeEach(() => {
                const v1 = getV1Cell();
                v1.diagramJson.cells.push({
                    type: 'tm.Process',
                    position: { x: 1, y: 0 },
                    size: { width: 20, height: 20 }
                });
                const res = diagram.mapDiagram(v1);
                nodes = res.nodes;
            });

            it('it has an empty privilegeLevel', () => {
                const tdProcess = nodes.find(x => x.type === 'tm.Process');
                expect(tdProcess.data.privilegeLevel).toEqual('');
            });
        });
    });

    describe('store metadata', () => {
        describe('with the data defined', () => {
            let tdStore;

            beforeEach(() => {
                const v1 = getV1Cell();
                v1.diagramJson.cells.push({
                    type: 'tm.Store',
                    position: { x: 1, y: 0 },
                    size: { width: 20, height: 20 },
                    isALog: true,
                    storesCredentials: true,
                    isEncrypted: true,
                    isSigned: true,
                    threats: [{ type: 'Information disclosure', id: 'asdf' }]
                });
                const res = diagram.mapDiagram(v1);
                tdStore = res.nodes.find(x => x.type === 'tm.Store');
            });

            it('it is a log', () => {
                expect(tdStore.data.isALog).toEqual(true);
            });

            it('stores credentials', () => {
                expect(tdStore.data.storesCredentials).toEqual(true);
            });

            it('it is encrypted', () => {
                expect(tdStore.data.isEncrypted).toEqual(true);
            });

            it('it is signed', () => {
                expect(tdStore.data.isSigned).toEqual(true);
            });

            it('migrates the threat', () => {
                expect(tdStore.data.threats[0].modelType).toEqual('STRIDE');
            });
        });

        describe('with defaults only', () => {
            let tdStore;

            beforeEach(() => {
                const v1 = getV1Cell();
                v1.diagramJson.cells.push({
                    type: 'tm.Store',
                    position: { x: 1, y: 0 },
                    size: { width: 20, height: 20 },
                    threats: [{ type: 'Information disclosure' }]
                });
                const res = diagram.mapDiagram(v1);
                tdStore = res.nodes.find(x => x.type === 'tm.Store');
            });

            it('it is not a log', () => {
                expect(tdStore.data.isALog).toEqual(false);
            });

            it('does not store credentials', () => {
                expect(tdStore.data.storesCredentials).toEqual(false);
            });

            it('it is not encrypted', () => {
                expect(tdStore.data.isEncrypted).toEqual(false);
            });

            it('it is not signed', () => {
                expect(tdStore.data.isSigned).toEqual(false);
            });
        });
    });
});
