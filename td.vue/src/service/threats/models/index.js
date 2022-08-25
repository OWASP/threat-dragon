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

const threatTypesByModel = {
    cia,
    generic,
    linddun,
    stride
};

const getThreatTypes = (modelType) => {
    const threatTypes = threatTypesByModel[modelType.toLowerCase()];
    return threatTypes || generic;
};

export default {
    cia,
    generic,
    getByTranslationValue,
    getThreatTypes,
    linddun,
    stride
};
