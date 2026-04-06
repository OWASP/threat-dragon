import detail from './detail';

const version = require('../../../../package.json').version;

const read = (model) => {
    return {
        summary: model.summary,
        detail: detail.read(model.detail, version),
        version: version
    };
};

export default {
    read,
    version
};
