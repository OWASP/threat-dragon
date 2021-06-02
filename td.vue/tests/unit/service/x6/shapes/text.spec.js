import text from '@/service/x6/shapes/text.js';

describe('service/x6/shapes/text.js', () => {
    let victim;

    beforeEach(() => {
        victim = new text.TextBlock();
    });

    it('can create the object', () => {
        expect(victim.constructor.name).toEqual('Text');
    });
});
