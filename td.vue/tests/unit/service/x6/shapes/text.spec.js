import text from '@/service/x6/shapes/text.js';

describe('service/x6/shapes/text.js', () => {
    let victim;

    beforeEach(() => {
        victim = new text.TextBlock();
    });

    it('can create the object', () => {
        expect(victim.constructor.name).toEqual('Text');
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
        it('sets the name', () => {
            const name = 'tName';
            victim.setName(name);
            expect(victim.label).toEqual(name);
        });
    });
});
