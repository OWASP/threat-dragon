const merge = (model, stores) => {
    if (model.data_sets) {
	    model.data_sets.forEach((data_set) => {
            data_set.placements.forEach((placement) => {
                stores.forEach((store) => {
                    if (placement.data_store === store.id) {
                        store.data.description += '\nData set: ' +  data_set.title;
                        store.data.description += '\n' +  data_set.description;
                        if (placement.encrypted) {
                            store.data.isEncrypted = true;
                        }
                        store.data.description += data_set?.record_count ? '\n Record count maximum of ' + data_set.record_count : '\n Records';
                        store.data.description += ' with data sensitivity of ' +  data_set.data_sensitivity.toString();
                        store.data.description += data_set?.access_control_methods ? ' and access control methods of ' + data_set.access_control_methods.toString() + '\n' : '\n';
                    }
                });
            });
	    });
    }

    return stores;
};

export default {
    merge
};
