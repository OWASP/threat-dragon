import diagram from '@/service/diagram/diagram.js';
import events from '@/service/x6/graph/events.js';
import dataChanged from '@/service/x6/graph/data-changed.js';
import graphFactory from '@/service/x6/graph/graph.js';
import store from '@/store/index.js';

describe('service/diagram/diagram.js', () => {
    let diagramMock, graphMock, storeMock;
    const cellsMock = [ 'cell1' ];

    beforeEach(() => {
        diagramMock = {
            title: 'Test',
            description: 'Description',
            thumbnail: 'foo.png',
            id: '12345',
            diagramType: 'STRIDE',
            legacyField: true,
            version: '2.x'
        };
        graphMock = {
            once: jest.fn(),
            zoomToFit: jest.fn(),
            fromJSON: jest.fn(),
            toJSON: jest.fn().mockReturnValue(diagramMock),
            addNode: jest.fn(),
            addEdge: jest.fn(),
            getCells: jest.fn().mockReturnValue(cellsMock),
            startBatch: jest.fn(),
            stopBatch: jest.fn(),
            dispose: jest.fn()
        };
        storeMock = { dispatch: jest.fn() };
        graphFactory.getReadonlyGraph = jest.fn().mockReturnValue(graphMock);
        graphFactory.getEditGraph = jest.fn().mockReturnValue(graphMock);
        dataChanged.updateStyleAttrs = jest.fn();
        store.get = jest.fn().mockReturnValue(storeMock);
    });

    describe('draw', () => {
        it('gets the graph json', () => {
            diagram.draw(null, diagramMock);
            expect(graphMock.fromJSON).toHaveBeenCalledTimes(1);
        });

        it('does not change the readonly diagram framing', () => {
            diagram.draw(null, diagramMock);

            expect(graphMock.once).not.toHaveBeenCalled();
        });
    });

    describe('edit', () => {
        it('gets the edit graph', () => {
            diagram.edit(null, diagramMock);
            expect(graphFactory.getEditGraph).toHaveBeenCalledWith(null);
        });

        it('waits for cell rendering before fitting the drawing', () => {
            diagram.edit(null, diagramMock);

            expect(graphMock.zoomToFit).not.toHaveBeenCalled();
        });

        it('registers the initial fit once before importing cells', () => {
            graphMock.fromJSON.mockImplementation(() => {
                expect(graphMock.once).toHaveBeenCalledWith('render:done', expect.any(Function));
            });
            diagram.edit(null, diagramMock);
        });

        it('fits the rendered drawing including labels without enlarging it', () => {
            diagram.edit(null, diagramMock);
            graphMock.once.mock.calls[0][1]();

            expect(graphMock.zoomToFit).toHaveBeenCalledWith({
                padding: 30,
                maxScale: 1,
                useCellGeometry: false
            });
        });
    });

    describe('dispose', () => {
        beforeEach(() => {
            events.removeListeners = jest.fn();
            diagram.dispose(graphMock);
        });

        it('removes event listeners', () => {
            expect(events.removeListeners).toHaveBeenCalled();
        });

        it('disposes the graph', () => {
            expect(graphMock.dispose).toHaveBeenCalled();
        });
    });
});
