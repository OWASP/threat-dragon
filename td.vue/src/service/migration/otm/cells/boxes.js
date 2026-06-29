import properties from './properties.js';

const merge = (model, trustZone, representation) => {
    const box = properties.zoneProperties(trustZone);
    box.id = trustZone.id; // OTM required value
    box.data.description = properties.combineDescription(model, trustZone);

    box.size = properties.findSize(representation);
    box.position = properties.findPosition(
        model,
        representation.representation,
        trustZone.parent,
        representation.position
    ); // relative to parent's position

    box.compatibility = {
        attributes: trustZone.attributes || undefined,
        parent: trustZone.parent || undefined,
        risk: trustZone.risk, // OTM required value
        type: trustZone.type || undefined
    };

    return box;
};

export default {
    merge
};
