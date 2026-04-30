const merge = (model, id) => {
    let description = '';

    // TM-BOMs must have at least one threat persona
    for (let persona of model.threat_personas) {
        if (id === persona.symbolic_name) {
	        description = persona.is_person ? persona.title : 'Automated threat ' + persona.title;
	        description += ' with ' + persona.access_level + ' access level privileges\n';
	        description += persona.description;
	        description += '\nSkill level is ' + persona.skill_level.replaceAll('_', ' ');
	        description += ' with ' + persona.applicability_to_org + ' applicability to the organization';
	        if (persona.malicious_intent) {
	            description += ' and malicious intent';
	        }
            // only one persona per threat
            break;
        }
    }

    return description;
};

export default {
    merge
};
