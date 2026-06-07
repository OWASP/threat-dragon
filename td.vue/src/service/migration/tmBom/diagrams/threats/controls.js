import boundaries from './boundaries';

const mitigated = ['Mitigated', 'assumed', 'active', 'retired', 'wont_do'];
const tdSeverity = ['TBD', 'Low', 'Medium', 'High', 'Critical'];
const tmBomPriority = ['none', 'low', 'medium', 'high', 'critical'];

const calcSeverity = (severity, priority) => {
    return tmBomPriority.indexOf(priority) > tdSeverity.indexOf(severity) ? tdSeverity[tmBomPriority.indexOf(priority)] : severity;
};

const merge = (model, tdThreats) => {

    model.controls?.forEach((control) => {
        control = boundaries.merge(model, control);
        for (const threat of control.threats) {
            tdThreats.forEach((tdThreat) => {
                if (threat === tdThreat.id) {
                    tdThreat.mitigation += '\n' + control.status.replaceAll('_', ' ') + ': ' + control.title + '\n';
                    tdThreat.mitigation += control.description + '\n';
                    tdThreat.status = mitigated.includes(tdThreat.status) || mitigated.includes(control.status) ? 'Mitigated' : 'Open';
                    tdThreat.severity = calcSeverity(tdThreat.severity, control.priority);
                }
            });
        }
    });


    return tdThreats;
};

export default {
    merge
};
