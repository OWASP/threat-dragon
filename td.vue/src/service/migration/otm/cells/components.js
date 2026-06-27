import properties from './properties.js';

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
    const node = properties.baseProperties(component, representation);

    node.data.description = component.description;
    node.id = component.id; // OTM required value

    if (representation.size) { // otherwise size remains at default property
        node.size = representation.size;
    }

    node.position = properties.findPosition(
        model,
        representation.representation,
        component.parent,
        representation.position
    ); // relative to parent's position

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
