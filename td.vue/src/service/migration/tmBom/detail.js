import diagrams from './diagrams/diagrams';

const read = (model, version) => {
    let allDiagrams = diagrams.read(model, version);
    
    return {
        contributors: [{ 'name': 'Imported from TM-BOM' }],
        diagrams: allDiagrams,
        diagramTop: allDiagrams.length,
        reviewer: '',
        threatTop: model.threats && model.threats.length ? model.threats.length - 1 : 0
    };
};

export default {
    read
};
