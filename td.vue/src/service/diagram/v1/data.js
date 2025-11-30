import { v4 as uuidv4 } from 'uuid';

import edges from './edges.js';
import threats from '@/service/threats/index.js';
import {
    getElementsInsideBoundary,
    getBoundariesCrossedByFlow,
    getFlowsCrossedByBoundary
} from '../../boundary-utils.js';

const getName = (cell) => {
    if (cell.name) return cell.name;
    if (cell.attrs && cell.attrs.text && cell.attrs.text.text) return cell.attrs.text.text;
    if (cell.labels && cell.labels[0].attrs && cell.labels[0].attrs.text && cell.labels[0].attrs.text.text) return cell.labels[0].attrs.text.text;
    return '';
};

const getBaseData = (cell) => ({
    name: getName(cell),
    description: cell.description || '',
    type: cell.type,
    isTrustBoundary: cell.type === 'tm.Boundary' || cell.type === 'tm.BoundaryBox'
});

const applyThreatData = (cell, data) => {
    if (!data.isTrustBoundary) {
        data.outOfScope = !!cell.outOfScope;
        data.reasonOutOfScope = cell.reasonOutOfScope || '';
        data.threats = cell.threats || [];
        if (data.threats.length) {
            data.threats.forEach((threat) => {
                if (cell.modelType) {
                    threat.modelType = cell.modelType;
                }
                else {
                    threat.modelType = threats.getModelByTranslation(
                        threats.convertToTranslationString(threat.type)
                    );
                }
                if (!threat.id) {
                    threat.id = uuidv4();
                }
            });
        }
        data.hasOpenThreats = threats.hasOpenThreats(data);
    }
};

const applyStoreData = (cell, data) => {
    if (data.type === 'tm.Store') {
        data.isALog = !!cell.isALog;
        data.storesCredentials = !!cell.storesCredentials;
        data.isEncrypted = !!cell.isEncrypted;
        data.isSigned = !!cell.isSigned;
    }
};

const applyActorData = (cell, data) => {
    if (data.type === 'tm.Actor') {
        data.providesAuthentication = !!cell.providesAuthentication;
    }
};

const applyBoundaryData = (cell, data) => {
    if (data.isTrustBoundary) {
        // Avoid querying the live graph here (graph may not yet exist when mapping v1 cells).
        // Use any existing fields on the v1 cell (or nested data) if present, otherwise default to empty arrays.
        data.crossingFlows = cell.crossingFlows || (cell.data && cell.data.crossingFlows) || [];
        data.containedElements = (cell.containedElements && cell.containedElements.slice()) || (cell.data && cell.data.containedElements) || [];
    }
};

const applyFlowData = (cell, data) => {
    if (data.type === 'tm.Flow') {
        // Avoid querying the live graph here. Prefer any existing v1 fields or nested data.
        data.trustBoundaryIds = cell.trustBoundaryIds || (cell.data && cell.data.trustBoundaryIds) || [];
    }
};

const map = (entity, cell) => {
    const data = getBaseData(cell);
    applyThreatData(cell, data);
    edges.applyData(cell, data);
    applyStoreData(cell, data);
    applyActorData(cell, data);
    applyBoundaryData(cell, data);
    applyFlowData(cell, data);

    entity.data = data;
    return entity;
};

export default {
    map
};
