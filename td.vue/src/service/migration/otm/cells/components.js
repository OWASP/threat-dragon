const merge = (model, otmId) => {
    const components = [];

    model.components?.forEach((component) => {
        component.representations?.forEach((representation) => {
            if (representation.representation === otmId) {
                components.push(component);
            }
        });
    });

    return components;
};

export default {
    merge
};
