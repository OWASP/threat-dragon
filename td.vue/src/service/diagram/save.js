import {
    getElementsInsideBoundary,
    getBoundariesCrossedByFlow,
    getFlowsCrossedByBoundary
} from '@/service/boundary-utils.js';
import tmActions from '@/store/actions/threatmodel.js';

const enrichBoundaryAndFlowData = (graph) => {
    if (!graph || typeof graph.getCells !== 'function') {
        return;
    }

    try {
        const cells = graph.getCells();

        cells.forEach((boundary) => {
            try {
                if (boundary?.shape !== 'trust-boundary-box' && boundary?.shape !== 'trust-boundary-curve') {
                    return;
                }

                boundary.data = boundary.data || {};
                const contained = getElementsInsideBoundary(cells, boundary);
                boundary.data.containedElements = contained.map((element) => element.id);
                boundary.data.crossingFlows = getFlowsCrossedByBoundary(boundary, cells);
            } catch (error) {
                console.warn('Failed computing boundary data for a cell', error);
            }
        });

        cells.forEach((flow) => {
            try {
                if (flow?.shape !== 'flow') {
                    return;
                }

                flow.data = flow.data || {};
                flow.data.trustBoundaryIds = getBoundariesCrossedByFlow(flow, cells);
            } catch (error) {
                console.warn('Failed computing flow boundary ids for a cell', error);
            }
        });
    } catch (error) {
        console.error('Error while attaching boundary/flow data before save', error);
    }
};

const serialize = (graph, diagram) => {
    enrichBoundaryAndFlowData(graph);

    return {
        ...diagram,
        cells: graph?.toJSON?.().cells || diagram.cells || []
    };
};

const save = (store, graph, diagram) => {
    const updated = serialize(graph, diagram);
    store.dispatch(tmActions.diagramSaved, updated);
    store.dispatch(tmActions.saveModel);
    return updated;
};

export default {
    serialize,
    save
};
