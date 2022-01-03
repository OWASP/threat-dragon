/**
 * @name diagram
 * @description Reads an existing v1 diagram to create components for the v2 UI
 * This is not for persistence, and is done on a diagram by diagram basis
 */
import { v4 } from 'uuid';

import tmActions from '../../store/actions/threatmodel.js';
import dataChanged from '../x6/graph/data-changed.js';
import graphFactory from '../x6/graph/graph.js';
import shapes from '../x6/shapes/index.js';
import store from '../../store/index.js';
import threats from '../threats/index.js';

const upgradeThreat = (threat) => {
    threat.modelType = threats.getModelByTranslation(threats.convertToTranslationString(threat.type));
};

const getLabelText = (cell, label) => {
    let text = label.attrs.text.text;
    if (cell.protocol) {
        text = `${text} (${cell.protocol})`;
    }
    return text;
};

const getEdgeLabels = (cell) => {
    const labels = [];
    if (!cell.labels) {
        return labels;
    }

    cell.labels.forEach((label) => {        
        labels.push({
            position: label.position,
            attrs: { label: { text: getLabelText(cell, label) }}
        });
    });

    return labels;
};

const entityMap = (constructor) => (cell) => {
    return new constructor({
        angle: cell.angle,
        width: cell.size.width,
        height: cell.size.height,
        x: cell.position.x,
        y: cell.position.y,
        // This id will be overwritten by x6, but is needed to link
        // process flows to other elements prior to drawing
        id: cell.id,
        zIndex: cell.z,
        label: cell.attrs && cell.attrs.text && cell.attrs.text.text ? cell.attrs.text.text : ''
    });
};

const edgeMap = (constructor) => (cell) => {
    return new constructor({
        source: cell.source,
        target: cell.target,
        vertices: cell.vertices,
        connector: 'smooth',
        attrs: {},
        labels: getEdgeLabels(cell)
    });
};

const cellConverter = {
    'tm.Actor': {
        isNode: true,
        mapper: entityMap(shapes.Actor)
    },
    'tm.Boundary': {
        isNode: false,
        mapper: edgeMap(shapes.TrustBoundaryCurve)
    },
    'tm.Flow': {
        isNode: false,
        mapper: edgeMap(shapes.Flow)
    },
    'tm.Process': {
        isNode: true,
        mapper: entityMap(shapes.ProcessShape)
    },
    'tm.Store': {
        isNode: true,
        mapper: entityMap(shapes.Store)
    }
};

/**
 * Relates edges to the nodes
 * V1's framework relates them by id, whereas
 * x6 relates via object reference
 * @param {Object[]} nodes
 * @param {Object[]} edges
 */
const relateEdges = (nodes, edges) => {
    edges.forEach((edge) =>{
        if (edge.source.id) {
            edge.source = nodes.find((node) => node.id === edge.source.id);
        }
        if (edge.target.id) {
            edge.target = nodes.find((node) => node.id === edge.target.id);
        }
    });
};

const getName = (cell) => {
    if (cell.name) return cell.name;
    if (cell.attrs.text && cell.attrs.text.text) return cell.attrs.text.text;
    if (cell.labels && cell.labels[0].attrs && cell.labels[0].attrs.text && cell.labels[0].attrs.text.text) return cell.labels[0].attrs.text.text;
    return '';
};

const addMetaData = (entity, cell) => {
    const data = {
        name: getName(cell),
        description: cell.description || '',
        type: cell.type,
        isTrustBoundary: cell.type === 'tm.Boundary'
    };

    if (!data.isTrustBoundary) {
        data.outOfScope = !!cell.outOfScope;
        data.reasonOutOfScope = cell.reasonOutOfScope || '';
        data.threats = cell.threats || [];
        if (data.threats.length) {
            data.threats.forEach((threat) => {
                if (!threat.id) {
                    threat.id = v4();
                }
            });
        }
        data.hasOpenThreats = data.threats && data.threats.filter(x => x.status.toLowerCase() !== 'mitigated').length > 0;
    }

    if (data.type === 'tm.Process') {
        data.privilegeLevel = cell.privilegeLevel || '';
    }

    if (data.type === 'tm.Store') {
        data.isALog = !!cell.isALog;
        data.storesCredentials = !!cell.storesCredentials;
        data.isEncrypted = !!cell.isEncrypted;
        data.isSigned = !!cell.isSigned;
    }

    if (data.type === 'tm.Actor') {
        data.providesAuthentication = !!cell.providesAuthentication;
    }

    if (data.type === 'tm.Flow') {
        data.protocol = cell.protocol || '';
        data.isEncrypted = !!cell.isEncrypted;
        data.isPublicNetwork = !!cell.isPublicNetwork;
    }

    entity.data = data;

    if (entity.data.threats) {
        entity.data.threats.forEach(upgradeThreat);
    }
    
    return entity;
};

const mapDiagram = (diagram) => {
    const resp = { nodes: [], edges: [] };
    
    // If the diagram is blank, there is no diagramJson
    if (!diagram.diagramJson) {
        return resp;
    }

    diagram.diagramJson.cells.forEach((cell) => {
        const { isNode, mapper } = cellConverter[cell.type];
        const entity = mapper(cell);
        const arr = isNode ? resp.nodes : resp.edges;
        arr.push(addMetaData(entity, cell));
    });

    relateEdges(resp.nodes, resp.edges);
    return resp;
};

const drawV1 = (diagram, graph) => {
    const { nodes, edges } = mapDiagram(diagram);
    const batchName = 'td-init';
    graph.startBatch(batchName);
    nodes.forEach((node) => graph.addNode(node));
    edges.forEach((edge) => graph.addEdge(edge));
    graph.stopBatch(batchName);
};

const upgradeAndDraw = (diagram, graph) => {
    if (diagram.version === '2.0') {
        graph.fromJSON(diagram);
        return;
    }

    drawV1(diagram, graph);
    const updated = graph.toJSON();
    updated.version = '2.0';
    updated.title = diagram.title;
    updated.thumbnail = diagram.thumbnail;
    updated.id = diagram.id;
    graph.getCells().forEach((cell) => dataChanged.updateStyleAttrs(cell));
    store.get().dispatch(tmActions.diagramUpdated, updated);
}

const drawGraph = (graph, diagram) => {
    upgradeAndDraw(diagram, graph);
    return graph;
};

const draw = (container, diagram) => drawGraph(graphFactory.getReadonlyGraph(container), diagram);
const edit = (container, diagram) => drawGraph(graphFactory.getEditGraph(container), diagram);

export default {
    draw,
    edit
};
