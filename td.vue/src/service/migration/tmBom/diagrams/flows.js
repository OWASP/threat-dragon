import defaultProperties from '@/service/entity/default-properties.js';

const convert = (_model) => { // eslint-disable-line no-unused-vars
    let data_flows = new Array();

    return data_flows;
};

const merge = (model) => {
    let flows = new Array();
    let zIndex = 0;

    if (model.data_flows) {
        for (let dataFlow of model.data_flows) {
            let flow = defaultProperties.defaultEntity('tm.Flow');
            flow.data.name = flow.labels[0].attrs.labelText.text = dataFlow.title;
            flow.data.description = dataFlow.description;
            flow.data.isEncrypted = dataFlow.encrypted;
            flow.id = dataFlow.symbolic_name;
            flow.zIndex = zIndex++;
            flow.source.cell = dataFlow.source.object;
            flow.target.cell = dataFlow.destination.object;
            flows.push(flow);
        }
    }

    return flows;
};

export default {
    convert,
    merge
};
