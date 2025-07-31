import defaultProperties from '@/service/entity/default-properties.js';
import boxes from './boxes';

const padding = 125;
const nodeSize = { width: 160 + padding, height: 80 + padding };

const read = (model) => {
    const publicNodes = findNodes(model, null);

    var trustBoundaryBoxes = boxes.read(
        model,
        publicNodes.length ? {x: nodeSize.width + padding, y: nodeSize.height + padding}: {x: padding, y: padding},
        nodeSize,
        padding
    );

    // place the TM-BOM nodes as components in the TD diagram
    // if trust-zones present then place the untrusted components around the edge
    const publicZone = {
        position: { x: 0, y: 0 },
        shape: trustBoundaryBoxes.length ? 'edges' : 'trust-boundary-box'
    };
    var components = placeNodes(publicNodes, publicZone);

    // find and place the nodes for each trust zones / boundary boxes
    trustBoundaryBoxes.forEach((zone) => {
        let zoneNodes = findNodes(model, zone.id);
        components = components.concat(placeNodes(zoneNodes, zone));
    });

    // add the trust boundary boxes themselves
    components = components.concat(trustBoundaryBoxes);

    return components;
};

const findNodes = (model, zone) => {
    let nodes = new Array();
    let zIndex = 0;

    if (model.actors) {
        let actors = model.actors;
        actors.forEach((actor) => {
            if ((actor.trust_zone === zone) || (!actor.trust_zone && zone === null)) {
                let node = defaultProperties.defaultEntity('tm.Actor');
                node.label = node.data.name = actor.title;
                node.data.description = actor.description;
                node.id = actor.symbolic_name;
                node.zIndex = zIndex++;
                nodes.push(node);
            }
        });
    }

    if (model.components) {
        let components = model.components;
        components.forEach((component) => {
            if ((component.trust_zone === zone) || (!component.trust_zone && zone === null)) {
                let process = defaultProperties.defaultEntity('tm.Process');
                process.data.name = process.attrs.text.text = component.title;
                process.data.description = component.description;
                process.id = component.symbolic_name;
                process.zIndex = zIndex++;
                nodes.push(process);
            }
        });
    }

    if (model.data_stores) {
        let data_stores = model.data_stores;
        data_stores.forEach((data_store) => {
            if ((data_store.trust_zone === zone) || (!data_store.trust_zone && zone === null)) {
                let store = defaultProperties.defaultEntity('tm.Store');
                store.data.name = store.attrs.text.text = data_store.title;
                store.data.description = data_store.description;
                store.id = data_store.symbolic_name;
                store.zIndex = zIndex++;
                nodes.push(store);
            }
        });
    }

    return nodes;
};

const placeNodes = (nodes, zone) => {
    let components = new Array();
    let origin = { x: zone.position.x + (padding / 2), y: zone.position.y + (padding / 2) };
    let place = { x: origin.x, y: origin.y };
    let count = 0;

    if (nodes.length) {
        nodes.forEach((node) => {
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
    }

    return components;
};

export default {
    findNodes,
    placeNodes,
    read
};
