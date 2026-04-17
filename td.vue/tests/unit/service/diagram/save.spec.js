import saveDiagram from '@/service/diagram/save.js';
import tmActions from '@/store/actions/threatmodel.js';
import * as boundaryUtils from '@/service/boundary-utils.js';

jest.mock('@/service/boundary-utils.js', () => ({
    __esModule: true,
    getElementsInsideBoundary: jest.fn(),
    getBoundariesCrossedByFlow: jest.fn(),
    getFlowsCrossedByBoundary: jest.fn()
}));

describe('service/diagram/save.js', () => {
    let diagram, graph, store;

    beforeEach(() => {
        diagram = {
            id: 1,
            title: 'Diagram',
            version: '2.6.0',
            cells: []
        };
        graph = {
            toJSON: jest.fn().mockReturnValue({
                cells: [{ id: 'actor-1', shape: 'actor', data: { threats: [{ title: 'Saved threat' }] } }]
            }),
            getCells: jest.fn().mockReturnValue([])
        };
        store = {
            dispatch: jest.fn()
        };
        boundaryUtils.getElementsInsideBoundary.mockReset();
        boundaryUtils.getBoundariesCrossedByFlow.mockReset();
        boundaryUtils.getFlowsCrossedByBoundary.mockReset();
    });

    describe('serialize', () => {
        it('copies the diagram and replaces cells with the current graph JSON', () => {
            const serialized = saveDiagram.serialize(graph, diagram);

            expect(serialized).not.toBe(diagram);
            expect(serialized.cells).toEqual([{ id: 'actor-1', shape: 'actor', data: { threats: [{ title: 'Saved threat' }] } }]);
            expect(serialized.title).toEqual(diagram.title);
        });

        it('continues serializing when boundary enrichment fails for a cell', () => {
            const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
            graph.getCells.mockReturnValue([
                { shape: 'trust-boundary-box', data: {} },
                { shape: 'flow', data: {} }
            ]);
            boundaryUtils.getElementsInsideBoundary.mockImplementation(() => {
                throw new Error('boundary failure');
            });
            boundaryUtils.getBoundariesCrossedByFlow.mockReturnValue(['tb-1']);

            const serialized = saveDiagram.serialize(graph, diagram);

            expect(serialized.cells).toEqual([{ id: 'actor-1', shape: 'actor', data: { threats: [{ title: 'Saved threat' }] } }]);
            expect(warnSpy).toHaveBeenCalledWith('Failed computing boundary data for a cell', expect.any(Error));
            warnSpy.mockRestore();
        });

        it('continues serializing when graph.getCells throws', () => {
            const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            graph.getCells.mockImplementation(() => {
                throw new Error('getCells failure');
            });

            const serialized = saveDiagram.serialize(graph, diagram);

            expect(serialized.cells).toEqual([{ id: 'actor-1', shape: 'actor', data: { threats: [{ title: 'Saved threat' }] } }]);
            expect(errorSpy).toHaveBeenCalledWith('Error while attaching boundary/flow data before save', expect.any(Error));
            errorSpy.mockRestore();
        });
    });

    describe('save', () => {
        it('dispatches diagramSaved with the serialized diagram', () => {
            saveDiagram.save(store, graph, diagram);

            expect(store.dispatch).toHaveBeenCalledWith(
                tmActions.diagramSaved,
                expect.objectContaining({
                    id: diagram.id,
                    title: diagram.title,
                    cells: [{ id: 'actor-1', shape: 'actor', data: { threats: [{ title: 'Saved threat' }] } }]
                })
            );
        });

        it('dispatches saveModel after diagramSaved', () => {
            saveDiagram.save(store, graph, diagram);

            expect(store.dispatch.mock.calls).toEqual([
                [
                    tmActions.diagramSaved,
                    expect.objectContaining({
                        id: diagram.id,
                        title: diagram.title
                    })
                ],
                [tmActions.saveModel]
            ]);
        });
    });
});
