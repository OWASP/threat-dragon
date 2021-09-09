/**
 * @name diagram
 * @description Reads an existing v1 diagram to create components for the v2 UI
 * This is not for persistence, and is done on a diagram by diagram basis
 */
import shapes from '../x6/shapes/index.js';

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

const addMetaData = (entity, cell) => {
    const data = {
        name: cell.name || '',
        description: cell.description || '',
        type: cell.type,
        isTrustBoundary: cell.type === 'tm.Boundary'
    };

    if (!data.isTrustBoundary) {
        data.outOfScope = !!cell.outOfScope;
        data.reasonOutOfScope = cell.reasonOutOfScope || '';
        data.threats = cell.threats || [];
        data.hasOpenThreats = data.threats.length > 0;
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
    
    return entity;
};

const mapDiagram = (diagram) => {
    const resp = { nodes: [], edges: [] };
    
    // If the diagram is blank, there is no diagramJson
    if (!diagram.diagramJson) {
        return resp;
    }

    // TODO: Merge defaults with existing data
    diagram.diagramJson.cells.forEach((cell) => {
        const { isNode, mapper } = cellConverter[cell.type];
        const entity = mapper(cell);
        const arr = isNode ? resp.nodes : resp.edges;
        arr.push(addMetaData(entity, cell));
    });

    // TODO: merge defaults with existing data
    // TODO: Add label to data as name
    relateEdges(resp.nodes, resp.edges);
    return resp;
};

export default {
    mapDiagram
};
