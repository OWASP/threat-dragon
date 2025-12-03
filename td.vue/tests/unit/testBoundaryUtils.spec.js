import {
  normalizeRect,
  rectContainsPoint,
  rectContainsRect,
  getElementsInBoundary,
  annotateDiagramWithBoundaryMembership
} from '@/service/diagram/trustBoundaryUtils';

describe('trustBoundaryUtils', () => {
  describe('normalizeRect', () => {
    it('normalizes { position, size } into a rect', () => {
      const shape = {
        position: { x: 10, y: 20 },
        size: { width: 100, height: 50 }
      };

      const rect = normalizeRect(shape);

      expect(rect).toEqual({ x: 10, y: 20, width: 100, height: 50 });
    });

    it('normalizes { x, y, width, height } into a rect', () => {
      const shape = {
        x: 5,
        y: 15,
        width: 200,
        height: 75
      };

      const rect = normalizeRect(shape);

      expect(rect).toEqual({ x: 5, y: 15, width: 200, height: 75 });
    });

    it('throws if required geometry fields are missing', () => {
      const badShape = { foo: 'bar' };

      expect(() => normalizeRect(badShape)).toThrow(
        'normalizeRect: invalid shape geometry'
      );
    });
  });

  describe('rectContainsPoint', () => {
    const rect = { x: 0, y: 0, width: 100, height: 100 };

    it('returns true for a point strictly inside the rect', () => {
      const point = { x: 50, y: 50 };

      expect(rectContainsPoint(rect, point)).toBe(true);
    });

    it('returns false for a point outside the rect', () => {
      const point = { x: 150, y: 150 };

      expect(rectContainsPoint(rect, point)).toBe(false);
    });

    it('returns false for a point on the edge of the rect', () => {
      const pointOnEdge = { x: 0, y: 50 };

      expect(rectContainsPoint(rect, pointOnEdge)).toBe(false);
    });
  });

  describe('rectContainsRect', () => {
    const outer = { x: 0, y: 0, width: 100, height: 100 };

    it('returns true when inner is fully inside outer (center point)', () => {
      const inner = { x: 10, y: 10, width: 20, height: 20 };

      expect(rectContainsRect(outer, inner)).toBe(true);
    });

    it('returns false when inner center lies outside outer', () => {
      const inner = { x: 90, y: 90, width: 30, height: 30 }; // center at (105, 105)

      expect(rectContainsRect(outer, inner)).toBe(false);
    });
  });

  describe('getElementsInBoundary', () => {
    const boundary = {
      id: 'b1',
      shape: 'tm.Boundary',
      position: { x: 0, y: 0 },
      size: { width: 200, height: 200 }
    };

    const insideNode = {
      id: 'n1',
      shape: 'tm.Process',
      position: { x: 50, y: 50 },
      size: { width: 40, height: 40 }
    };

    const outsideNode = {
      id: 'n2',
      shape: 'tm.Process',
      position: { x: 300, y: 300 },
      size: { width: 40, height: 40 }
    };

    const crossingFlow = {
      id: 'f1',
      shape: 'tm.Flow',
      points: [
        { x: -50, y: 100 },   // outside
        { x: 100, y: 100 },   // inside
        { x: 250, y: 100 }    // outside
      ]
    };

    const outsideFlow = {
      id: 'f2',
      shape: 'tm.Flow',
      points: [
        { x: 250, y: 250 },
        { x: 300, y: 300 }
      ]
    };

    it('returns IDs of nodes whose centers are inside the boundary', () => {
      const result = getElementsInBoundary(boundary, [
        boundary,
        insideNode,
        outsideNode
      ]);

      expect(result).toContain('n1');
      expect(result).not.toContain('n2');
      // boundary cannot include itself
      expect(result).not.toContain('b1');
    });

    it('returns IDs of flows that intersect the boundary', () => {
      const result = getElementsInBoundary(boundary, [
        boundary,
        crossingFlow,
        outsideFlow
      ]);

      expect(result).toContain('f1');
      expect(result).not.toContain('f2');
    });

    it('handles a mixed list of nodes and flows correctly', () => {
      const result = getElementsInBoundary(boundary, [
        boundary,
        insideNode,
        outsideNode,
        crossingFlow,
        outsideFlow
      ]);

      expect(result.sort()).toEqual(['f1', 'n1'].sort());
    });

    it('throws when elements is not an array', () => {
      expect(() =>
        getElementsInBoundary(boundary, null)
      ).toThrow('getElementsInBoundary: elements must be an array');
    });
  });

  describe('annotateDiagramWithBoundaryMembership', () => {
    const boundary = {
      id: 'b1',
      shape: 'tm.Boundary',
      position: { x: 0, y: 0 },
      size: { width: 200, height: 200 }
    };

    const insideNode = {
      id: 'n1',
      shape: 'tm.Process',
      position: { x: 50, y: 50 },
      size: { width: 40, height: 40 }
    };

    const outsideNode = {
      id: 'n2',
      shape: 'tm.Process',
      position: { x: 300, y: 300 },
      size: { width: 40, height: 40 }
    };

    const crossingFlow = {
      id: 'f1',
      shape: 'tm.Flow',
      points: [
        { x: -50, y: 100 },
        { x: 100, y: 100 },
        { x: 250, y: 100 }
      ]
    };

    it('adds a contains array to boundary cells with correct IDs', () => {
      const diagram = {
        id: 'diagram-1',
        cells: [boundary, insideNode, outsideNode, crossingFlow]
      };

      const annotated = annotateDiagramWithBoundaryMembership(diagram);

      // Original diagram should not be mutated
      expect(diagram.cells[0].contains).toBeUndefined();

      // Boundaries in the returned diagram should have contains populated
      const annotatedBoundary = annotated.cells.find((c) => c.id === 'b1');

      expect(annotatedBoundary).toBeDefined();
      expect(Array.isArray(annotatedBoundary.contains)).toBe(true);

      // Contains IDs of inside node and crossing flow
      expect(annotatedBoundary.contains.sort()).toEqual(['f1', 'n1'].sort());
    });

    it('leaves non-boundary cells untouched', () => {
      const diagram = {
        id: 'diagram-2',
        cells: [insideNode]
      };

      const annotated = annotateDiagramWithBoundaryMembership(diagram);

      expect(annotated.cells[0]).toEqual(insideNode);
    });

    it('throws if diagram.cells is not an array', () => {
      expect(() =>
        annotateDiagramWithBoundaryMembership({})
      ).toThrow('annotateDiagramWithBoundaryMembership: diagram.cells must be an array');
    });
  });
});
