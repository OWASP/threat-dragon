import { v4 } from 'uuid';

import models from './models/index.js';
import { t } from '@/i18n/index.js';

const valuesToTranslations = {
  Confidentiality: 'threats.model.cia.confidentiality',
  Integrity: 'threats.model.cia.integrity',
  Availability: 'threats.model.cia.availability',
  Linkability: 'threats.model.linddun.linkability',
  Identifiability: 'threats.model.linddun.identifiability',
  'Non-repudiation': 'threats.model.linddun.nonRepudiation',
  Detectability: 'threats.model.linddun.detectability',
  'Disclosure of information': 'threats.model.linddun.disclosureOfInformation',
  Unawareness: 'threats.model.linddun.unawareness',
  'Non-compliance': 'threats.model.linddun.nonCompliance',
  Spoofing: 'threats.model.stride.spoofing',
  Tampering: 'threats.model.stride.tampering',
  Repudiation: 'threats.model.stride.repudiation',
  'Information disclosure': 'threats.model.stride.informationDisclosure',
  'Denial of service': 'threats.model.stride.denialOfService',
  'Elevation of privilege': 'threats.model.stride.elevationOfPrivilege'
};

const convertToTranslationString = (val) => valuesToTranslations[val];

export const createNewTypedThreat = function (modelType, cellType) {
  if (!modelType) {
    modelType = 'STRIDE';
  }
  let title, type;

  switch (modelType) {
  case 'CIA':
    title = t('threats.generic.cia');
    type = t('threats.model.cia.confidentiality');
    break;
  case 'LINDDUN':
    title = t('threats.generic.linddun');
    type = t('threats.model.linddun.linkability');
    break;
  case 'STRIDE':
    title = t('threats.generic.stride');
    if (cellType === 'tm.Actor' || cellType === 'tm.Process') {
      type = t('threats.model.stride.spoofing');
    } else {
      type = t('threats.model.stride.tampering');
    }
    break;
  default:
    title = t('threats.generic.default');
    type = t('threats.model.stride.spoofing');
    break;
  }

  return {
    id: v4(),
    title,
    status: 'Open',
    severity: 'Medium',
    type,
    description: t('threats.description'),
    mitigation: t('threats.mitigation'),
    modelType,
    new: true,
    number: 0,
    score: ''
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
