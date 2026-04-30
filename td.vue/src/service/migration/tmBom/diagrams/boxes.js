import defaultProperties from '@/service/entity/default-properties.js';

const padding = 125;
// a 'typical' node is width 160 and height 80
const nodeGeometry = {width: 160 + padding, height: 80 + padding, padding: padding};

const countNodes = (model, trust_zone) => {
    let count = 0;

    if (model.actors) {
        model.actors.forEach((actor) => {
            if (actor.trust_zone === trust_zone) {
                count++;
            }
        });
    }

    if (model.components) {
        model.components.forEach((component) => {
            if (component.trust_zone === trust_zone) {
                count++;
            }
        });
    }

    if (model.data_stores) {
        model.data_stores.forEach((data_store) => {
            if (data_store.trust_zone === trust_zone) {
                count++;
            }
        });
    }
    console.debug('trust_zone : ' + trust_zone + ' count: ' + count);

    return count;
};

const dimensionZone = (model, trust_zone) => {
    let nodeCount = countNodes(model, trust_zone);
    let nodesPerSide = 1;

    // the nodes are placed around the top and lhs edges of the trust boundary box
    // so that 0 or 1 component is side of 1, 2 & 3 is side of 2
    // 4 & 5 is side of 3, 6 & 7 is side of 4, 8 & 9 is side of 5 and so on
    if (nodeCount > 1) {
        nodesPerSide = Math.floor((nodeCount + 2) / 2);
    }

    return { 'width': nodesPerSide * nodeGeometry.width, 'height': nodesPerSide * nodeGeometry.height };
};

const merge = (model) => {
    let boundaryBoxes = new Array();
    let position = {x: nodeGeometry.padding, y: nodeGeometry.padding};

    // nodes not in any trust zone are in a notional 'public' trust zone
    if (countNodes(model, undefined)) {
        // make room for nodes round edge of diagram
        position.x += nodeGeometry.width;
        position.y += nodeGeometry.height;
    }
    let offset = {column: position.x, row: position.y};

    if (model.trust_zones) {
        let boxCount = 1;
        let zIndex = -1;

        model.trust_zones.forEach((zone) => {
            let dimensions = dimensionZone(model, zone.symbolic_name);
            let data = defaultProperties.defaultData('tm.BoundaryBox');
            data.name = zone.title;
            data.description = zone.description;

            boundaryBoxes.push({
                position: {
                    x: position.x,
                    y: position.y
                },
                size: dimensions,
                attrs: { label: { text: zone.title } },
                shape: 'trust-boundary-box',
                id: zone.symbolic_name,
                zIndex: zIndex--,
                data: data
            });

            console.debug('offset: ' + JSON.stringify(offset));
            if (offset.row < (offset.row + dimensions.height + nodeGeometry.padding)) {
                // expand next row to avoid overlap
                offset.row += (dimensions.height + nodeGeometry.padding);
                console.debug('offset now : ' + JSON.stringify(offset));
            } 

            if (boxCount++ % 2) {
                // ready for next trust boundary box in row
                position.x += (dimensions.width + nodeGeometry.padding);
            } else {
                // start a new row
                position.x = offset.column;
                position.y = offset.row;
            }
        });
    }

    return boundaryBoxes;
};

export default {
    merge,
    nodeGeometry
};
