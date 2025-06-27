import nodes from './nodes';
import flows from './flows';
import sets from './sets';
import assumptions from './assumptions';

const read = (model, version) => {
    const thumbnail = './public/content/images/thumbnail.jpg';
    var diagrams = new Array();
    const nodeComponents = nodes.read(model);
    const flowComponents = flows.read(model);
    let components = nodeComponents.concat(flowComponents);

    // data sets and assumptions are merged into existing components
    components = sets.merge(model, components);
    components = assumptions.merge(model, components);

    if (model.diagrams) {
        let modelDiagrams = model.diagrams;
        let id = 0;
        modelDiagrams.forEach((diagram) => {
            diagrams.push({
                version: version,
                title: diagram.title,
                thumbnail: thumbnail,
                diagramType: diagram.type,
                id: id++,
                cells: components
            });
        });
    }

    // it may be that no diagram was explicitly declared or found,
    // but there has to be at least one for Threat Dragon
    if (!diagrams.length) {
        console.debug('Create default diagram');
        diagrams.push({
            version: version,
            title: 'TM-BOM diagram',
            thumbnail: thumbnail,
            diagramType: 'generic',
            id: 0,
            cells: components
        });
    }

    return diagrams;
};

export default {
    read
};
