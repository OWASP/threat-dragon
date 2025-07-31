import summary from './summary';
import detail from './detail';

/* why use a hard coded Threat Dragon version here?
 * the build version may increase for Threat Dragon, but this conversion / migration
 * has been written for a particular version of Threat Dragon
 * wich may not be the latest given in package.lock
 * Note : when this is revised, then change this version to match
 */
const version = '2.4.1';

const read = (model) => {

    // not used (yet) by TD, but needs to be preserved if present
    let compatibility = {
        version: model.version,
        description: model.description,
        frozen: model.frozen,
        release_docs_link: model.release_docs_link,
        reviewed_at: model.reviewed_at,
        repo_link: model.repo_link
    };

    return {
        summary: summary.read(model),
        detail: detail.read(model, version),
        version: version,
        compatibility
    };
};

const write = (model) => {
    let tmModel = new Object();

    tmModel.version = model.compatibility ? model.compatibility.version : '1.0';

    tmModel.scope = summary.write(model);

    if (model.compatibility) {
        tmModel.description = model.compatibility.description,
        tmModel.frozen = model.compatibility.frozen,
        tmModel.release_docs_link = model.compatibility.release_docs_link,
        tmModel.reviewed_at = model.compatibility.reviewed_at,
        tmModel.repo_link = model.compatibility.repo_link;
    }

    return tmModel;
};

export default {
    read,
    version,
    write
};
