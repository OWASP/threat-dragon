import cia from './cia.js';
import die from './die.js';
import linddun from './linddun.js';
import plot4ai from './plot4ai.js';
import stride from './stride.js';

// do it this way to 'persuade' generic to be in the right order
/**
 * @todo : this object needs to be changed. When different framework have the same category, it clashes
 * This is currently the case with LINDDUN and PLOT4ai:
 *
 * Object { 
 *   ..: "..."
 *   unawareness: "threats.model.plot4ai.unawareness"
 *   }
 *
 * Object { 
 *   ..: "..."
 *   unawareness: "threats.model.linddun.unawareness"
 *   }
 *
 * This is only a problem when there is no modelType though.
 * Note that when this object changes, the types object returned by getThreatTypesByElement also needs to be changed for the individual model
 */
const generic = Object.assign(
    Object.assign({ strideHeader: 'threats.model.stride.header' }, stride.all),
    Object.assign({ ciaHeader: 'threats.model.cia.header' }, cia),
    Object.assign({ dieHeader: 'threats.model.die.header' }, die),
    Object.assign({ linddunHeader: 'threats.model.linddun.header' }, linddun.all),
    Object.assign({ plot4aiHeader: 'threats.model.plot4ai.header' }, plot4ai.all)
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
        types = generic;
        break;
    }
    return types;
};

export default {
    getByTranslationValue,
    getThreatTypesByElement
};
