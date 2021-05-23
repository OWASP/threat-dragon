import actor from '@/service/x6/shapes/actor.js';

describe('service/x6/shapes/actor.js', () => {
    let victim;

    beforeEach(() => {
        victim = new actor.Actor();
    });

    it('can create the object', () => {
        expect(victim.constructor.name).toEqual('Actor');
    });
});
