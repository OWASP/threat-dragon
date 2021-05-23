import { Addon, Graph } from '@antv/x6';

import factory from '@/service/x6/factory.js';

describe('service/x6/factory.js', () => {
    describe('stencil', () => {
        it('creates a new stencil', () => {
            expect(factory.stencil({})).toBeInstanceOf(Addon.Stencil);
        });
    });

    describe('registerNode', () => {
        it('registers a new node', () => {
            Graph.registerNode = jest.fn();
            const cfg = { foo: 'bar' };
            const name = 'foobar';
            factory.registerNode(name, cfg);
            expect(Graph.registerNode).toHaveBeenLastCalledWith(name, cfg);
        });
    });
});
