import assumptions from '../assumptions';
import controls from './controls';
import personas from './personas';
import risks from './risks';

const applyThreats = (threats, components) => {
    threats.forEach((threat) => {
        if (threat.components_affected) {
            threat.components_affected.forEach((affected) => {
                components.forEach((component) => {
	                if (affected === component.id) {
	                    component.data.threats.push(threat);
	                }
                });
            });
        }
    });
    return components;
};

export const findThreats = (model) => {
    let tdThreats = new Array();

    model.threats?.forEach((threat) => {
        let description = threat.description;

        if (threat.event) {
            description += '\nOn event : ' + threat.event;
        }

        if (threat.attack_mechanisms) {
            let mechanisms = threat.attack_mechanisms;
            description += '\nUsing attack mechanism : ';
            mechanisms.forEach((mechanism) => {
                description += '\n' + ' CAPEC-' + mechanism.capec_id + ' : ' + mechanism.capec_title;
            });
        }

        if (threat.weaknesses) {
            let weaknesses = threat.weaknesses;
            description += '\nExploiting weakness : ';
            weaknesses.forEach((weakness) => {
                description += '\n' + ' CWE-' + weakness.cwe_id + ' : ' + weakness.cwe_title;
            });
        }

        if (threat.sources) {
            description += '\nExample attack vectors are from ' + threat.sources;
        }

        if (threat.threat_persona) {
            description += '\n' + personas.merge(model, threat.symbolic_name);
        }

        tdThreats.push({
            status: 'Open',
            severity: 'TBD',
            description: description,
            title: threat.title,
            type: 'Generic',
            mitigation: '',
            modelType: 'Generic',
            id: threat.symbolic_name
        });
    });

    return tdThreats;
};

export const merge = (model, components) => {
    let threats = findThreats(model);
    threats = controls.merge(model, threats);
    threats = assumptions.merge(model, threats);
    threats = risks.merge(model, threats);
    components = applyThreats(threats, components);
    return components;
};

export default {
    merge
};
