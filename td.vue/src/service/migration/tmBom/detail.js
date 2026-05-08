import diagrams from './diagrams/diagrams';

const convert = (model) => {
    return {
	    diagrams: diagrams.convert(model)
    };
};

const merge = (model, version) => {
    let allDiagrams = diagrams.merge(model, version);
    
    return {
        contributors: [{ 'name': 'Imported from TM-BOM' }],
        diagrams: allDiagrams,
        diagramTop: allDiagrams.length,
        reviewer: '',
        threatTop: model.threats && model.threats.length ? model.threats.length - 1 : 0
    };
};

export default {
    convert,
    merge
};
