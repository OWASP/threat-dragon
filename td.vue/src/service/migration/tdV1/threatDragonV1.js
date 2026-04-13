import { v4 as uuidv4 } from 'uuid';

import detail from './detail';

const version = require('../../../../package.json').version;

const convertSummary = (summary) => {

    return {
        title: summary.title,
        owner: summary.owner || '',
        description: summary.description || '',
        id: uuidv4()
    };
};

const read = (model) => {
    return {
        version: version,
        summary: convertSummary(model.summary),
        detail: detail.read(model.detail, version)
    };
};

export default {
    read,
    version
};
