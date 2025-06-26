import defaultProperties from '@/service/entity/default-properties.js';

const read = (model) => {
    const flows = placeFlows(model);

    return flows;
};

const placeFlows = (model) => {
    let flows = new Array();
    let zIndex = 0;

    if (model.data_flows) {
        let data_flows = model.data_flows;
        data_flows.forEach((data_flow) => {
            let flow = defaultProperties.defaultEntity('tm.Flow');
            flow.data.name = flow.labels[0].attrs.labelText.text = data_flow.title;
            flow.data.description = data_flow.description;
            flow.data.isEncrypted = data_flow.encrypted;
            flow.id = data_flow.symbolic_name;
            flow.zIndex = zIndex++;
            flow.source.cell = data_flow.source.object;
            flow.target.cell = data_flow.destination.object;
            flows.push(flow);
        });
    }

    return flows;
};

export default {
    placeFlows,
    read
};
