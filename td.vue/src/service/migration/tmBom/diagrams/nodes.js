import defaultProperties from '@/service/entity/default-properties.js';
import boxes from './boxes';

const padding = boxes.nodeGeometry.padding;
const nodeSize = { width: boxes.nodeGeometry.width, height: boxes.nodeGeometry.height };
export const defaults = {actorType: 'third_party', storeType: 'object'};

export const convert = (model) => {
    const nodes = {actors: [], components: [], data_stores: []};

    // there may be no diagrams or no cells within a diagram
    model.detail.diagrams?.forEach((diagram) => {
        diagram.cells?.forEach((cell) => {
            if (cell.data.type === 'tm.Actor') {
                nodes.actors.push({
                    symbolic_name: cell.id,
                    title: cell.data.name,
                    description: cell.data.description,
                    type: defaults.actorType,
                    permissions: 'Default permissions exported by Threat Dragon'
                });
            } else if (cell.data.type === 'tm.Process') {
                nodes.components.push({
                    symbolic_name: cell.id,
                    title: cell.data.name,
                    description: cell.data.description
                });
            } else if (cell.data.type === 'tm.Store') {
                nodes.data_stores.push({
                    symbolic_name: cell.id,
                    title: cell.data.name,
                    description: cell.data.description,
                    type: defaults.storeType
                });
            }
            // other cell types, such as trust boundary boxes, handled elsewhere    
        });
    });

    return nodes;
};

export const createNodes = (model, zone) => {
    const nodes = [];
    let zIndex = 0;
    const zones = [];
    model.trust_zones?.forEach((zone) => zones.push(zone.symbolic_name));

    model.actors?.forEach((actor) => {
        if ((actor.trust_zone === zone) || (!zones.includes(actor.trust_zone) && zone === undefined)) {
            const node = defaultProperties.defaultEntity('tm.Actor');
            node.label = node.data.name = actor.title;
            node.data.description = actor.description;
            node.id = actor.symbolic_name;
            node.zIndex = zIndex++;
            nodes.push(node);
        }
    });

    model.components?.forEach((component) => {
        if ((component.trust_zone === zone) || (!zones.includes(component.trust_zone) && zone === undefined)) {
            const process = defaultProperties.defaultEntity('tm.Process');
            process.data.name = process.attrs.text.text = component.title;
            process.data.description = component.description;
            process.id = component.symbolic_name;
            process.zIndex = zIndex++;
            nodes.push(process);
        }
    });

    model.data_stores?.forEach((data_store) => {
        if ((data_store.trust_zone === zone) || (!zones.includes(data_store.trust_zone) && zone === undefined)) {
            const store = defaultProperties.defaultEntity('tm.Store');
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
    const components = [];
    const origin = { x: position.x + (padding / 2), y: position.y + (padding / 2) };
    const place = { x: origin.x, y: origin.y };
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
    const trustBoundaryBoxes = boxes.merge(model);

    // public zone components are not in any trust boundary
    const publicNodes = createNodes(model, undefined);
    // place public zone components around the edges of the diagram
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
    convert,
    merge
};
