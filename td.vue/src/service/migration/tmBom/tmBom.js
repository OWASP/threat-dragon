import summary from './summary';
import detail from './detail';
import scope from './scope';

/* why use a hard coded Threat Dragon version here?
 * the build version may increase for Threat Dragon, but this conversion / migration
 * has been written for a particular version of Threat Dragon
 * wich may not be the latest given in package.lock
 * Note : when this is revised, then change this version to match
 */
const tdVersion = '2.6.1';
const tmbomVersion = '1.0.2';

const createKey = (source, target, key) => {
    if (Object.hasOwn(source, key)) {
        target[key] = source[key];
    }
};

// export a Threat Dragon file to TM-BOM format
// required keys for TM-BOM:
// version, scope, trust_zones, trust_boundaries
// actors, components, data_stores, data_sets, data_flows
const exportAsTmbom = (model) => {
    let tmModel = new Object();

    // compatibility object exists if original file was also TM-BOM
    tmModel.version = model.compatibility?.version || tmbomVersion;

    if (model.compatibility) {
        // optional key values
		createKey(model.compatibility, tmModel, 'description');
        createKey(model.compatibility, tmModel, 'frozen');
		createKey(model.compatibility, tmModel, 'released_at');
		createKey(model.compatibility, tmModel, 'product_release_date');
        createKey(model.compatibility, tmModel, 'release_docs_link');
        createKey(model.compatibility, tmModel, 'reviewed_at');
        createKey(model.compatibility, tmModel, 'repo_link');
    }

    tmModel.scope = scope.convert(model);

    console.debug(JSON.stringify(tmModel, null, 2));
    return tmModel;
};

// import a TM-BOM file to Threat Dragon format
export const importTmbom = (model) => {

    // required values not used by TD but need to be preserved
    let compatibility = {
        version: model.version,
        description: model.description,
    };

    // optional values need to be preserved but only if present
    createKey(model, compatibility, 'frozen');
    createKey(model, compatibility, 'release_docs_link');
    createKey(model, compatibility, 'reviewed_at');
    createKey(model, compatibility, 'repo_link');

    return {
        summary: summary.merge(model),
        detail: detail.merge(model, tdVersion),
        version: tdVersion,
        compatibility
    };
};

// read a TM-BOM file
const read = (model) => {
    // not supported yet, return an empty Threat Dragon model with TM-BOM attached
    return {
        version: tdVersion,
        summary: {
            title: model.scope.title,
            description: 'Empty Threat Dragon model from a TM-BOM',
        },
        detail: [],
        tmBom: model
    };

};

// write a TM-BOM file
const write = (model) => {
    // not supported yet, so return a nearly empty TM=BOM
    return {
        version: tmbomVersion,
        scope: {
            title: model.tmBom.scope.title,
            description: 'Empty Threat Model Bill of Materials (TM-BOM)',
            business_criticality: '',
            data_sensitivity: '',
            exposure: '',
            tier: ''
        },
        trust_zones: [],
        trust_boundaries: [],
        actors: [],
        components: [],
        data_stores: [],
        data_sets: [],
        data_flows: []
    };
};

export default {
    exportAsTmbom,
    importTmbom,
    read,
    write
};
