import diagrams from './diagrams/diagrams';

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
    merge
};
