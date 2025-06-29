import assumptions from './assumptions';
import flows from './flows';
import nodes from './nodes';
import sets from './sets';
import threats from './threats';

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
    components = threats.merge(model, components);

    diagrams.push({
	    version: version,
	    title: model.scope.title,
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
