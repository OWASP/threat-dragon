import diagrams from './diagrams/diagrams';

const read = (model, version) => {
    
    let diagramTop = model.diagrams ? model.diagrams : [];
    let threatTop = model.threats ? model.threats : [];

    return {
        contributors: [{ 'name': 'Imported from TM-BOM' }],
        diagrams: diagrams.read(model, version),
        diagramTop: model.diagrams ? diagramTop.length - 1 : 0,
        reviewer: '',
        threatTop: model.threats ? threatTop.length - 1 : 0
    };
};

export default {
    read
};
