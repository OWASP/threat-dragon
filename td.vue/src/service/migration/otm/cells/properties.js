import defaultProperties from '@/service/entity/default-properties.js';

// all OTM components must have a parent, either another component or a trust zone
// trust zones may have a parent, so ulitmately all components must end up in a trust zone
const defaultPosition = {x: 100, y: 100};
const defaultSize = {width: 100, height: 100};

// OTM does not have fixed types or shape ids, just strings, so guess the component/cell type
const cellProperties = (component, representation) => {
    let cell;

    if (
        component?.type?.toLowerCase().includes('database') ||
        component?.id?.toLowerCase().includes('database') ||
        representation?.id?.toLowerCase().includes('database')
    ) {
        cell = defaultProperties.defaultEntity('tm.Store');
        cell.data.name = cell.attrs.text.text = component.name; // OTM required value
    } else if (
        component?.type?.toLowerCase().includes('service') ||
        component?.id?.toLowerCase().includes('service') ||
        representation?.id?.toLowerCase().includes('service')
    ) {
        cell = defaultProperties.defaultEntity('tm.Process');
        cell.data.name = cell.attrs.text.text = component.name; // OTM required value
    } else {
        cell = defaultProperties.defaultEntity('tm.Actor');
        cell.data.name = cell.label = component.name; // OTM required value
    }

    return cell;
};

const assetDescription = (model, assets) => {
    let description = '';
    assets.forEach((nodeAsset) => {
        let found = false;
        for (const modelAsset of model.assets) {
            if (nodeAsset === modelAsset.id) {
                description += modelAsset.description ? '\nAsset: ' + modelAsset.description + '\nRisk:' : '\nAsset risk:';
                description += '\nConfidentiality: ' + modelAsset.risk.confidentiality;
                description += ', Integrity: ' + modelAsset.risk.integrity;
                description += ', Availability: ' + modelAsset.risk.availability;
                description += modelAsset.risk.comment ? '\nRisk evaluation: ' + modelAsset.risk.comment : '';
                found = true;
                break;
            }
        }
        if (found === false) {       
            console.warn('Could not find a match for asset ID: ' + nodeAsset);
        }
    });

    return description;
};

const combineDescription = (model, node) => {
    let description = '';

    if (!node.assets || !model.assets) {
        return node?.description || description;
    }
    
    if (!node.assets.processed && !node.assets.stored) {
        description = node.description ? node.description + ' with data in transit: ' : 'Data in transit: ';
        description += assetDescription(model, node.assets);
    } else {
        description = node.description;
        if (node.assets.processed) {
            description += '\nWith processed assets: ';
            description += assetDescription(model, node.assets.processed);
        }
        if (node.assets.stored) {
            description += '\nWith stored assets: ';
            description += assetDescription(model, node.assets.stored);
        }
    }

    return description;
};

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

const findSize = (representation) => {
    if (representation?.size) {
        return representation.size;
    }
    return defaultSize;
};

const flowProperties = (dataflow) => {
    const flow = defaultProperties.defaultEntity('tm.Flow');
    flow.data.name = flow.labels[0].attrs.labelText.text = dataflow.name; // OTM required value
    return flow;
};

const zoneProperties = (trustZone) => {
    const box = defaultProperties.defaultEntity('tm.BoundaryBox');
    box.data.name = box.attrs.label.text = trustZone.name; // OTM required value
    return box;
};

export default {
    cellProperties,
    combineDescription,
    findPosition,
    findSize,
    flowProperties,
    zoneProperties
};
