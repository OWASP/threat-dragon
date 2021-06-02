import { Shape } from '@antv/x6';

import actor from '@/service/x6/shapes/actor.js';
import factory from '@/service/x6/factory.js';
import processShape from '@/service/x6/shapes/process.js';
import stencil from '@/service/x6/stencil.js';
import store from '@/service/x6/shapes/store.js';
import textBlock from '@/service/x6/shapes/text.js';
import trustBoundaryBox from '@/service/x6/shapes/trust-boundary-box.js';
import trustBoundaryCurve from '@/service/x6/shapes/trust-boundary-curve';

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
        actor.Actor = jest.fn();
        processShape.ProcessShape = jest.fn();
        store.Store = jest.fn();
        trustBoundaryBox.TrustBoundaryBox = jest.fn();
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
        expect(trustBoundaryBox.TrustBoundaryBox).toHaveBeenCalledTimes(1);
    });

    it('creates an instance of ProcessShape', () => {
        expect(processShape.ProcessShape).toHaveBeenCalledTimes(1);
    });

    it('creates an instance of Actor', () => {
        expect(actor.Actor).toHaveBeenCalledTimes(1);
    });

    it('creates an instance of ProcessShape', () => {
        expect(store.Store).toHaveBeenCalledTimes(1);
    });

    it('loads the entities', () => {
        expect(load).toHaveBeenCalledWith([
            expect.any(processShape.ProcessShape),
            expect.any(store.Store),
            expect.any(actor.Actor)
        ], 'entities');
    });

    it('loads the trust boundaries', () => {
        expect(load).toHaveBeenCalledWith([
            expect.any(trustBoundaryBox.TrustBoundaryBox),
            expect.any(trustBoundaryCurve.TrustBoundaryCurve)
        ], 'trust_boundaries');
    });

    it('loads the metadata', () => {
        expect(load).toHaveBeenCalledWith([
            expect.any(textBlock.TextBlock)
        ], 'metadata');
    });

    it('calls onSearch twice', () => {
        expect(search).toHaveBeenCalledTimes(2);
    });

    it('adds the stencil to the dom', () => {
        expect(container.appendChild).toHaveBeenCalledWith(container);
    });
});
