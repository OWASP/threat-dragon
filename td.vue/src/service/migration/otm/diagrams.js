import cells from '@/service/migration/otm/cells/cells';
import components from '@/service/migration/otm/cells/components';

const merge = (model, version) => {
    const diagrams = {diagrams: [], codeRepresentations: [], codeComponents: []};
    const thumbnail = './public/content/images/thumbnail.jpg';

    let diagramId = 0;
    model.representations?.forEach((representation) => {
        if (representation.type === 'diagram') { // POD only has diagrams
            const diagram = {
                diagramType: 'OTM',
                id: diagramId++,
                thumbnail: thumbnail,
                title: representation.name, // required OTM value
                version: version,
                cells: cells.merge(model, representation.id),
                description: representation.description,
                compatibility: {
                    otmId: representation.id, // required OTM value
                }
            };
            if (representation.size) {
                diagram.compatibility.size = representation.size;
            }
            if (representation.attributes) {
                diagram.compatibility.attributes = JSON.parse(JSON.stringify(representation.attributes));
            }
            diagrams.diagrams.push(diagram);
        } else { // other representations such as code or threat-model (TMT)
            diagrams.codeRepresentations.push(representation);
            // along with the components associated with the representation
            diagrams.codeComponents.push(...components.list(model, representation.id));
        }
    });

    return diagrams;
};

export default {
    merge
};
