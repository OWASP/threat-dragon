import boxes from './boxes';

const read = (model, version) => {
    const diagrams = new Array();
    var thumbnail = './public/content/images/thumbnail.jpg';
    var offset = {'x': 100, 'y': 80};
    
    if (model.diagrams) {
        let modelDiagrams = model.diagrams;
        let id = 0;

        modelDiagrams.forEach((diagram) => {
            diagrams.push({
                'version': version,
                'title': diagram.title,
                'thumbnail': thumbnail,
                'diagramType': diagram.type,
                'id': id++,
                'cells': boxes.read(model, offset)
            });
        });
    }

    // it may be that no diagram was explicitly declared,
    // but there has to be at least one
    if (!diagrams.length) {
        console.debug('Create default diagram');
        diagrams.push({
            'version': version,
            'title': 'TM-BOM diagram',
            'thumbnail': thumbnail,
            'diagramType': 'generic',
            'id': 0,
            'cells': boxes.read(model, offset)
        });
    }

    return diagrams;
};

export default {
    read
};
