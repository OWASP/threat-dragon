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

const hasOpenThreats = (data) => data && data.threats &&
    data.threats.filter(x => x.status.toLowerCase() === 'open').length > 0;


export default {
    convertToTranslationString,
    getModelByTranslation: models.getByTranslationValue,
    hasOpenThreats
};
