import factory from '@/service/x6/factory.js';
import shapes from '@/service/x6/shapes/index.js';
import stencil from '@/service/x6/stencil.js';

describe('service/x6/stencil.js', () => {
    let container, load, search, target, cfg;

    beforeEach(() => {
        load = jest.fn();
        search = jest.fn();
        factory.stencil = jest.fn().mockImplementation((config) => {
            cfg = config;
            return {
                container,
                load,
                onSearch: search
            };
        });
        shapes.Actor = jest.fn();
        shapes.ProcessShape = jest.fn();
        shapes.Store = jest.fn();
        shapes.Flow = jest.fn();
        shapes.TrustBoundaryBox = jest.fn();
        shapes.TrustBoundaryCurve = jest.fn();
        container = { appendChild: jest.fn(), foo: 'bar' };
        target = { bar: 'baz' };
        
        stencil.get(target, container);
    });

    it('creates a new stencil', () => {
        expect(factory.stencil).toHaveBeenCalledTimes(1);
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

    describe('search', () => {
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
    });

    it('has a placeholder', () => {
        expect(cfg.placeholder).toEqual('Search');
    });

    it('has notFoundText', () => {
        expect(cfg.notFoundText).toContain('want to open an issue?');
    });

    it('creates an instance of TrustBoundaryBox', () => {
        expect(shapes.TrustBoundaryBox).toHaveBeenCalledTimes(1);
    });

    it('creates an instance of ProcessShape', () => {
        expect(shapes.ProcessShape).toHaveBeenCalledTimes(1);
    });

    it('creates an instance of Actor', () => {
        expect(shapes.Actor).toHaveBeenCalledTimes(1);
    });

    it('creates an instance of ProcessShape', () => {
        expect(shapes.Store).toHaveBeenCalledTimes(1);
    });

    it('loads the entities', () => {
        expect(load).toHaveBeenCalledWith([
            expect.any(shapes.ProcessShape),
            expect.any(shapes.Store),
            expect.any(shapes.Actor),
            expect.any(shapes.FlowStencil)
        ], 'entities');
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
