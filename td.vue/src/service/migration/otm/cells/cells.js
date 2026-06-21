import properties from './properties';
import dataflows from './dataflows';
import boxes from './boxes';

// antv/x6 drawing package throws an error if the target of a flow is named but not present
/*const checkEdges = (dataflows, cells) => {
    const ids = [];
    for (const cell of cells) {
        ids.push(cell.id);
    }

    dataflows.forEach((dataflow) => {
        if (!ids.includes(dataflow.target.cell)) {
            console.warn('Target cell not found: ' + dataflow.target.cell);
            dataflow.target.cell = '';
        }
    });
};*/

const merge = (model, otmId) => {
    const cells = [];
    let zIndexTrust = -1; // trust boundary boxes recede
    let zIndex = 0; // all others come forward

    model.components?.forEach((component) => {
        component.representations?.forEach((representation) => {
            if (representation.representation === otmId) {
                const cell = properties.merge(component, representation);
                cell.zIndex = zIndex++;
                cells.push(cell);
            }
        });
    });

    // OTM data flows are not associated with a representation so could be for some, all or none
    // so if a data flow has a source with a cell in this representation then include it
    model.dataflows?.forEach((dataflow) => {
        for (const cell of cells) {
	        if (dataflow.source === cell.id) {
	            const flow = dataflows.merge(dataflow);
	            flow.zIndex = zIndex++;
	            cells.push(flow);
                break;
	        }
	    }
    });
	
    //	checkEdges(dataflows, cells);

    model.trustZones?.forEach((trustZone) => {
	    trustZone.representations?.forEach((representation) => {
	        if (representation.representation === otmId) {
	            const cell = boxes.merge(trustZone, representation);
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
