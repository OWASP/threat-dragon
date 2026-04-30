import assumptions from './assumptions';
import data_flows from './flows';
import nodes from './nodes';
import data_sets from './sets';
import threats from './threats/threats';

const merge = (model, version) => {
    const thumbnail = './public/content/images/thumbnail.jpg';
    var diagrams = new Array();
    let diagramId = 0;
    const nodeComponents = nodes.merge(model);
    console.debug('nodeComponents[0]: ' +  JSON.stringify(nodeComponents[0]));
    const flowComponents = data_flows.merge(model);
    let components = nodeComponents.concat(flowComponents);
    console.debug('components[0]: ' +  JSON.stringify(components[0]));

    // data sets, threats and assumptions are merged into existing components
    components = data_sets.merge(model, components);
    components = assumptions.merge(model, components);
    components = threats.merge(model, components);
    console.debug('components[0] now: ' +  JSON.stringify(components[0]));

    diagrams.push({
	    version: version,
	    title: model.scope.title,
	    thumbnail: thumbnail,
	    diagramType: 'TM-BOM',
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
                cells: []
            });
        });
    }

    return diagrams;
};

export default {
    merge
};
