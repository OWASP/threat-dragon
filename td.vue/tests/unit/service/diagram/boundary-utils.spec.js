import boundaryUtils from '@/service/diagram/boundary-utils';

const boundaryBox = {x:100, y: 200, width: 900, height: 800};
const elementOverlap = {x:101, y: 201, width: 900, height: 800};
const elementInside = {x:400, y: 400, width: 100, height: 100};
const elementOutside = {x:1400, y: 1400, width: 100, height: 100};

const trustBoundaryBox = {id: 'trustBoundaryBox', shape: 'trust-boundary-box', getBBox: () => {return boundaryBox;}};
const actorInside = {id: 'actorInside', shape: 'actor', getBBox: () => elementInside, isNode: () => true};
const trustBoundaryCurve = {id: 'trustBoundaryCurve', shape: 'trust-boundary-curve', getBBox: () => elementInside, isNode: () => false};
const processInside = {id: 'processInside', shape: 'process', getBBox: () => elementInside, isNode: () => true};
const actorOverlap = {id: 'actorOverlap', shape: 'actor', getBBox: () => elementOverlap, isNode: () => true};
const storeOutside = {id: 'storeOutside', shape: 'store', getBBox: () => elementOutside, isNode: () => true};
const flowIntoBoundary = {id: 'flowIntoBoundary', shape: 'flow', getSourceCell: () => storeOutside, getTargetCell: () => actorInside};
const flowInsideBoundary = {id: 'flowInsideBoundary', shape: 'flow', getSourceCell: () => processInside, getTargetCell: () => actorInside};
const flowOutsideBoundary = {id: 'flowOutsideBoundary', shape: 'flow', getSourceCell: () => actorOverlap, getTargetCell: () => storeOutside};

const cells = [
    trustBoundaryBox,
    flowIntoBoundary,
    flowInsideBoundary,
    flowOutsideBoundary,
    actorInside,
    trustBoundaryCurve,
    actorOverlap,
    storeOutside,
    processInside
];

describe('service/diagram/boundary-utils.js', () => {

    describe('isElementInsideBoundary', () => {
        it('detects that element is inside boundary', () => {
            expect(boundaryUtils.isElementInsideBoundary(elementInside, boundaryBox)).toBe(true);
        });

        it('detects that element is outside boundary', () => {
            expect(boundaryUtils.isElementInsideBoundary(elementOutside, boundaryBox)).toBe(false);
        });
    
        it('detects that element overlaps boundary', () => {
            expect(boundaryUtils.isElementInsideBoundary(elementOverlap, boundaryBox)).toBe(false);
        });

        it('handles missing element', () => {
            expect(boundaryUtils.isElementInsideBoundary(null, boundaryBox)).toBe(false);
        });

        it('handles missing boundary', () => {
            expect(boundaryUtils.isElementInsideBoundary(elementInside, null)).toBe(false);
        });
    });

    describe('getElementsInsideBoundary', () => {
        it('finds the elements inside boundary', () => {
            const elements = boundaryUtils.getElementsInsideBoundary(cells, trustBoundaryBox);
            expect(elements).toHaveLength(2);
            expect(elements[0].id).toBe('actorInside');
            expect(elements[1].id).toBe('processInside');
        });
    });

    describe('doesFlowCrossBoundary', () => {
        it('finds flow crossing boundary', () => {
            const crossing = boundaryUtils.doesFlowCrossBoundary(flowIntoBoundary, trustBoundaryBox, cells);
            expect(crossing).toBe(true);
        });

        it('rejects flow not crossing boundary', () => {
            const crossing = boundaryUtils.doesFlowCrossBoundary(flowOutsideBoundary, trustBoundaryBox, cells);
            expect(crossing).toBe(false);
        });

        it('rejects flow inside boundary', () => {
            const crossing = boundaryUtils.doesFlowCrossBoundary(flowInsideBoundary, trustBoundaryBox, cells);
            expect(crossing).toBe(false);
        });
    });

    describe('getBoundariesCrossedByFlow', () => {
        it('finds boundary crossed by flow', () => {
            const crossed = boundaryUtils.getBoundariesCrossedByFlow(flowIntoBoundary, cells);
            expect(crossed).toHaveLength(2);
            expect(crossed[0]).toBe('trustBoundaryBox');
            expect(crossed[1]).toBe('trustBoundaryCurve');
        });

        it('rejects boundary not crossed by flow', () => {
            const crossed = boundaryUtils.getBoundariesCrossedByFlow(flowOutsideBoundary, cells);
            expect(crossed).toHaveLength(0);
        });

        it('rejects boundary that contains flow', () => {
            const crossed = boundaryUtils.getBoundariesCrossedByFlow(flowInsideBoundary, cells);
            expect(crossed).toHaveLength(0);
        });
    });

    describe('getFlowsCrossedByBoundary', () => {
        it('finds flow crossed by boundary', () => {
            const crossed = boundaryUtils.getFlowsCrossedByBoundary(trustBoundaryBox, cells);
            expect(crossed).toHaveLength(1);
            expect(crossed[0]).toBe('flowIntoBoundary');
        });
    });
});
