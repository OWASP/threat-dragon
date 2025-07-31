const merge = (model, tdThreats) => {

    if (model.risks) {
        for (const risk of model.risks) {
            // risks have a threats array, else the model would not pass the schema test
            for (const threat of risk.threats) {
                for (let tdThreat of tdThreats) {
                    if (tdThreat.id === threat) {
                        tdThreat.description += '\nRisk Identified: ' + risk.title;
                        tdThreat.description += '\n' + risk.description;
                        tdThreat.description += '\nThis is a ' + risk.level;
                        tdThreat.description += ' risk with a ' + risk.likelihood + ' liklihood';
                        tdThreat.description += ' and  ' + risk.impact + ' impact:';
                        tdThreat.description += '\n' + risk.impact_description;
                        tdThreat.score = risk.score > tdThreat.score ? risk.score : tdThreat.score;
                    }
                }
            }

        }
    }

    return tdThreats;
};

export default {
    merge
};
