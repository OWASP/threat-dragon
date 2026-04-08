import { v4 as uuidv4 } from 'uuid';

import edges from './edges.js';
import threats from '@/service/threats/index.js';

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
    isTrustBoundary: cell.type === 'tm.Boundary'
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

const map = (entity, cell) => {
    const data = getBaseData(cell);
    applyThreatData(cell, data);
    edges.applyData(cell, data);
    applyStoreData(cell, data);
    applyActorData(cell, data);

    entity.data = data;
    return entity;
};

export default {
    map
};
