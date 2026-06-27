import defaultProperties from '@/service/entity/default-properties.js';

// all OTM components must have a parent, either another component or a trust zone
// trust zones may have a parent, so ulitmately all components must end up in a trust zone
const findPosition = (model, parent, repId, position) => {
    if (parent.trustZone && model.trustZones) {
        for (const zone of model.trustZones){
            if (zone.id === parent.trustZone) {
                for (const representation of zone.representations) {
                    if (representation.representation === repId) {
                        return {x: position.x + representation.position.x, y: position.y + representation.position.y};
                    }
                }
                console.warn('could not find representation with id : ' + repId);
            }
        }
        console.warn('could not find zone with id : ' + parent.trustZone);
    } else if (parent.component && model.components) {
        for (const component of model.components){
            if (component.id === parent.component) {
                for (const representation of component.representations) {
                    if (representation.representation === repId) {
                        return {x: position.x + representation.position.x, y: position.y + representation.position.y};
                    }
                }
                console.warn('could not find representation with id : ' + repId);
            }
        }
        console.warn('could not find zone with id : ' + parent.trustZone);
    } else {
        console.warn('parent is not valid : ' + JSON.stringify(parent));
    }
    return position;
};

// OTM does not have fixed types or shape ids, just strings, so guess the component/node type
const guessProperties = (component, representation) => {
    let node;

    if (
        component.type.toLowerCase().includes('database') ||
        component.id.toLowerCase().includes('database') ||
        representation.id.toLowerCase().includes('database')
    ) {
        node = defaultProperties.defaultEntity('tm.Store');
        node.data.name = node.attrs.text.text = component.name; // OTM required value
    } else if (
        component.type.toLowerCase().includes('service') ||
        component.id.toLowerCase().includes('service') ||
        representation.id.toLowerCase().includes('service')
    ) {
        node = defaultProperties.defaultEntity('tm.Process');
        node.data.name = node.attrs.text.text = component.name; // OTM required value
    } else {
        node = defaultProperties.defaultEntity('tm.Actor');
        node.data.name = node.label = component.name; // OTM required value
    }
    return node;
};

export const list = (model, otmId) => {
    const nodes = [];

    model.components?.forEach((component) => {
        component.representations?.forEach((representation) => {
            if (representation.representation === otmId) {
                nodes.push(component);
            }
        });
    });

    return nodes;
};

export const merge = (model, component, representation) => {
    const node = guessProperties(component, representation);

    node.data.description = component.description;
    node.id = component.id; // OTM required value

    if (representation.size) { // otherwise size remains at default
        node.size = representation.size;
    }

    if (representation.position) { // relative to parent's position
        node.position = findPosition(model,
                            component.parent,
                            representation.representation,
                            representation.position);
    }

    node.compatibility = {
        otmId: representation.id, // OTM required value
        parent: component.parent, // OTM required value
        tags: component.tags || undefined
    };

    return node;
};

export default {
    list,
    merge
};
