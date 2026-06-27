import defaultProperties from '@/service/entity/default-properties.js';

// all OTM components must have a parent, either another component or a trust zone
// trust zones may have a parent, so ulitmately all components must end up in a trust zone
const defaultPosition = {x: 100, y: 100};

const findPosition = (model, repId, parent, position) => {
    if (!position) {
        return defaultPosition;
    }

    if (!parent) { // probably the top parent
	    return position;
    }

    if (parent.trustZone && model.trustZones) {
        for (const zone of model.trustZones){
            if (zone.id === parent.trustZone) {
                for (const representation of zone.representations) {
                    if (representation.representation === repId) {
                        const newPosition = {x: position.x + representation.position.x, y: position.y + representation.position.y};
                        return findPosition(model, repId, zone.parent, newPosition);
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
                        const newPosition = {x: position.x + representation.position.x, y: position.y + representation.position.y};
                        return findPosition(model, repId, component.parent, newPosition); // components always have a parent
                    }
                }
                console.warn('could not find representation with id : ' + repId);
            }
        }
        console.warn('could not find zone with id : ' + parent.component);
    } else {
        console.warn('parent is not valid : ' + JSON.stringify(parent));
    }

    return position;
};

// OTM does not have fixed types or shape ids, just strings, so guess the component/node type
const baseProperties = (component, representation) => {
    let node;

    if (
        component?.type?.toLowerCase().includes('database') ||
        component?.id?.toLowerCase().includes('database') ||
        representation?.id?.toLowerCase().includes('database')
    ) {
        node = defaultProperties.defaultEntity('tm.Store');
        node.data.name = node.attrs.text.text = component.name; // OTM required value
    } else if (
        component?.type?.toLowerCase().includes('service') ||
        component?.id?.toLowerCase().includes('service') ||
        representation?.id?.toLowerCase().includes('service')
    ) {
        node = defaultProperties.defaultEntity('tm.Process');
        node.data.name = node.attrs.text.text = component.name; // OTM required value
    } else {
        node = defaultProperties.defaultEntity('tm.Actor');
        node.data.name = node.label = component?.name; // OTM required value
    }
    return node;
};

export default {
    baseProperties,
    findPosition
};
