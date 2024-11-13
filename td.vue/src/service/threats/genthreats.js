import { generateThreats } from '../api/threatGenerator.js';
import { createNewTypedThreat } from './index.js'
import { tc } from '../../i18n/index.js';

function translate_to_stride(type) {
    switch (type) {
        case "Spoofing":
            return tc('threats.model.stride.spoofing');
        case "Tampering":
            return tc('threats.model.stride.tampering');
        case "Repudiation":
            return tc('threats.model.stride.repudiation');
        case "Information disclosure":
            return tc('threats.model.stride.informationDisclosure');
        case "Denial of service":
            return tc('threats.model.stride.denialOfService');
        case "Elevation of privilege":
            return tc('threats.model.stride.elevationOfPrivilege');
        default:
            return tc('threats.model.stride.spoofing');
    }
}

function get_cell_neighbours(cell, diagram) {
    let results = {
        cell: {
            type: cell.shape,
            title: cell.data.name,
            description: cell.data.description
        },
        connections: []
    };

    if (cell.shape === 'flow') {
        // Find the connected cells using source.cell and target.cell
        let sourceCellId = cell.source.cell;  // Assuming source.cell exists for DataFlow
        let targetCellId = cell.target.cell;  // Assuming target.cell exists for DataFlow

        // Find the source cell
        let sourceCell = diagram.cells.find(c => c.id === sourceCellId);
        if (sourceCell) {
            results.connections.push({
                connectedCell: {
                    title: sourceCell.data.name,
                    description: sourceCell.data.description,
                    isExternal: sourceCell.data.outOfScope
                }
            });
        }

        // Find the target cell
        let targetCell = diagram.cells.find(c => c.id === targetCellId);
        if (targetCell) {
            results.connections.push({
                connectedCell: {
                    title: targetCell.data.name,
                    description: targetCell.data.description,
                    type: targetCell.shape,
                    isExternal: targetCell.data.outOfScope
                }
            });
        }
    } else {
        // For other cell types, find all data flows that connect to this cell
        diagram.cells.forEach((flow) => {
            // Check if the cell is a flow and connected to the current cell
            if (flow.shape === 'flow' && (flow.source.cell === cell.id || flow.target.cell === cell.id)) {
                // Find the ID of the connected cell (either source or target)
                let connectedCellId = flow.source.cell === cell.id ? flow.target.cell : flow.source.cell;

                // Now find the actual cell with this ID (which should not be a flow)
                let connectedCell = diagram.cells.find(c => c.id === connectedCellId && c.shape !== 'flow');

                if (connectedCell) {
                    results.connections.push({
                        connectedCell: {
                            title: connectedCell.data.name,
                            description: connectedCell.data.description,
                            type: connectedCell.shape,
                            isExternal: connectedCell.data.outOfScope
                        },
                        dataFlow: {
                            title: flow.data.name,
                            description: flow.data.description,
                            type: flow.shape
                        }
                    });
                }
            }
        });
        }

    return results;
}



// export const createNewGeneratedThreatsForComponent = async (diagram, cell, start_number, session) => {
//     // DEFINE VARIABLES
//     let threats = [];
//     let threat;
//     let threat_number = start_number;

//     // GENERATE THREATS
//     let res = await generateThreatsForComponent(JSON.stringify(cell.data), session);
//     let gen_threats = res.data.threats;

//     // HANDLE RESPONSE
//     if (res.data.status == 200) {
//         gen_threats.forEach((gen_threat) => {
//             // CREATE BLANK THREAT
//             threat = createNewTypedThreat(diagram.diagramType, cell.data.type, threat_number);
//             // UPDATE THREAT WITH DETAILS RETURNED
//             threat.title = gen_threat.title;
//             threat.description = gen_threat.description;
//             threat.type = translate_to_stride(gen_threat.type);
//             threat.severity = gen_threat.severity;
//             threat.mitigation = gen_threat.mitigation;
//             threat.score = gen_threat.score;
//             // ADD TO RESPONSE
//             threats.push(threat)
//             threat_number = threat_number + 1;
//         });
//     }

//     // RETURN THREATS
//     // IN CASE OF ERROR WITH LLM, THREATS WILL BE EMPTY AND STATUS WILL BE 403, 500 etc.
//     return {
//         threats: threats,
//         status: res.data.status
//     };
// }

// export const createNewGeneratedThreatsForDiagram = async (threat_model_summary, diagram, cell, start_number, session) => {
//     // DEFINE VARIABLES
//     let threat_model_data = {
//         title: threat_model_summary.title,
//         description: threat_model_summary.description
//     }
//     let diagram_data = {
//         title: diagram.title,
//         description: diagram.description
//     }
//     let threat
//     let threats = []
//     let threat_number = start_number;

//     // GENERATE THREATS
//     let res = await generateThreatsForDiagram(JSON.stringify(threat_model_data), JSON.stringify(diagram_data), JSON.stringify(cell.data), session);
//     let gen_threats = res.data.threats;
    
//     // HANDLE RESPONSE
//     if (res.status == 200) {
//         gen_threats.forEach((gen_threat) => {
//             // CREATE BLANK THREAT
//             threat = createNewTypedThreat(diagram.diagramType, cell.data.type, threat_number);
//             // UPDATE THREAT WITH DETAILS RETURNED
//             threat.title = gen_threat.title;
//             threat.description = gen_threat.description;
//             threat.type = translate_to_stride(gen_threat.type);
//             threat.severity = gen_threat.severity;
//             threat.mitigation = gen_threat.mitigation;
//             threat.score = gen_threat.score;
//             // ADD TO RESPONSE
//             threats.push(threat)
//             threat_number = threat_number + 1;
//         });
//     }

//     // RETURN THREATS
//     // IN CASE OF ERROR WITH LLM, THREATS WILL BE EMPTY AND STATUS WILL BE 403, 500 etc.
//     return {
//         threats: threats,
//         status: res.data.status
//     };
// }

// export const createNewGeneratedThreatsForThreatModel = async (threat_model_summary, diagram, cell, start_number, session) => {
//     // DEFINE VARIABLES
//     let threat_model_data = {
//         title: threat_model_summary.title,
//         description: threat_model_summary.description
//     }
//     let diagram_data = {
//         title: diagram.title,
//         description: diagram.description
//     }
//     let threat
//     let threats = []
//     let threat_number = start_number;

//     // GENERATE THREATS
//     let res = await generateThreatsForThreatModel(threat_model_data, diagram_data, JSON.stringify(cell.data), session);
//     let gen_threats = res.data.threats;

//     // HANDLE RESPONSE
//     if (res.status == 200) {
//         gen_threats.forEach((gen_threat) => {
//             threat = createNewTypedThreat(diagram.diagramType, cell.type, threat_number);
//             // UPDATE THREAT HERE
//             threat.title = gen_threat.title;
//             threat.description = gen_threat.description;
//             threat.type = translate_to_stride(gen_threat.type);
//             threat.severity = gen_threat.severity;
//             threat.mitigation = gen_threat.mitigation;
//             threat.score = gen_threat.score;
//             // FINISH UPDATING
//             threats.push(threat)
//             threat_number = threat_number + 1;
//         });
//     }

//     // RETURN THREATS
//     // IN CASE OF ERROR WITH LLM, THREATS WILL BE EMPTY AND STATUS WILL BE 403, 500 etc.
//     return {
//         threats: threats,
//         status: res.data.status
//     };
// }

export const createLlmThreats = async (threat_model, diagram, cell, first_number, session) => {
    // DEFINE VARIABLES
    let threat_model_data = {
        title: threat_model.summary.title,
        description: threat_model.summary.description
    }
    let diagram_data = {
        title: diagram.title,
        description: diagram.description
    }
    let cell_neighbours = get_cell_neighbours(cell, diagram);

    let threat
    let threats = []
    let threat_number = first_number;

    // GENERATE THREATS
    let res = await generateThreats(threat_model_data, diagram_data, cell.data, cell_neighbours, session);
    let gen_threats = res.data.threats;
    
    // HANDLE RESPONSE
    if (res.status == 200) {
        gen_threats.forEach((gen_threat) => {
            // CREATE BLANK THREAT
            threat = createNewTypedThreat(diagram.diagramType, cell.data.type, threat_number);
            // UPDATE THREAT WITH DETAILS RETURNED
            threat.title = gen_threat.title;
            threat.description = gen_threat.description;
            threat.type = translate_to_stride(gen_threat.type);
            threat.severity = gen_threat.severity;
            threat.mitigation = gen_threat.mitigation;
            threat.score = gen_threat.score;
            // ADD TO RESPONSE
            threats.push(threat)
            threat_number = threat_number + 1;
        });
    }

    // RETURN THREATS
    // IN CASE OF ERROR WITH LLM, THREATS WILL BE EMPTY AND STATUS WILL BE 403, 500 etc.
    return {
        threats: threats,
        status: res.data.status
    };
}
