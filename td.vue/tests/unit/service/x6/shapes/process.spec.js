import { ProcessShape } from '@/service/x6/shapes/process.js';

describe('service/x6/shapes/process.js', () => {
    let victim;

    beforeEach(() => {
        victim = new ProcessShape();
    });

    it('can create the object', () => {
        expect(victim.constructor.name).toEqual('Process');
    });

    describe('updateStyle', () => {
        const color = 'foo';
        const dash = '5 2';
        const stroke = 1;

        beforeEach(() => {
            victim.setAttrByPath = jest.fn();
            victim.updateStyle(color, dash, stroke);
        });

        it('sets the body/stroke attribute', () => {
            expect(victim.setAttrByPath).toHaveBeenCalledWith('body/stroke', color);
        });

        it('sets the body/strokeDasharray attribute', () => {
            expect(victim.setAttrByPath).toHaveBeenCalledWith(
                'body/strokeDasharray', dash);
        });

        it('sets the body/strokeWidth attribute', () => {
            expect(victim.setAttrByPath).toHaveBeenCalledWith('body/strokeWidth', stroke);
        });
    });

    describe('setName', () => {
        it('sets the name', () => {
            const name = 'pName';
            victim.setName(name);
            expect(victim.label).toEqual(name);
        });
    });
});
