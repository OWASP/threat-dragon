import { FlowStencil } from '@/service/x6/shapes/flow-stencil.js';

describe('service/x6/shapes/flow-stencil.js', () => {
    let victim;

    beforeEach(() => {
        victim = new FlowStencil();
    });

    it('can create the object', () => {
        expect(victim.constructor.name).toEqual('FlowStencil');
    });

    describe('updateStyle', () => {
        it('is a function', () => {
            expect(typeof victim.updateStyle).toEqual('function');
        });

        it('does not throw an error', () => {
            expect(() => victim.updateStyle()).not.toThrow();
        });
    });

    describe('setName', () => {
        const name = 'foo';

        beforeEach(() => {
            victim.setAttrByPath = jest.fn();
            victim.setName(name);
        });

        it('sets the name', () => {
            expect(victim.setAttrByPath).toHaveBeenCalledWith('label/text', name);
        });
    });
});

