import cia from './cia.js';
import linddun from './linddun.js';
import stride from './stride.js';

// do it this way to 'persuade' generic to be in the right order
const generic = Object.assign(
  Object.assign({ strideHeader: 'threats.model.stride.header' }, stride.all),
  Object.assign({ ciaHeader: 'threats.model.cia.header' }, cia),
  Object.assign({ linddunHeader: 'threats.model.linddun.header' }, linddun.all)
);

const getByTranslationValue = (translation) => {
  if (!translation) {
    return '';
  }

  if (Object.values(cia).find(x => x.toLowerCase() === translation.toLowerCase())) {
    return 'CIA';
  }

  if (Object.values(linddun.all).find(x => x.toLowerCase() === translation.toLowerCase())) {
    return 'LINDDUN';
  }

  if (Object.values(stride.all).find(x => x.toLowerCase() === translation.toLowerCase())) {
    return 'STRIDE';
  }

  return '';
};

const getThreatTypesByElement = (modelType, cellType) => {
  let types;

  switch (modelType.toUpperCase()) {
  case 'CIA' :
    types = cia;
    break;
  case 'LINDDUN' :
    if (cellType === 'tm.Actor') {
      types = linddun.actor;
    } else {
      types = linddun.default;
    }
    break;
  case 'STRIDE' :
    switch (cellType) {
    case 'tm.Actor' :
      types = stride.actor;
      break;
    case 'tm.Process' :
      types = stride.process;
      break;
    case 'tm.Store' :
      types = stride.store;
      break;
    case 'tm.Flow' :
    default:
      types = stride.flow;
      break;
    }
    break;
  default:
    types = generic;
    break;
  }

  return types;
};

export default {
  getByTranslationValue,
  getThreatTypesByElement
};
