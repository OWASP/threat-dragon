import cia from './cia.js';
import linddun from './linddun.js';
import stride from './stride.js';

const getByTranslationValue = (translation) => {
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
    linddun,
    stride
};

const getThreatTypes = (modelType) => {
    const threatTypes = threatTypesByModel[modelType.toLowerCase()];
    if (!threatTypes) {
        console.error('Unkown model type: ', modelType);
    }
    return threatTypes || {};
};

export default {
    cia,
    getByTranslationValue,
    getThreatTypes,
    linddun,
    stride
};
