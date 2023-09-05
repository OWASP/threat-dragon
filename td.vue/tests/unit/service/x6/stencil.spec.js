import shapes from '@/service/x6/shapes/index.js';
import stencil from '@/service/x6/stencil.js';

describe('service/x6/stencil.js', () => {
    let container, load, search, target, cfg;

    beforeEach(() => {
        load = jest.fn();
        search = jest.fn();
        shapes.ActorShape = jest.fn();
        shapes.ProcessShape = jest.fn();
        shapes.StoreShape = jest.fn();
        shapes.Flow = jest.fn();
        shapes.TrustBoundaryBox = jest.fn();
        shapes.TrustBoundaryCurve = jest.fn();
        container = { appendChild: jest.fn(), foo: 'bar' };
        target = { bar: 'baz' };
        
        stencil.get(target, container);
    });

    it('has a title', () => {
        expect(cfg.title).toEqual('Entities');
    });

    it('passes the target', () => {
        expect(cfg.target).toEqual(target);
    });

    it('has a width', () => {
        expect(cfg.stencilGraphWidth).toEqual(500);
    });

    it('provides layout options', () => {
        expect(cfg.layoutOptions).toEqual({
            columns: 1,
            center: true,
            resizeToFit: true
        });
    });

    // TODO skip this test until the search function is back in, issues #194 and #454
    describe.skip('search', () => {
        it('returns true for a matching shape regardless of case', () => {
            expect(cfg.search({ shape: 'MYSHAPE' }, 'mys')).toEqual(true);
        });

        it('returns false for unmatched shapes', () => {
            expect(cfg.search({ shape: 'MYSHAPE' }, 'myyyyshape')).toEqual(false);
        });

        it('returns true for matched labels regardless of case', () => {
            expect(cfg.search({ shape: 'MYSHAPE', label: 'MYLABEL' }, 'myl')).toEqual(true);
        });

        it('returns false for unmatched labels and shapes', () => {
            expect(cfg.search({ shape: 'MYSHAPE', label: 'MYLABEL' }, 'foobar')).toEqual(false);
        });

        it('has a placeholder', () => {
            expect(cfg.placeholder).toEqual('Search');
        });
    
        it('has notFoundText', () => {
            expect(cfg.notFoundText).toContain('want to open an issue?');
        });

    });

    it('creates an instance of TrustBoundaryBox', () => {
        expect(shapes.TrustBoundaryBox).toHaveBeenCalledTimes(1);
    });

    it('creates an instance of ProcessShape', () => {
        expect(shapes.ProcessShape).toHaveBeenCalledTimes(1);
    });

    it('creates an instance of ActorShape', () => {
        expect(shapes.ActorShape).toHaveBeenCalledTimes(1);
    });

    it('creates an instance of StoreShape', () => {
        expect(shapes.StoreShape).toHaveBeenCalledTimes(1);
    });

    it('loads the entities', () => {
        expect(load).toHaveBeenCalledWith([
            expect.any(shapes.ProcessShape),
            expect.any(shapes.StoreShape),
            expect.any(shapes.ActorShape),
            expect.any(shapes.FlowStencil)
        ], 'components');
    });

    it('loads the trust boundaries', () => {
        expect(load).toHaveBeenCalledWith([
            expect.any(shapes.TrustBoundaryBox),
            expect.any(shapes.TrustBoundaryCurveStencil)
        ], 'boundaries');
    });

    it('loads the metadata', () => {
        expect(load).toHaveBeenCalledWith([
            expect.any(shapes.TextBlock)
        ], 'metadata');
    });

    it('calls onSearch twice', () => {
        expect(search).toHaveBeenCalledTimes(2);
    });

    it('adds the stencil to the dom', () => {
        expect(container.appendChild).toHaveBeenCalledWith(container);
    });
});
