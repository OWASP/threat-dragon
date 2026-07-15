const defaultTitle = 'Import from Open Threat Model';

const merge = (model) => {
    const summary = new Object();

    if (model.project) {
        summary.id = model.project.id; // required OTM value
        summary.title = model.project.name; // required OTM value
        summary.owner = '';

        summary.description = model.project?.description ? model.project.description : '';

        if (model.project.owner) {
            summary.owner = model.project.owner;
        }

        // not editable/visible (yet) by TD, but preserve if present
        summary.compatibility = {
            ownerContact: model.project.ownerContact
        };

        // both attributes and tags are not used yet by TD, but preserve if present
        if (model.project.attributes) {
            summary.compatibility.attributes = JSON.parse(JSON.stringify(model.project.attributes));
        }
        if (model.project.tags) {
            summary.compatibility.tags = JSON.parse(JSON.stringify(model.project.tags));
        }
    } else {
        // POD summary must always have a title
        summary.title = defaultTitle;
    }
    
    return summary;
};

export default {
    merge
};
