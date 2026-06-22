import demo from '@/service/demo/index.js';

describe('service/demo/index.js', () => {

    describe('models', () => {
        const models = demo.models;

        it('gets all models', () => {
            expect(models.length).toBeGreaterThanOrEqual(5);
        });

        it('supplies a name', () => {
            expect(models[0].name.length).toBeGreaterThanOrEqual(5);
            expect(models[2].name.length).toBeGreaterThanOrEqual(5);
            expect(models[4].name.length).toBeGreaterThanOrEqual(5);
        });

        it('supplies the model', () => {
            expect(models[0].model).toBeDefined();
            expect(models[1].model).toBeDefined();
            expect(models[3].model).toBeDefined();
        });
    });
});
