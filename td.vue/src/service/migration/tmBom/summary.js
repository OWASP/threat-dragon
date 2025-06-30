import assumptions from './diagrams/assumptions';

const read = (model) => {
    let summary = new Object();

    if (model.scope) {
        summary.title = model.scope.title;
        summary.owner = '';
        summary.description = model.scope.description;
        summary.id = 0;
    
        // not editable/visible (yet) by TD, but need to be preserved if present
        summary.compatibility = {
            business_criticality: model.scope.business_criticality,
            data_sensitivity: model.scope.data_sensitivity,
            exposure: model.scope.exposure,
            tier: model.scope.tier
        };
    }

    // add assumptions to the description
    let summaryAssumptions = assumptions.summary(model);
    if (summaryAssumptions.length) {
        let id = 1;
        summary.description += '\n\n';

        summaryAssumptions.forEach((assumption) => {
            summary.description += assumption.validity + ' ' + 'assumption #' + id + ': ';
            summary.description += assumption.description + '\n';
            id++;
        });
    }
    
    return summary;
};

const write = (model) => {
    let scope = new Object();

    scope.title = model.summary.title;
    scope.description = model.summary.description;

    // reinstate keys not used (yet) by TD
    if (model.summary.compatibility) {
        scope.business_criticality = model.summary.compatibility.business_criticality;
        scope.data_sensitivity = model.summary.compatibility.data_sensitivity;
        scope.exposure = model.summary.compatibility.exposure;
        scope.tier = model.summary.compatibility.tier;
    }

    return scope;
};

export default {
    read,
    write
};
