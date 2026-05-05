import assumptions from './assumptions';
import data_flows from './flows';
import nodes from './nodes';
import data_sets from './sets';
import threats from './threats/threats';

const assignThreats = (model, components) => {

    for (let threat of threats.merge(model)) {
        threat.components_affected?.forEach((componentAffected) => {
            components.forEach((component) => {
                if (componentAffected === component.id) {
                    if (component.data.threats) {
                        component.data.threats.push(threat);
                    } else {
                        console.warn('Ignoring threat incorrectly associated with trust zone');
                    }
                }
            });
        });
    }

    return components;
};

const merge = (model, version) => {
    const thumbnail = './public/content/images/thumbnail.jpg';
    var diagrams = new Array();
    let diagramId = 0;
    const diagramNodes = nodes.merge(model);
    const diagramEdges = data_flows.merge(model);
    let cells = diagramNodes.concat(diagramEdges);

    // data sets and assumptions are merged into existing components
    cells = data_sets.merge(model, cells);
    cells = assumptions.merge(model, cells);
    cells = assignThreats(model, cells);

    diagrams.push({
        version: version,
        title: model.scope.title,
        thumbnail: thumbnail,
        diagramType: 'TM-BOM',
        id: diagramId++,
        cells: cells
    });

    // add TM-BOM diagrams, which are supporting diagrams in arbitrary format
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
