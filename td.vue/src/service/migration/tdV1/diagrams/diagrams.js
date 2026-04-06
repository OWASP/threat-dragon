const read = (v1Diagrams, version) => {
    var v2diagrams = new Array();

    v1Diagrams?.forEach((v1Diagram) => {
	    v2diagrams.push({
		    version: version,
		    title: v1Diagram.title,
		    thumbnail: v1Diagram.thumbnail,
		    diagramType: v1Diagram.diagramType,
		    id: v1Diagram.id
	    });
    });

    return v2diagrams;
};

export default {
    read
};
