import defaultProperties from '@/service/entity/default-properties.js';
import boxes from './boxes';

const padding = boxes.nodeGeometry.padding;
const nodeSize = { width: boxes.nodeGeometry.width, height: boxes.nodeGeometry.height };

export const createNodes = (model, zone) => {
    let nodes = new Array();
    let zIndex = 0;

    model.actors?.forEach((actor) => {
        if ((actor.trust_zone === zone) || (!actor.trust_zone && zone === null)) {
            let node = defaultProperties.defaultEntity('tm.Actor');
            node.label = node.data.name = actor.title;
            node.data.description = actor.description;
            node.id = actor.symbolic_name;
            node.zIndex = zIndex++;
            nodes.push(node);
        }
    });

    model.components?.forEach((component) => {
        if ((component.trust_zone === zone) || (!component.trust_zone && zone === null)) {
            let process = defaultProperties.defaultEntity('tm.Process');
            process.data.name = process.attrs.text.text = component.title;
            process.data.description = component.description;
            process.id = component.symbolic_name;
            process.zIndex = zIndex++;
            nodes.push(process);
        }
    });

    model.data_stores?.forEach((data_store) => {
        if ((data_store.trust_zone === zone) || (!data_store.trust_zone && zone === null)) {
            let store = defaultProperties.defaultEntity('tm.Store');
            store.data.name = store.attrs.text.text = data_store.title;
            store.data.description = data_store.description;
            store.id = data_store.symbolic_name;
            store.zIndex = zIndex++;
            nodes.push(store);
        }
    });

    return nodes;
};

// place nodes within a zone
export const placeNodes = (nodes, position) => {
    let components = new Array();
    let origin = { x: position.x + (padding / 2), y: position.y + (padding / 2) };
    let place = { x: origin.x, y: origin.y };
    let count = 0;

    nodes?.forEach((node) => {
        node.position = count % 2 ? { x: origin.x, y: place.y } : { x: place.x, y: origin.y };
        components.push(node);
        count++;
        // set up next placement
        if (count % 2) {
            place.y += nodeSize.height;
        } else {
            place.x += nodeSize.width;
        }
    });

    return components;
};

// place the TM-BOM nodes as components in the TD diagram
export const merge = (model) => {
    let trustBoundaryBoxes = boxes.merge(model);

    // place public zone components around the edges of the diagram
    let publicNodes = createNodes(model, undefined).concat(createNodes(model, ''));
    let nodes = placeNodes(publicNodes, { x: 0, y: 0 });

    // find and place the nodes for each trust zone / boundary box
    trustBoundaryBoxes.forEach((box) => {
        nodes = nodes.concat(placeNodes(createNodes(model, box.id), box.position));
    });

    // add the trust boundary boxes as nodes on the diagram
    nodes = nodes.concat(trustBoundaryBoxes);

    return nodes;
};

export default {
    merge
};
