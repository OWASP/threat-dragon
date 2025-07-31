const merge = (model, components) => {
    
    if (model.assumptions) {
        let assumptions = model.assumptions;
        assumptions.forEach((assumption) => {
            let topics = assumption.topics;
            if (topics) {
                topics.forEach((topic) => {
                    components.forEach((component) => {
                        if (topic === component.id) {
                            component.data.description += '\n' + assumption.validity + ' ' + 'assumption : ';
                            component.data.description += assumption.description + '\n';
                        }
                    });
                });
            }
        });
    }

    return components;
};

const summary = (model) => {
    let summaryAssumptions = new Array();

    if (model.assumptions) {
        let assumptions = model.assumptions;

        assumptions.forEach((assumption) => {
            if (!assumption.topics) {
                summaryAssumptions.push(assumption);
            }
        });
    }

    return summaryAssumptions;
};

export default {
    merge,
    summary
};
