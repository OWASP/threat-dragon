const read = (model, version) => {
    const diagrams = new Array();
    var id = 0;
    var thumbnail = './public/content/images/thumbnail.jpg';
    
    if (model.diagrams) {
        let modelDiagrams = model.diagrams;

        modelDiagrams.forEach((diagram) => {
            diagrams.push({
			    'version': version,
			    'title': diagram.title,
			    'thumbnail': thumbnail,
			    'diagramType': diagram.type,
			    'id': id });
            id++;
        });
    }

    return diagrams;
};

export default {
    read
};
