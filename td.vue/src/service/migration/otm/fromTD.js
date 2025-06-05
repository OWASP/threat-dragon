export const convert = function (data) {
    const jsonData = JSON.stringify(data, null, 2);

    var dragonData = JSON.parse(jsonData);

    var otm = new Object();
    otm.otmVersion = '0.2.0';
    otm.project = new Object();
    otm.project.id = dragonData.summary.id;
    otm.project.name = dragonData.summary.title;

    var diagram = dragonData.detail.diagrams[0];

    otm.trustZones = [];
    otm.components = [];
    otm.dataflows = [];
    diagram.cells.forEach(function(cell) {
        if (cell.data.type == 'tm.Boundary') {
            var zone = new Object();
            zone.id = cell.id;
            zone.name = cell.data.name;
            zone.type = cell.shape;

            zone.attributes = [];
            var attr = new Object();
            attr.sourceX = cell.source.x;
            attr.sourceY = cell.source.y;
            attr.targetX = cell.target.x;
            attr.targetY = cell.target.y;
            attr.type = cell.data.type;
            zone.attributes.push(attr);

            zone.representations = [];
            var counter = 1;
            cell.vertices.forEach(function(vert) {
                var rep = new Object();
                rep.id = counter;
                rep.name = 'vertices';
                rep.position = new Object();
                rep.position.x = vert.x;
                rep.position.y = vert.y;
                rep.size = new Object();
                rep.size.width = 1;
                rep.size.height = 1;
                zone.representations.push(rep);
                counter += 1;
            });

            otm.trustZones.push(zone);
        }
        if (cell.data.type == 'tm.Store') {
            var store = new Object();
            store.id = cell.id;
            store.name = cell.data.name;
            store.type = cell.shape;

            store.threats = [];

            if (Object.hasOwn(cell.data, 'threats'))
            {
                cell.data.threats.forEach(function(threat) {
                    var tr = new Object();
                    tr.id = store.id + store.threats.length;
                    tr.name = threat.title;
                    tr.description = threat.description;
                    tr.attributes = [];
                    var att = new Object();
                    att.status = threat.status;
                    att.severity = threat.severity;
                    att.mitigation = threat.mitigation;
                    att.type = threat.type;
                    att.modelType = threat.modelType;
                    tr.attributes.push(att);

                    store.threats.push(tr);
                });
            }

            store.representations = [];
            var storeRep = new Object();
            storeRep.id = cell.id;
            storeRep.name = cell.data.type;
            storeRep.position = new Object();
            storeRep.position.x = cell.position.x;
            storeRep.position.y = cell.position.y;
            storeRep.size = new Object();
            storeRep.size.width = cell.size.width;
            storeRep.size.height = cell.size.height;
            store.representations.push(storeRep);

            otm.components.push(store);
        }
        if (cell.data.type == 'tm.Actor') {
            var actor = new Object();
            actor.id = cell.id;
            actor.name = cell.data.name;
            actor.type = cell.shape;

            actor.threats = [];

            if (Object.hasOwn(cell, 'threats'))
            {
                cell.data.threats.forEach(function(threat) {
                    var tr = new Object();
                    tr.id = actor.id + actor.threats.length;
                    tr.name = threat.title;
                    tr.description = threat.description;
                    tr.attributes = [];
                    var att = new Object();
                    att.status = threat.status;
                    att.severity = threat.severity;
                    att.mitigation = threat.mitigation;
                    att.type = threat.type;
                    att.modelType = threat.modelType;
                    tr.attributes.push(att);

                    actor.threats.push(tr);
                });
            }

            actor.representations = [];
            var actorRep = new Object();
            actorRep.id = cell.id;
            actorRep.name = cell.data.type;
            actorRep.position = new Object();
            actorRep.position.x = cell.position.x;
            actorRep.position.y = cell.position.y;
            actorRep.size = new Object();
            actorRep.size.width = cell.size.width;
            actorRep.size.height = cell.size.height;
            actor.representations.push(actorRep);

            otm.components.push(actor);
        }
        if (cell.data.type == 'tm.Process') {
            var process = new Object();
            process.id = cell.id;
            process.name = cell.data.name;
            process.type = cell.shape;

            process.threats = [];

            if (Object.hasOwn(cell.data, 'threats'))
            {
                cell.data.threats.forEach(function(threat) {
                    var tr = new Object();
                    tr.id = process.id + process.threats.length;
                    tr.name = threat.title;
                    tr.description = threat.description;
                    tr.attributes = [];
                    var att = new Object();
                    att.status = threat.status;
                    att.severity = threat.severity;
                    att.mitigation = threat.mitigation;
                    att.type = threat.type;
                    att.modelType = threat.modelType;
                    tr.attributes.push(att);
                    process.threats.push(tr);
                });
            }

            process.representations = [];
            var processRep = new Object();
            processRep.id = cell.id;
            processRep.name = cell.data.type;
            processRep.position = new Object();
            processRep.position.x = cell.position.x;
            processRep.position.y = cell.position.y;
            processRep.size = new Object();
            processRep.size.width = cell.size.width;
            processRep.size.height = cell.size.height;
            process.representations.push(processRep);

            otm.components.push(process);
        }
        if (cell.data.type == 'tm.Flow') {
            var flow = new Object();
            flow.id = cell.id;
            flow.type = cell.shape;
            flow.name = cell.data.name;
            flow.source = cell.source.cell;
            flow.destination = cell.target.cell;

            flow.attributes = [];
            var attFlow = new Object();
            attFlow.verticesX = cell.vertices[0].x;
            attFlow.verticesY = cell.vertices[0].y;
            flow.attributes.push(attFlow);

            flow.threats = [];

            if (Object.hasOwn(cell.data, 'threats'))
            {
                cell.data.threats.forEach(function(threat) {
                    var tr = new Object();
                    tr.id = flow.id + flow.threats.length;
                    tr.name = threat.title;
                    tr.description = threat.description;
                    tr.attributes = [];
                    var att = new Object();
                    att.status = threat.status;
                    att.severity = threat.severity;
                    att.mitigation = threat.mitigation;
                    att.type = threat.type;
                    att.modelType = threat.modelType;
                    tr.attributes.push(att);
                    flow.threats.push(tr);
                });
            }

            flow.representations = [];
            var flowRep = new Object();
            flowRep.id = cell.id;
            flowRep.name = cell.data.type;
            flow.representations.push(flowRep);

            otm.dataflows.push(flow);
        }
    });

    return otm;
};

export default {
    convert
};
