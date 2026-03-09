/**
 * Normalize a shape (boundary or element) to a simple rect:
 */
export function normalizeRect(shape) {
    if (!shape) {
        throw new Error('normalizeRect: shape is required');
    }

    const x = shape.position && typeof shape.position.x === 'number'
        ? shape.position.x
        : shape.x;

    const y = shape.position && typeof shape.position.y === 'number'
        ? shape.position.y
        : shape.y;

    const width = shape.size && typeof shape.size.width === 'number'
        ? shape.size.width
        : shape.width;

    const height = shape.size && typeof shape.size.height === 'number'
        ? shape.size.height
        : shape.height;

    if (
        typeof x !== 'number' ||
    typeof y !== 'number' ||
    typeof width !== 'number' ||
    typeof height !== 'number'
    ) {
        throw new Error('normalizeRect: invalid shape geometry');
    }

    return { x, y, width, height };
}

/**
 * Returns true if a point lies strictly inside a rect (edges excluded).
 */
export function rectContainsPoint(rect, point) {
    const { x, y, width, height } = rect;
    const { x: px, y: py } = point;

    return px > x && px < x + width && py > y && py < y + height;
}

/**
 * Returns true if the center of inner lies inside outer.
 */
export function rectContainsRect(outerShape, innerShape) {
    const outer = normalizeRect(outerShape);
    const inner = normalizeRect(innerShape);

    const center = {
        x: inner.x + inner.width / 2,
        y: inner.y + inner.height / 2
    };

    return rectContainsPoint(outer, center);
}

/**
 * Given a boundary + list of elements, return IDs of elements
 * that are considered "inside" this boundary.
 */
export function getElementsInBoundary(boundary, elements) {
    if (!boundary) {
        throw new Error('getElementsInBoundary: boundary is required');
    }
    if (!Array.isArray(elements)) {
        throw new Error('getElementsInBoundary: elements must be an array');
    }

    const boundaryRect = normalizeRect(boundary);
    const insideIds = [];

    elements.forEach((el) => {
    // Don’t include the boundary itself
        if (!el || el.id === boundary.id) {
            return;
        }

        // Treat "tm.Flow" (or any element that has a 'points' array) as a line
        if (Array.isArray(el.points) && el.points.length > 0) {
            const intersects = el.points.some((p) =>
                rectContainsPoint(boundaryRect, p)
            );
            if (intersects) {
                insideIds.push(el.id);
            }
            return;
        }

        try {
            if (rectContainsRect(boundaryRect, el)) {
                insideIds.push(el.id);
            }
        } catch (err) {
            console.error('Error getting elements inside trust boundary:', err);
        }
    });

    return insideIds;
}

/**
 * Given a diagram object (like a Threat Dragon diagram JSON),
 * return a NEW diagram object where all tm.Boundary cells have a
 * 'contains' array with the IDs of elements that lie inside them.
 */
export function annotateDiagramWithBoundaryMembership(diagram) {
    if (!diagram || !Array.isArray(diagram.cells)) {
        throw new Error('annotateDiagramWithBoundaryMembership: diagram.cells must be an array');
    }

    const { cells } = diagram;

    const annotatedCells = cells.map((cell) => {
        if (cell && cell.shape === 'tm.Boundary') {
            const contains = getElementsInBoundary(cell, cells);
            return { ...cell, contains };
        }
        return cell;
    });

    return {
        ...diagram,
        cells: annotatedCells
    };
}
