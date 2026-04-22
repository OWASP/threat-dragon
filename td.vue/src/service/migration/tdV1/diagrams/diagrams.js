import cells from './cells.js';
import eng from '@/i18n/en.js';

const getPlaceholder = (diagramType) => {
    let type = diagramType.toLowerCase();

    // v1.x only had STRIDE, LINDDUN and CIA
    // so no fixups needed for types 'CIADIE' and 'EoP Games'

    return eng.threatmodel.diagram[type].defaultDescription;
};

const read = (v1Diagrams, version) => {
    let v2diagrams = new Array();

    v1Diagrams?.forEach((v1Diagram) => {
        let elements = cells.map(v1Diagram);

        v2diagrams.push({
            description: '',
            diagramType: v1Diagram.diagramType,
            id: v1Diagram.id,
            placeholder: getPlaceholder(v1Diagram.diagramType),
            thumbnail: v1Diagram.thumbnail,
            title: v1Diagram.title,
            version: version,
            cells: JSON.parse(JSON.stringify(elements.nodes.concat(elements.edges)))
        });

    });

    return v2diagrams;
};

export default {
    read
};
