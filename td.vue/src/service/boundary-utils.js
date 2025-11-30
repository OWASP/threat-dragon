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

export function getElementsInsideBoundary(cells, boundaryCell) {
    const inside = [];
    //x6 built-in
    const boundaryBBox = boundaryCell.getBBox();

    cells.forEach(cell => {
        //ignore edges and this trust boundary itself
        if (!(cell.id === boundaryCell.id) && !(cell.shape === 'flow')){
            if (!cell.isNode?.()) return; 

            const elBBox = cell.getBBox();

            if (isElementInsideBoundary(elBBox, boundaryBBox)) {
                inside.push(cell);
            }
        }
    });
    return inside;
}

export function doesFlowCrossBoundary(flowCell, boundaryCell, cells) {
    const includedEndpoints = getElementsInsideBoundary(cells, boundaryCell);

    return includedEndpoints.includes(flowCell.getSourceCell()) !== includedEndpoints.includes(flowCell.getTargetCell());
}

export function getBoundariesCrossedByFlow(flowCell, cells){
    const crossedBoundaries = [];
    cells.forEach(boundary => {
        if (boundary.shape === 'trust-boundary-box' || boundary.shape === 'trust-boundary-curve') {
            if(doesFlowCrossBoundary(flowCell, boundary, cells)){
                crossedBoundaries.push(boundary.id);
            };
        }
    });
    return crossedBoundaries;
}

export function getFlowsCrossedByBoundary(boundaryCell, cells){
    const crossedFlows = [];
    cells.forEach(flow => {
        if (flow.shape === 'flow') {
            if(doesFlowCrossBoundary(flow, boundaryCell, cells)){
                crossedFlows.push(flow.id);
            };
        }
    });
    return crossedFlows;
}
