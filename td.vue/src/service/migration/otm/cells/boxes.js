import defaultProperties from '@/service/entity/default-properties.js';

const defaultPosition = {x: 100, y: 100};
const defaultSize = {width: 100, height: 100};

const merge = (trustZone, representation) => {
    const box = defaultProperties.defaultEntity('tm.BoundaryBox');

    box.data.name = box.attrs.label.text = trustZone.name; // OTM required value
    box.data.description = trustZone?.description || '';
    box.id = trustZone.id; // OTM required value

    box.size = representation?.size || defaultSize;
    box.position = representation?.position || defaultPosition;

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
