import components from './components';
import dataflows from './dataflows';
import boxes from './boxes';

const merge = (model, otmId) => {
    const cells = [];
    let zIndexTrust = -1; // trust boundary boxes recede
    let zIndex = 0; // all others come forward

    model.components?.forEach((component) => {
        component.representations?.forEach((representation) => {
            if (representation.representation === otmId) {
                const cell = components.merge(model, component, representation);
                cell.zIndex = zIndex++;
                cells.push(cell);
            }
        });
    });

    const nodes = components.list(model, otmId).map(({ id }) => id);
    // OTM data flows are not associated with a representation so could be for some, all or none
    // so if a data flow has a source with a cell in this representation then include it
    model.dataflows?.forEach((dataflow) => {
        for (const cell of cells) {
            if (dataflow.source === cell.id) {
                const flow = dataflows.merge(model, dataflow);
                flow.zIndex = zIndex++;
                if (!nodes.includes(flow.target.cell)) {
                    console.warn('Target cell not found: ' + flow.target.cell);
                    // antv/x6 throws error if target is named but not found
                    flow.target.cell = '';
                }
                cells.push(flow);
                break;
            }
        }
    });

    model.trustZones?.forEach((trustZone) => {
        trustZone.representations?.forEach((representation) => {
            if (representation.representation === otmId) {
                const cell = boxes.merge(model, trustZone, representation);
                cell.zIndex = zIndexTrust--;
                cells.push(cell);
            }
        });
    });

    return cells;
};

export default {
    merge
};
