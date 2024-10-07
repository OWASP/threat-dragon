import { TrustBoundaryCurveStencil } from '@/service/x6/shapes/trust-boundary-curve-stencil.js';

describe('service/x6/shapes/trust-boundary-curve-stencil.js', () => {
    let victim;

    beforeEach(() => {
        victim = new TrustBoundaryCurveStencil();
        victim.setAttrByPath = jest.fn();
    });

    it('can create the object', () => {
        expect(victim.constructor.name).toEqual('TrustBoundaryCurveStencil');
    });

    describe('setName', () => {
        it('sets the name', () => {
            const name = 'tbcName';
            victim.setName(name);
            expect(victim.setAttrByPath).toHaveBeenCalledWith('label/text', name);
        });
    });

    describe('updateStyle', () => {
        it('is a function', () => {
            expect(typeof victim.updateStyle).toEqual('function');
        });

        it('does not throw an error', () => {
            expect(() => victim.updateStyle()).not.toThrow();
        });
    });
});

