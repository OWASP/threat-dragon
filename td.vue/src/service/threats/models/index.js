import cia from './cia.js';
import linddun from './linddun.js';
import stride from './stride.js';

// do it this way to 'persuade' generic to be in the right order
const generic = Object.assign(
    Object.assign({ strideHeader:  'threats.model.stride.header' }, stride),
    Object.assign({ ciaHeader:  'threats.model.cia.header' }, cia),
    Object.assign({ linddunHeader:  'threats.model.linddun.header' }, linddun)
);

const getByTranslationValue = (translation) => {
    if (!translation) {
        return '';
    }
    
    if (Object.values(cia).find(x => x.toLowerCase() === translation.toLowerCase())) {
        return 'CIA';
    }

    if (Object.values(linddun).find(x => x.toLowerCase() === translation.toLowerCase())) {
        return 'LINDDUN';
    }

    if (Object.values(stride).find(x => x.toLowerCase() === translation.toLowerCase())) {
        return 'STRIDE';
    }

    return '';
};

const getThreatTypes = (modelType) => {
    const threatTypesByModel = {
        cia,
        generic,
        linddun,
        stride
    };
    const threatTypes = threatTypesByModel[modelType.toLowerCase()];
    return threatTypes || generic;
};

const getThreatTypesByElement = (modelType, cellType) => {
    let types;
    console.log('modelType:' + modelType + ' cellType: ' + cellType);
    switch (modelType) {
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
    getThreatTypes,
    getThreatTypesByElement
};
