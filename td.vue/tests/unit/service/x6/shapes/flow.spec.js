import { Flow } from '@/service/x6/shapes/flow.js';

describe('service/x6/shapes/flow.js', () => {
    let victim;

    beforeEach(() => {
        victim = new Flow();
    });

    it('can create the object', () => {
        expect(victim.constructor.name).toEqual('Flow');
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
            victim.setLabels = jest.fn();
            victim.setName(name);
        });

        it('sets the name', () => {
            expect(victim.setLabels).toHaveBeenCalledWith([ name ]);
        });
    });
});
