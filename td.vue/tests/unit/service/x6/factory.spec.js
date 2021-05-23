import { Addon } from '@antv/x6';

import factory from '@/service/x6/factory.js';

describe('service/x6/factory.js', () => {
    describe('stencil', () => {
        it('creates a new stencil', () => {
            expect(factory.stencil({})).toBeInstanceOf(Addon.Stencil);
        });
    });
});
