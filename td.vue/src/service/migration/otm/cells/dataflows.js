import properties from './properties.js';

const merge = (model, dataflow) => {
    const flow = properties.flowProperties(dataflow);
    flow.id = dataflow.id; // OTM required value
    flow.data.description = properties.combineDescription(model, dataflow);
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
