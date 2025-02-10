import trustBoundaryBox from '@/service/x6/shapes/trust-boundary-box.js';

describe('service/x6/shapes/trust-boundary-box.js', () => {
    let victim;

    beforeEach(() => {
        victim = new trustBoundaryBox.TrustBoundaryBox();
        victim.setAttrByPath = jest.fn();
        victim.getAttrByPath = jest.fn();
    });

    it('can create the object', () => {
        expect(victim.constructor.name).toEqual('TrustBoundaryBox');
    });

    describe('get victim attributes', () => {
        it('sets the stroke dash array', () => {
            expect(victim.attrs.body.strokeDasharray).toEqual('10 5');
        });

        it('sets the stroke width', () => {
            expect(victim.attrs.body.strokeWidth).toEqual(3);
        });
    });

    describe('setName', () => {
        it('sets the name', () => {
            const name = 'tbbName';
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
