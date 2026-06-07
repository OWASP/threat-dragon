const convert = (model) => {
    const scope = new Object();
    // required keys for TM-BOM scope:
    //    title, description, business_criticality, data_sensitivity, exposure, tier

    scope.title = model.summary.title;
    scope.description = model.summary?.description || 'Export from Threat Dragon model';

    // reinstate keys not used (yet) by TD if carried in compatibility
    scope.business_criticality = model.summary.compatibility?.business_criticality || 'moderate';
    scope.data_sensitivity = model.summary.compatibility?.data_sensitivity || ['op'];
    scope.exposure = model.summary.compatibility?.exposure || 'internal';
    scope.tier = model.summary.compatibility?.tier || 'important';

    return scope;
};

export default {
    convert
};
