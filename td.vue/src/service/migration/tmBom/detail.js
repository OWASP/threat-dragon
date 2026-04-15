import diagrams from './diagrams/diagrams';

const read = (model, version) => {
    
    return {
        contributors: [{ 'name': 'Imported from TM-BOM' }],
        diagrams: diagrams.read(model, version),
        diagramTop: model.diagrams ? model.diagrams.length : 0,
        reviewer: '',
        threatTop: model.threats && model.threats.length ? model.threats.length - 1 : 0
    };
};

export default {
    read
};
