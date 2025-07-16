import boundaries from './boundaries';

const merge = (model, tdThreats) => {
    
    if (model.controls) {
        let controls = model.controls;

        controls.forEach((control) => {
            let threats = control.threats;
            if (threats) {
                threats.forEach((threat) => {
                    tdThreats.forEach((tdThreat) => {
                        if (threat === tdThreat.id) {
                            tdThreat.mitigation += control.status + ': ' + control.title + '\n';
                            tdThreat.mitigation += control.description + '\n';
                            tdThreat.status = findStatus(tdThreat.status, control.status);
                            tdThreat.severity = findSeverity(tdThreat.severity, control.priority);
                        }
                    });
                });
            }
            control = boundaries.merge(model, control);
        });
    }

    return tdThreats;
};

const findStatus = (tdStatus, status) => {
    const mitigated = ['assumed', 'active'];
    if (tdStatus === 'Mitigated') {
        return tdStatus;
    }
    return mitigated.includes(status) ? 'Mitigated' : 'Open';
};

const findSeverity = (tdSeverity, priority) => {
    const severities = ['None', 'TBD', 'Low', 'Medium', 'High', 'Critical'];
    priority = priority[0].toUpperCase() + priority.slice(1);

    return severities.indexOf(priority) > severities.indexOf(tdSeverity) ? priority : tdSeverity;
};

export default {
    merge
};
