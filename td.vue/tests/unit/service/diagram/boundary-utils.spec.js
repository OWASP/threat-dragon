import boundaryUtils from '@/service/diagram/boundary-utils';

const boundaryBox = {x:100, y: 200, width: 900, height: 800};
const elementOverlap = {x:101, y: 201, width: 900, height: 800};
const elementInside = {x:400, y: 400, width: 100, height: 100};
const elementOutside = {x:1400, y: 1400, width: 100, height: 100};

const boundaryCell = {id: 'boundaryCell', getBBox: () => {return boundaryBox;}};
const flowIntoBoundary = {id: 'flowIntoBoundary', shape: 'flow'};
const flowOutsideBoundary = {id: 'flowOutsideBoundary', shape: 'flow'};
const cells = [ boundaryCell, flowIntoBoundary, flowOutsideBoundary ];

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
	        expect(boundaryUtils.getElementsInsideBoundary(cells, boundaryCell)).toEqual([]);
	    });
    });
});
