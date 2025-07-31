import defaultProperties from '@/service/entity/default-properties.js';

const findDimensions = (model, symbolic_name, nodeSize) => {
    let nodes = 0;
    let nodesPerSide = 1;

    if (model.actors) {
        let actors = model.actors;
        actors.forEach((actor) => {
            if (actor.trust_zone === symbolic_name) {
                nodes++;
            }
        });
    }
    if (model.components) {
        let components = model.components;
        components.forEach((component) => {
            if (component.trust_zone === symbolic_name) {
                nodes++;
            }
        });
    }
    if (model.data_stores) {
        let data_stores = model.data_stores;
        data_stores.forEach((data_store) => {
            if (data_store.trust_zone === symbolic_name) {
                nodes++;
            }
        });
    }

    // a 'typical' node is width 160 and height 80
    // the nodes are placed around the top and lhs edges of the trust boundary box
    // so that 0 or 1 component is side of 1, 2 & 3 is side of 2
    // 4 & 5 is side of 3, 6 & 7 is side of 4, 8 & 9 is side of 5 and so on
    if (nodes > 1) {
        nodesPerSide = Math.floor((nodes + 2) / 2);
    }

    return { 'width': nodesPerSide * nodeSize.width, 'height': nodesPerSide * nodeSize.height };
};

const read = (model, offset, nodeSize, padding) => {
    let boundaryBoxes = new Array();

    if (model.trust_zones) {
        let modelTrustZones = model.trust_zones;
        let count = 1;
        let zIndex = -1;
        let origin = { x: offset.x, y: offset.y };

        modelTrustZones.forEach((zone) => {
            let dimensions = findDimensions(model, zone.symbolic_name, nodeSize);
            let data = defaultProperties.defaultData('tm.BoundaryBox');
            data.name = zone.title;
            data.description = zone.description;

            boundaryBoxes.push({
                position: {
                    x: offset.x,
                    y: offset.y
                },
                size: dimensions,
                attrs: { label: { text: zone.title } },
                shape: 'trust-boundary-box',
                id: zone.symbolic_name,
                zIndex: zIndex--,
                data: data
            });

            // ready for next trust boundary box
            if (count++ % 2) {
                offset.x += (dimensions.width + padding);
                if (origin.y < (offset.y + dimensions.height + padding)) {
                    origin.y = offset.y + dimensions.height + padding;
                } 
            } else {
                // start a new row
                offset.x = origin.x;
                offset.y = origin.y;
            }
        });
    }

    return boundaryBoxes;
};

export default {
    read
};
