import defaultProperties from '@/service/entity/default-properties.js';
import boxes from './boxes';

const padding = 100;
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
                let node = defaultProperties.defaultEntity('tm.Process');
                node.data.name = node.attrs.text.text = component.title;
                node.data.description = component.description;
                node.id = component.symbolic_name;
                node.zIndex = zIndex++;
                nodes.push(node);
            }
        });
    }

    if (model.data_stores) {
        let data_stores = model.data_stores;
        data_stores.forEach((data_store) => {
            if ((data_store.trust_zone === zone) || (!data_store.trust_zone && zone === null)) {
                let node = defaultProperties.defaultEntity('tm.Store');
                node.data.name = node.attrs.text.text = data_store.title;
                node.data.description = data_store.description;
                node.id = data_store.symbolic_name;
                node.zIndex = zIndex++;
                nodes.push(node);
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

    /*let component = nodes[0];
    component.position = { x: place.x, y: place.y };
    components.push(component);*/

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
