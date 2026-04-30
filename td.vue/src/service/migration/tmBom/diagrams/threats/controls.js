import boundaries from './boundaries';

const mitigated = ['Mitigated', 'assumed', 'active', 'retired', 'wont_do'];

const findSeverity = (severity, priority) => {
    const tdSeverities = ['TBD', 'Low', 'Medium', 'High', 'Critical'];
    const tmBomPriorities = ['none', 'low', 'medium', 'high', 'critical'];

    let highestPriority = tmBomPriorities.indexOf(priority) > tdSeverities.indexOf(severity) ? priority : severity;

    return highestPriority[0].toUpperCase() + highestPriority.slice(1);
};

const merge = (model, tdThreats) => {

    model.controls?.forEach((control) => {
        control = boundaries.merge(model, control);
        for (let threat of control.threats) {
            tdThreats.forEach((tdThreat) => {
                if (threat === tdThreat.id) {
                    tdThreat.mitigation += '\n' + control.status.replaceAll('_', ' ') + ': ' + control.title + '\n';
                    tdThreat.mitigation += control.description + '\n';
                    tdThreat.status = mitigated.includes(tdThreat.status) || mitigated.includes(control.status) ? 'Mitigated' : 'Open';
                    tdThreat.severity = findSeverity(tdThreat.severity, control.priority);
                }
            });
        }
    });


    return tdThreats;
};

export default {
    merge
};
