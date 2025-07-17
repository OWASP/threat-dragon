import cia from './cia.js';
import ciaDie from './ciadie.js';
import linddun from './linddun.js';
import plot4ai from './plot4ai.js';
import stride from './stride.js';

const swapKeyValuePairs = (obj) => {
    let swappedObj = {};
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            swappedObj[obj[key]] = key;
        }
    }
    return swappedObj;
};
/**
 * below, we're swapping the key-value pairs, because the current objects might have keys that are the same
 * (in fact, linddun and plot4ai share two keys / categories)
 * Because we're doing this, we will also swap the return object from getThreatTypesByElement(), to be consistent 
 */
const generic = Object.assign(
    Object.assign({ 'threats.model.stride.header': 'strideHeader' }, swapKeyValuePairs(stride.all)),
    Object.assign({ 'threats.model.cia.header': 'ciaHeader' }, swapKeyValuePairs(cia)),
    Object.assign({ 'threats.model.ciedie.header': 'ciaDieHeader' }, swapKeyValuePairs(ciaDie)),
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

    if (Object.values(ciaDie).find(x => x.toLowerCase() === translation.toLowerCase())) {
        return 'CIADIE';
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

    case 'DIE':
    case 'CIADIE' :
        types = ciaDie;
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
    }
    /**
     * swapping the key-value pairs of types to be consistent with how generic (returned as default)
     * is formed
     */
    return swapKeyValuePairs(types);
};

const getFrequencyMapByElement = (modelType,cellType) => {
    let freqMap={};
    switch(modelType.toUpperCase()){
    case 'CIA':
        freqMap = {confidentiality: 0,integrity: 0,availability: 0};
        break;
    case 'DIE':
    case 'CIADIE':
        freqMap = {confidentiality: 0, integrity: 0, availability: 0, distributed: 0, immutable: 0, ephemeral: 0};
        break;
    case 'LINDDUN':
        if(cellType==='tm.Actor')
            freqMap = {linkability: 0,identifiability: 0,unawareness: 0};
        else{
            Object.keys(linddun.default).map((k)=>{freqMap[k]=0;});
        }
        break;
    case 'PLOT4AI':
        switch(cellType){
        case 'tm.Actor' :
            Object.keys(plot4ai.actor).map((k)=>{freqMap[k]=0;});
            break;
        case 'tm.Process' :
            Object.keys(plot4ai.process).map((k)=>{freqMap[k]=0;});
            break;
        case 'tm.Store' :
            Object.keys(plot4ai.store).map((k)=>{freqMap[k]=0;});
            break;
        case 'tm.Flow' :
        default:
            Object.keys(plot4ai.flow).map((k)=>{freqMap[k]=0;});
            break;
        }
        break;
    case 'STRIDE':
        switch(cellType){
        case 'tm.Actor' :
            Object.keys(stride.actor).map((k)=>{freqMap[k]=0;});
            break;
        case 'tm.Process' :
            Object.keys(stride.process).map((k)=>{freqMap[k]=0;});
            break;
        case 'tm.Store' :
            Object.keys(stride.store).map((k)=>{freqMap[k]=0;});
            break;
        case 'tm.Flow' :
        default:
            Object.keys(stride.flow).map((k)=>{freqMap[k]=0;});
            break;
        }
        break;
    default: return null;
    }
    return freqMap;
};

const allModels = ['CIA', 'CIADIE', 'LINDDUN', 'PLOT4ai', 'STRIDE'];

export default {
    getByTranslationValue,
    getThreatTypesByElement,
    getFrequencyMapByElement,
    allModels
};
