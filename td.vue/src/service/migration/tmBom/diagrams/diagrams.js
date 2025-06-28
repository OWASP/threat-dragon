import nodes from './nodes';
import flows from './flows';
import sets from './sets';
import assumptions from './assumptions';

const read = (model, version) => {
    const thumbnail = './public/content/images/thumbnail.jpg';
    var diagrams = new Array();
    let diagramId = 0;
    const nodeComponents = nodes.read(model);
    const flowComponents = flows.read(model);
    let components = nodeComponents.concat(flowComponents);

    // data sets and assumptions are merged into existing components
    components = sets.merge(model, components);
    components = assumptions.merge(model, components);

    console.debug('Create default diagram');
    diagrams.push({
	    version: version,
	    title: 'TM-BOM diagram',
	    thumbnail: thumbnail,
	    diagramType: 'generic',
	    id: diagramId++,
	    cells: components
    });

    // add TM-BOM diagrams (which are exactly that, supporting diagrams)
    if (model.diagrams) {
        let modelDiagrams = model.diagrams;
        modelDiagrams.forEach((diagram) => {
            diagrams.push({
                version: version,
                title: diagram.title,
                thumbnail: thumbnail,
                diagramType: diagram.type,
                id: diagramId++,
                cells: components
            });
        });
    }

    return diagrams;
};

export default {
    read
};
