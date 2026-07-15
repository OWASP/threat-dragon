import properties from './properties.js';
import threats from './threats.js';

export const list = (model, otmId) => {
    const cells = [];

    model.components?.forEach((component) => {
        component.representations?.forEach((representation) => {
            if (representation.representation === otmId) {
                cells.push(component);
            }
        });
    });

    return cells;
};

export const merge = (model, component, representation) => {
    const cell = properties.cellProperties(component, representation);
    cell.id = component.id; // OTM required value
    cell.data.description = properties.combineDescription(model, component);
    cell.data.threats = threats.merge(model, component);

    if (representation.size) { // otherwise size remains at default property
        cell.size = representation.size;
    }

    cell.position = properties.findPosition(
        model,
        representation.representation,
        component.parent,
        representation.position
    ); // relative to parent's position

    cell.compatibility = {
        otmId: representation.id, // OTM required value
        parent: component.parent, // OTM required value
        tags: component.tags || undefined
    };

    return cell;
};

export default {
    list,
    merge
};
