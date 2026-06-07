import assumptions from './diagrams/assumptions';

const merge = (model) => {
    const summary = new Object();

    if (!model.scope) {
        console.warn('Missing TM-BOM scope which is a required object');
        return summary;
    }

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

    // add any assumptions to the description
    const summaryAssumptions = assumptions.summary(model);
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

export default {
    merge
};
