import { generateThreats } from '../api/threatGenerator.js';
import { createNewTypedThreat } from './index.js';
import { tc } from '../../i18n/index.js';

/**
 * Translates a threat type to its corresponding STRIDE category.
 * @param {string} type - The type of the threat.
 * @returns {string} The translated STRIDE category.
 */
export function translate_to_stride(type) {
    switch (type) {
    case 'Spoofing':
        // Spoofing identity threats
        return tc('threats.model.stride.spoofing');
    case 'Tampering':
        // Tampering with data threats
        return tc('threats.model.stride.tampering');
    case 'Repudiation':
        // Repudiation threats
        return tc('threats.model.stride.repudiation');
    case 'Information disclosure':
        // Information disclosure threats
        return tc('threats.model.stride.informationDisclosure');
    case 'Denial of service':
        // Denial of service threats
        return tc('threats.model.stride.denialOfService');
    case 'Elevation of privilege':
        // Elevation of privilege threats
        return tc('threats.model.stride.elevationOfPrivilege');
    default:
        // Default to spoofing if type is unknown
        return tc('threats.model.stride.spoofing');
    }
}

/**
 * Retrieves the neighboring cells and connections for a given cell in a diagram.
 * @param {Object} cell - The cell for which neighbors are to be found.
 * @param {Object} diagram - The diagram containing all cells.
 * @returns {Object} An object containing the cell details and its connections.
 */
export function get_cell_neighbours(cell, diagram) {
    let results = {
        cell: {
            type: cell.shape,
            title: cell.data.name,
            description: cell.data.description
        },
        connections: []
    };

    if (cell.shape === 'flow') {
        // Handle the case where the cell is a data flow
        let sourceCellId = cell.source.cell;
        let targetCellId = cell.target.cell;

        // Find and add the source cell to connections
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

        // Find and add the target cell to connections
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
        // Handle the case where the cell is not a data flow
        diagram.cells.forEach((flow) => {
            if (flow.shape === 'flow' && (flow.source.cell === cell.id || flow.target.cell === cell.id)) {
                let connectedCellId = flow.source.cell === cell.id ? flow.target.cell : flow.source.cell;
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

/**
 * Creates threats using a language model based on the provided threat model, diagram, and cell.
 * @param {Object} threat_model - The threat model containing summary information.
 * @param {Object} diagram - The diagram containing cells and connections.
 * @param {Object} cell - The cell for which threats are to be generated.
 * @param {number} first_number - The starting number for threat numbering.
 * @param {Object} session - The session information for the API call.
 * @returns {Object} An object containing the generated threats and the status of the operation.
 */
export const createLlmThreats = async (threat_model, diagram, cell, first_number, session) => {
    // DEFINE VARIABLES
    let threat_model_data = {
        title: threat_model.summary.title,
        description: threat_model.summary.description
    };
    let diagram_data = {
        title: diagram.title,
        description: diagram.description
    };
    let cell_neighbours = get_cell_neighbours(cell, diagram);

    let threats = [];
    let threat_number = first_number;

    try {
        // GENERATE THREATS
        let res = await generateThreats(threat_model_data, diagram_data, cell.data, cell_neighbours, session);
        let gen_threats = res.data.threats;

        // HANDLE RESPONSE
        if (res.data.status === 200) {
            gen_threats.forEach((gen_threat) => {
                // CREATE BLANK THREAT
                let threat = createNewTypedThreat(diagram.diagramType, cell.data.type, threat_number);
                // UPDATE THREAT WITH DETAILS RETURNED
                threat.title = gen_threat.title;
                threat.description = gen_threat.description;
                threat.type = translate_to_stride(gen_threat.type);
                threat.severity = gen_threat.severity;
                threat.mitigation = gen_threat.mitigation;
                threat.score = gen_threat.score;
                // ADD TO RESPONSE
                threats.push(threat);
                threat_number += 1;
            });
        }

        // RETURN THREATS
        return {
            threats: threats,
            status: res.data.status
        };
    } catch (error) {
        console.error('Error generating threats:', error);
        return {
            threats: [],
            status: 500
        };
    }
};
