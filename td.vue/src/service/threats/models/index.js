import cia from './cia.js';
import generic from './generic.js';
import linddun from './linddun.js';
import stride from './stride.js';

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
