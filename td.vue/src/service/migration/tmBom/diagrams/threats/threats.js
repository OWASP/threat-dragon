import controls from './controls';
import assumptions from '../assumptions';
import risks from './risks';

const merge = (model, components) => {
    let tdThreats = findThreats(model);
    tdThreats = controls.merge(model, tdThreats);
    tdThreats = assumptions.merge(model, tdThreats);
    tdThreats = risks.merge(model, tdThreats);
    components = placeThreats(tdThreats, components);
    return components;
};

const findThreats = (model) => {
    let tdThreats = new Array();

    if (model.threats) {
        let threats = model.threats;
        let personas = findPersonas(model);

        threats.forEach((threat) => {
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
                description += '\n' + personas[threat.threat_persona];
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
    }

    return tdThreats;
};

const findPersonas = (model) => {
    let personas = new Object();

    if (model.threat_personas) {
        let threat_personas = model.threat_personas;
        threat_personas.forEach((persona) => {
            let description = persona.is_person ? persona.title : 'Automated threat ' + persona.title;
            description += ' with ' + persona.access_level + ' access level privileges\n';
            description += persona.description;
            description += '\nSkill level is ' + persona.skill_level;
            description += ' with ' + persona.applicability_to_org + ' applicability to the organization';
            if (persona.malicious_intent) {
                description += ' and malicious intent';
            }
            Object.assign(personas, {[persona.symbolic_name]: description});
        });
    }
    return personas;
};

const placeThreats = (tdThreats, components) => {
    tdThreats.forEach((tdThreat) => {
        if (tdThreat.components_affected) {
            tdThreat.components_affected.forEach((affected) => {
                components.forEach((component) => {
	                if (affected === component.id) {
	                    component.data.threats.push(tdThreat);
	                }
                });
            });
        }
    });
    return components;
};

export default {
    findPersonas,
    findThreats,
    placeThreats,
    merge
};
