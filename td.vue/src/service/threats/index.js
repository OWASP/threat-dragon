import { v4 } from 'uuid';

import models from './models/index.js';

const valuesToTranslations = {
    'Confidentiality': 'threats.models.confidentiality',
    'Integrity': 'threats.models.integrity',
    'Availability': 'threats.models.availability',
    'Linkability': 'threats.models.linkability',
    'Identifiability': 'threats.models.identifiability',
    'Non-repudiation': 'threats.models.nonRepudiation',
    'Detectability': 'threats.models.detectability',
    'Disclosure of information': 'threats.models.disclosureOfInformation',
    'Unawareness': 'threats.models.unawareness',
    'Non-compliance': 'threats.models.nonCompliance',
    'Spoofing': 'threats.models.spoofing',
    'Tampering': 'threats.models.tampering',
    'Repudiation': 'threats.models.repudiation',
    'Information disclosure': 'threats.models.informationDisclosure',
    'Denial of service': 'threats.models.denialOfService',
    'Elevation of privilege': 'threats.models.elevationOfPrivilege'
};

const convertToTranslationString = (val) => valuesToTranslations[val];

export const createNewThreat = () => ({
    id: v4(),
    status: '',
    severity: '',
    title: '',
    type: '',
    description: '',
    mitigation: '',
    modelType: ''
});

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
