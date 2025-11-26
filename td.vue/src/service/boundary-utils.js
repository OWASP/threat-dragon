//functions to determine which diagram elements (processes, stores, actors, flows) are inside a trust boundary based on geometry
export function isElementInsideBoundary(elementBBox, boundaryBBox) {
    //returns TRUE if element's bounding box lies fully inside boundary box
    return (
        elementBBox.x >= boundaryBBox.x &&
        elementBBox.y >= boundaryBBox.y &&
        elementBBox.x + elementBBox.width <= boundaryBBox.x + boundaryBBox.width &&
        elementBBox.y + elementBBox.height <= boundaryBBox.y + boundaryBBox.height
    );
}

export function getElementsInsideBoundary(graph, boundaryCell) {
    const inside = [];
    //x6 built-in
    const boundaryBBox = boundaryCell.getBBox();

    graph.getCells().forEach(cell => {
        if (cell.id === boundaryCell.id) return;
        //ignore edges
        if (!cell.isNode?.()) return; 

        const elBBox = cell.getBBox();

        if (isElementInsideBoundary(elBBox, boundaryBBox)) {
            inside.push(cell);
        }
    });

    return inside;
}

export function doesFlowCrossBoundary(flowCell, boundaryCell) {
    const boundaryBBox = boundaryCell.getBBox();
    //start to end (X6 API)
    const points = flowCell.getPoints(); 

    const [start, end] = points;

    const startInside =
        start.x >= boundaryBBox.x &&
        start.y >= boundaryBBox.y &&
        start.x <= boundaryBBox.x + boundaryBBox.width &&
        start.y <= boundaryBBox.y + boundaryBBox.height;

    const endInside =
        end.x >= boundaryBBox.x &&
        end.y >= boundaryBBox.y &&
        end.x <= boundaryBBox.x + boundaryBBox.width &&
        end.y <= boundaryBBox.y + boundaryBBox.height;

    //one inside + one outside means crosses boundary
    return startInside !== endInside;
}

