import cia from './cia.js';
import die from './die.js';
import linddun from './linddun.js';
import plot4ai from './plot4ai.js';
import stride from './stride.js';

const swapKeyValuePairs = (obj) => {
    let swappedObj = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            swappedObj[obj[key]] = key;
        }
    }
    return swappedObj;
}
/**
 * below, we're swapping the key-value pairs, because the current objects might have keys that are the same
 * (in fact, linddun and plot4ai share two keys / categories)
 * Because we're doing this, we will also swap the return object from getThreatTypesByElement(), to be consistent 
 */
const generic = Object.assign(
    Object.assign({ 'threats.model.stride.header': 'strideHeader' }, swapKeyValuePairs(stride.all)),
    Object.assign({ 'threats.model.cia.header': 'ciaHeader' }, swapKeyValuePairs(cia)),
    Object.assign({ 'threats.model.die.header': 'dieHeader' }, swapKeyValuePairs(die)),
    Object.assign({ 'threats.model.linddun.header': 'linddunHeader' }, swapKeyValuePairs(linddun.all)),
    Object.assign({ 'threats.model.plot4ai.header': 'plot4aiHeader' }, swapKeyValuePairs(plot4ai.all))
);


const getByTranslationValue = (translation) => {
    if (!translation) {
        return '';
    }

    if (Object.values(cia).find(x => x.toLowerCase() === translation.toLowerCase())) {
        return 'CIA';
    }

    if (Object.values(die).find(x => x.toLowerCase() === translation.toLowerCase())) {
        return 'DIE';
    }

    if (Object.values(linddun.all).find(x => x.toLowerCase() === translation.toLowerCase())) {
        return 'LINDDUN';
    }

    if (Object.values(plot4ai.all).find(x => x.toLowerCase() === translation.toLowerCase())) {
        return 'PLOT4ai';
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

    case 'DIE' :
        types = die;
        break;

    case 'LINDDUN' :
        if (cellType === 'tm.Actor') {
            types = linddun.actor;
        } else {
            types = linddun.default;
        }
        break;

    case 'PLOT4AI' :
        switch (cellType) {
        case 'tm.Actor' :
            types = plot4ai.actor;
            break;
        case 'tm.Process' :
            types = plot4ai.process;
            break;
        case 'tm.Store' :
            types = plot4ai.store;
            break;
        case 'tm.Flow' :
        default:
            types = plot4ai.flow;
            break;
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
	return generic;
        break;
    }
    /**
     * swapping the key-value pairs of types to be consistent with how generic (returned as default)
     * is formed
     */
    return swapKeyValuePairs(types);
};

const allModels = ['CIA', 'DIE', 'LINDDUN', 'PLOT4ai', 'STRIDE']

export default {
    getByTranslationValue,
    getThreatTypesByElement,
    allModels
};
