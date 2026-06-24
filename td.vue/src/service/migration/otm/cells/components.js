import defaultProperties from '@/service/entity/default-properties.js';

// OTM does not have fixed tpes or shape ids, just strings, so guess the node type
export const guessProperties = (component, representation) => {
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

const list = (model, otmId) => {
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

const merge = (component, representation) => {
    const node = guessProperties(component, representation);

    node.data.description = component.description;
    node.id = component.id; // OTM required value

    if (representation.size) {
        node.size = representation.size;
    }

    if (representation.position) {
        node.position = representation.position;
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
