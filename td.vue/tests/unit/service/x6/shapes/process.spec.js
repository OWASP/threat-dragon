import process from '@/service/x6/shapes/process.js';

describe('service/x6/shapes/process.js', () => {
    let victim;

    beforeEach(() => {
        victim = new process.ProcessShape();
    });

    it('can create the object', () => {
        expect(victim.constructor.name).toEqual('Process');
    });
});
