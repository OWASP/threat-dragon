import { v4 } from 'uuid';

import models from './models/index.js';
import { tc } from '../../i18n/index.js';

const valuesToTranslations = {
    'Confidentiality': 'threats.model.cia.confidentiality',
    'Integrity': 'threats.model.cia.integrity',
    'Availability': 'threats.model.cia.availability',
    'Linkability': 'threats.model.linddun.linkability',
    'Identifiability': 'threats.model.linddun.identifiability',
    'Non-repudiation': 'threats.model.linddun.nonRepudiation',
    'Detectability': 'threats.model.linddun.detectability',
    'Disclosure of information': 'threats.model.linddun.disclosureOfInformation',
    'Unawareness': 'threats.model.linddun.unawareness',
    'Non-compliance': 'threats.model.linddun.nonCompliance',
    'Spoofing': 'threats.model.stride.spoofing',
    'Tampering': 'threats.model.stride.tampering',
    'Repudiation': 'threats.model.stride.repudiation',
    'Information disclosure': 'threats.model.stride.informationDisclosure',
    'Denial of service': 'threats.model.stride.denialOfService',
    'Elevation of privilege': 'threats.model.stride.elevationOfPrivilege'
};

const convertToTranslationString = (val) => valuesToTranslations[val];

export const createNewTypedThreat = function(modelType) {
    if (!modelType) {
        modelType = 'STRIDE';
    }
    let title, type;

    switch (modelType) {
    case 'CIA':
        title = tc('threats.generic.cia');
        type = tc('threats.model.cia.confidentiality');
        break;
    case 'LINDDUN':
        title = tc('threats.generic.linddun');
        type = tc('threats.model.linddun.linkability');
        break;
    case 'STRIDE':
        title = tc('threats.generic.stride');
        type = tc('threats.model.stride.tampering');
        break;
    default:
        title = tc('threats.generic.default');
        type = tc('threats.model.stride.tampering');
        break;
    }

    return {
        id: v4(),
        title: title,
        status: 'Open',
        severity: 'Medium',
        type: type,
        description: tc('threats.description'),
        mitigation: tc('threats.mitigation'),
        modelType: modelType
    };
};

const hasOpenThreats = (data) => !!data && !!data.threats &&
    data.threats.filter(x => x.status.toLowerCase() === 'open').length > 0;

const filter = (diagrams, filters) => {
    return diagrams
        .flatMap(x => x.cells)
        .filter(x => !!x.data && !!x.data.threats)
        .flatMap(x => x.data.threats)
        .filter(x => filterForDiagram(x, filters))
        .filter(x => !!x);
};

const filterForDiagram = (data, filters) => {
    if (!filters.showOutOfScope && data.outOfScope) {
        return [];
    }

    if (!data.threats) {
        return [];
    }

    return data.threats.filter(x => filters.showMitigated || x.status.toLowerCase() !== 'mitigated');
};


export default {
    convertToTranslationString,
    filter,
    filterForDiagram,
    getModelByTranslation: models.getByTranslationValue,
    hasOpenThreats
};
