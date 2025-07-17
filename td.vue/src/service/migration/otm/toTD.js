const buildVersion = require('../../../../package.json').version;

const convertSummary = (jsonModel) => {
    const noteText = 'Note that support for Open Threat Model is experimental and subject to large scale changes.\n';
    let summary = new Object();

    if (jsonModel.project) {
        summary.title = jsonModel.project.name;
        summary.owner = jsonModel.project.owner;
        summary.ownerContact = jsonModel.project.ownerContact;
        summary.description = noteText + jsonModel.project.description;
        summary.id = jsonModel.project.id;
    
        // both attributes and tags are not used yet by TD, but need to be preserved if present
        if (jsonModel.project.attributes) {
            summary.attributes = JSON.parse(JSON.stringify(jsonModel.project.attributes));
        }
        if (jsonModel.project.tags) {
            summary.tags = JSON.parse(JSON.stringify(jsonModel.project.tags));
        }
    }

    return summary;
};

const getDiagramType = (representation) => {
    let diagram = new Object();

    if (representation.attributes && representation.attributes.diagramType) {
        switch(representation.attributes.diagramType) {
        case 'CIA':
            diagram.diagramType = 'CIA';
            diagram.thumbnail = './public/content/images/thumbnail.cia.jpg';
            diagram.placeholder = 'New CIA diagram description';
            break;
        case 'DIE':
        case 'CIADIE':
            diagram.diagramType = 'CIADIE';
            diagram.thumbnail = './public/content/images/thumbnail.die.jpg';
            diagram.placeholder = 'New CIA-DIE diagram description';
            break;
        case 'LINDDUN':
            diagram.diagramType = 'LINDDUN';
            diagram.thumbnail = './public/content/images/thumbnail.linddun.jpg';
            diagram.placeholder = 'New LINDDUN diagram description';
            break;
        case 'PLOT4ai':
            diagram.diagramType = 'PLOT4ai';
            diagram.thumbnail = './public/content/images/thumbnail.plot4ai.jpg';
            diagram.placeholder = 'New PLOT4ai diagram description';
            break;
        case 'STRIDE':
            diagram.diagramType = 'STRIDE';
            diagram.thumbnail = './public/content/images/thumbnail.stride.jpg';
            diagram.placeholder = 'New STRIDE diagram description';
            break;
        default:
            diagram.diagramType = 'Generic';
            diagram.thumbnail = './public/content/images/thumbnail.jpg';
            diagram.placeholder = 'New generic diagram description';
        }
    } else {
        diagram.diagramType = 'Generic';
        diagram.thumbnail = './public/content/images/thumbnail.jpg';
        diagram.placeholder = 'New generic diagram description';
    }
    return diagram;
};

const convertDetail = (jsonModel) => {
    let detail = new Object();
    detail.contributors = [];
    detail.diagrams = [];
    detail.diagramTop = 0;
    detail.reviewer = '';
    detail.threatTop = 0;
    detail.representations = [];

    if (jsonModel.representations) {
        let diagramID = 0;
        jsonModel.representations.forEach(function(representation) {
            if (representation.type === 'diagram') {
                // threat dragon only knows about diagrams
                let diagram = getDiagramType(representation);
                diagram.cells = [];
                diagram.version = buildVersion;
                diagram.id = diagramID++;
                diagram.title = representation.name;
                diagram.description = representation.description;
                diagram.otmId = representation.id;
                diagram.size = representation.size;
                diagram.attributes = representation.attributes;
                detail.diagrams.push(diagram);
            } else {
                // keep records of any other representations
                detail.representations.push(representation);
            }
        });
        detail.diagramTop = diagramID;
    }

    return detail;
};

export const convert = function (jsonModel) {
    let dragonModel = new Object();

    dragonModel.version = buildVersion;
    dragonModel.otmVersion = jsonModel.otmVersion;
    dragonModel.summary = convertSummary(jsonModel);
    dragonModel.detail = convertDetail(jsonModel);

    console.log(dragonModel);
    /*
    jsonModel.components.forEach(function(comp) {
        var cell = new Object();
        cell.shape = 'process';
        cell.zIndex = 1;
        cell.id = comp.id;
        cell.data = new Object();
        cell.data.name = comp.name;
        cell.data.type = comp.representations[0].name;
        cell.position = new Object();
        cell.position.x = comp.representations[0].position.x;
        cell.position.y = comp.representations[0].position.y;
        cell.size = new Object();
        cell.size.width = comp.representations[0].size.width;
        cell.size.height = comp.representations[0].size.height;
        cell.attrs = new Object();
        cell.attrs.text = new Object();
        cell.attrs.text.text = comp.name;

        if (Object.hasOwn(comp, 'threats')) {
            cell.data.threats = [];
            comp.threats.forEach(function(threat) {
                var t = new Object();
                t.title = threat.name;
                t.id = threat.id;
                t.description = threat.description;
                t.status = threat.attributes[0].status;
                t.severity = threat.attributes[0].severity;
                t.mitigation = threat.attributes[0].mitigation;
                t.type = threat.attributes[0].type;
                t.modelType = threat.attributes[0].modelType;
                cell.data.threats.push(t);
            });
        }

        diagram.cells.push(cell);
    });

    jsonModel.dataflows.forEach(function(flow) {
        var cell = new Object();
        cell.shape = 'flow';
        cell.zIndex = 10;
        cell.id = flow.id;
        cell.data = new Object();
        cell.data.name = flow.name;
        cell.connector = 'smooth';
        if (Object.hasOwn(flow, 'representations')) {
            cell.data.type = flow.representations[0].name;
        }
        cell.width = 200;
        cell.height = 100;
        cell.source = new Object();
        cell.source.cell = flow.source;
        cell.target = new Object();
        cell.target.cell = flow.destination;
        cell.vertices = [];
        if (Object.hasOwn(flow, 'attributes')) {
            var vert = new Object();
            vert.x = flow.attributes[0].verticesX;
            vert.y = flow.attributes[0].verticesY;
            cell.vertices.push(vert);
        }
        cell.labels = [];
        var lbl = new Object();
        lbl.attrs = new Object();
        lbl.attrs.label = new Object();
        lbl.attrs.label.text = flow.name;
        cell.labels.push(lbl);

        if (Object.hasOwn(flow, 'threats')) {
            cell.data.threats = [];
            flow.threats.forEach(function(threat) {
                var t = new Object();
                t.title = threat.name;
                t.id = threat.id;
                t.description = threat.description;
                t.status = threat.attributes[0].status;
                t.severity = threat.attributes[0].severity;
                t.mitigation = threat.attributes[0].mitigation;
                t.type = threat.attributes[0].type;
                t.modelType = threat.attributes[0].modelType;
                cell.data.threats.push(t);
            });
        }

        diagram.cells.push(cell);
    });

    jsonModel.trustZones.forEach(function(zone) {
        var cell = new Object();
        cell.shape = 'trust-broundary-curve';
        cell.zIndex = 10;
        cell.id = zone.id;
        cell.data = new Object();
        cell.data.name = zone.name;
        cell.connector = 'smooth';
        cell.width = 200;
        cell.height = 100;
        if (Object.hasOwn(zone, 'attributes')) {
            cell.data.type = zone.attributes[0].type;
            cell.source = new Object();
            cell.source.x = zone.attributes[0].sourceX;
            cell.source.y = zone.attributes[0].sourceY;
            cell.target = new Object();
            cell.target.x = zone.attributes[0].targetX;
            cell.target.y = zone.attributes[0].targetY;
        }
        cell.vertices = [];
        zone.representations.forEach(function(rep) {
            var vert = new Object();
            vert.x = rep.position.x;
            vert.y = rep.position.y;
            cell.vertices.push(vert);
        });
        cell.labels = [];
        var lbl = new Object();
        lbl.attrs = new Object();
        lbl.attrs.label = new Object();
        lbl.attrs.label.text = zone.name;
        cell.labels.push(lbl);
        diagram.cells.push(cell);
    });

*/
    return dragonModel;
};

export default {
    convert
};
