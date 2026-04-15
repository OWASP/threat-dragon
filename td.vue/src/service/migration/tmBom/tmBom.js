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
const version = '2.4.1';

const read = (model) => {

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

const write = (model) => {
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

export default {
    read,
    version,
    write
};
