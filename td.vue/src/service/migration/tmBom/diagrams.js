const read = (model) => {
    const diagrams = new Array();
    
    if (model.diagrams) {
        diagrams.push({'title': model.diagrams[0].title});
    }
    return diagrams;
};

export default {
    read
};
