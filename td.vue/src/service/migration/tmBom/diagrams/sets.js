const merge = (model, components) => {
    if (model.data_sets) {
	    let data_sets = model.data_sets;
	    data_sets.forEach((data_set) => {
            let placements = data_set.placements;
            placements.forEach((placement) => {
                components.forEach((component) => {
                    if (placement.data_store === component.id) {
                        component.data.description += '\nData set: ' +  data_set.title;
                        component.data.description += '\n' +  data_set.description;
                        if (placement.encrypted) {
                            component.data.isEncrypted = true;
                        }
                        component.data.description += '\n Record count maximum of ' +  data_set.record_count;
                        component.data.description += ' with data sensitivity of ' +  data_set.data_sensitivity.toString();
                        component.data.description += ' and access control methods of ' +  data_set.access_control_methods.toString();
                    }
                });
            });
	    });
    }

    return components;
};

export default {
    merge
};
