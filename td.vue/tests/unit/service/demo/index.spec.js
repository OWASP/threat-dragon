import demo from '@/service/demo/index.js';

describe('service/demo/index.js', () => {
    describe('models', () => {
        it('gets all models', () => {
            let models = demo.models;
            expect(models).toHaveLength(10);
        });
    });
});
