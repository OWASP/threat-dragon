import summary from './summary';
import detail from './detail';

const copyHasKey = (source, target, key) => {
    if (Object.hasOwn(source, key)) {
        target[key] = source[key];
    }
};

/* why use a hard coded Threat Dragon version here?
 * the build version may increase for Threat Dragon, but this conversion / migration
 * has been written for a particular version of Threat Dragon
 * wich may not be the latest given in package.lock
 * Note : when this is revised, then change this version to match
 */
const version = '2.6.1';

// import a TM-BOM file to Threat Dragon format
const importTmbom = (model) => {

    // required values not used by TD but need to be preserved
    let compatibility = {
        version: model.version,
        description: model.description,
    };

    // optional values need to be preserved if present
    copyHasKey(model, compatibility, 'frozen');
    copyHasKey(model, compatibility, 'release_docs_link');
    copyHasKey(model, compatibility, 'reviewed_at');
    copyHasKey(model, compatibility, 'repo_link');

    return {
        summary: summary.read(model),
        detail: detail.read(model, version),
        version: version,
        compatibility
    };
};

// export a Threat Dragon file to TM-BOM format
const exportTd = (model) => {
    let tmModel = new Object();

    // compatibility object exists if original file was also TM-BOM
    // required values
    tmModel.version = model?.compatibility?.version || '1.0.1';
    tmModel.description = model?.compatibility?.description || 'Export from Threat Dragon model';

    if (model.compatibility) {
        // optional key values
        copyHasKey(model.compatibility, tmModel, 'frozen');
        copyHasKey(model.compatibility, tmModel, 'release_docs_link');
        copyHasKey(model.compatibility, tmModel, 'reviewed_at');
        copyHasKey(model.compatibility, tmModel, 'repo_link');
    }

    tmModel.scope = summary.write(model);

    return tmModel;
};

// read a TM-BOM file
const read = (model) => {
    // not supported yet, return an empty Threat Dragon model with TM-BOM attached
    return {
        version: version,
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
        version: '1.0.2',
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
    exportTd,
    importTmbom,
    read,
    version,
    write
};
