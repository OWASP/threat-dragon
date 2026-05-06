import assumptions from './assumptions';
import dataFlows from './flows';
import nodes from './nodes';
import dataSets from './sets';
import threats from './threats/threats';

const assignThreats = (model, components) => {

    for (let threat of threats.merge(model)) {
        threat.components_affected?.forEach((componentAffected) => {
            components.forEach((component) => {
                if (componentAffected === component.id) {
                    if (component.data.threats) {
                        component.data.threats.push(threat);
                    } else {
                        console.warn('Ignoring threat ' + threat.id + ' incorrectly associated with trust zone ' + component.id);
                    }
                }
            });
        });
    }

    return components;
};

// antv/x6 drawing package throws an error if the source or target of a flow/edge are named but no cell exists of that name
// so sift out early and warn on this easily-made error
const checkEdges = (edges, nodes) => {
    let ids = new Array();
    for (let node of nodes) {
        ids.push(node.id);
    }
    edges.forEach((edge) => {
        if (!ids.includes(edge.source.cell)) {
            console.warn('Source cell not found: ' + edge.source.cell);
            edge.source.cell = '';
        }
        if (!ids.includes(edge.target.cell)) {
            console.warn('Target cell not found: ' + edge.target.cell);
            edge.target.cell = '';
        }
    });
};

const merge = (model, version) => {
    const thumbnail = './public/content/images/thumbnail.jpg';
    var diagrams = new Array();
    let diagramId = 0;
    const diagramNodes = nodes.merge(model);
    const diagramEdges = dataFlows.merge(model);
    checkEdges(diagramEdges, diagramNodes);
    let cells = diagramNodes.concat(diagramEdges);

    // data sets and assumptions are merged into existing components
    dataSets.merge(model, cells);
    assumptions.merge(model, cells);
    assignThreats(model, cells);

    diagrams.push({
        version: version,
        title: model.scope.title,
        thumbnail: thumbnail,
        diagramType: 'TM-BOM',
        id: diagramId++,
        cells: cells
    });

    // add TM-BOM diagrams, which are supporting diagrams in arbitrary format
    model.diagrams?.forEach((diagram) => {
        diagrams.push({
            version: version,
            title: diagram.title,
            thumbnail: thumbnail,
            diagramType: diagram.type,
            id: diagramId++,
            cells: []
        });
    });

    return diagrams;
};

export default {
    merge
};
