import { v4 as uuidv4 } from 'uuid';

const calculateSeverity = (score) => {
    let severity;
    if (score >= 9) {
        severity = 'Critical';
    } else if (score >= 7) {
        severity = 'High';
    } else if (score >= 4) {
        severity = 'Medium';
    } else {
        severity = 'Low';
    }
    return severity;
};

const addMitigations = (model, mitigations) => {
    let mitigation = '';
    if (!mitigations || !model.mitigations) {
        return mitigation;
    }

    for (const nodeMitigation of mitigations) {
        let found = false;
        for (const modelMitigation of model.mitigations) {
            if (nodeMitigation.mitigation === modelMitigation.id) {
                found = true;
                mitigation = 'Mitigation applied: ' + modelMitigation.name;
                mitigation += ' with risk reduction ' + modelMitigation.riskReduction + ' %';
                if (modelMitigation.description) {
                    mitigation += '\n' + modelMitigation.description;
                }
            }
        }
        if (found === false) {       
            console.warn('Could not find a match for mitigation ID: ' + nodeMitigation.mitigation);
        }
    }
    return mitigation;
};

export const merge = (model, node) => {
    const threats = [];
 
    if (!node.threats || !model.threats) {
        return threats;
    }
    
    for (const nodeThreat of node.threats) {
        let found = false;
        for (const modelThreat of model.threats) {
            if (nodeThreat.threat === modelThreat.id) {
                found = true;
                const score = modelThreat.risk.likelihood * modelThreat.risk.impact / 1000;
                const threat = {
                    id: uuidv4(),
                    title: modelThreat.name,
                    description: modelThreat?.description || '',
                    type: modelThreat?.categories ? modelThreat.categories[0] : 'Generic',
                    modelType: modelThreat?.categories ? 'STRIDE' : 'Generic',
                    new: false,
                    score: score.toString(),
                    severity: calculateSeverity(score),
                    status: 'Open' // no reasonable way of calculating this from OTMs freeform strings
                };
                if (modelThreat.risk.likelihoodComment) {
                    threat.description += '\nRisk likelihood: ' + modelThreat.risk.likelihoodComment;
                }
                if (modelThreat.risk.impactComment) {
                    threat.description += '\nRisk impact: ' + modelThreat.risk.impactComment;
                }
                threat.mitigation = addMitigations(model, nodeThreat.mitigations);
                threats.push(threat);
            }
        }
        if (found === false) {       
            console.warn('Could not find a match for threat ID: ' + nodeThreat.threat);
        }
    }
    
    return threats;
};

export default {
    merge
};
