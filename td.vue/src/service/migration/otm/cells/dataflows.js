import defaultProperties from '@/service/entity/default-properties.js';

const merge = (dataflow) => {
    const flow = defaultProperties.defaultEntity('tm.Flow');

    flow.data.name = flow.labels[0].attrs.labelText.text = dataflow.name; // OTM required value
    flow.data.description = dataflow?.description || '';
    flow.id = dataflow.id; // OTM required value
    flow.source.cell = dataflow.source; // OTM required value
    flow.target.cell = dataflow.destination; // OTM required value

    if (dataflow.bidirectional) {
        flow.data.isBidirectional = dataflow.bidirectional;
    }

    flow.compatibility = {
        attributes: dataflow.attributes || undefined,
        tags: dataflow.tags || undefined
    };

    return flow;
};

export default {
    merge
};
