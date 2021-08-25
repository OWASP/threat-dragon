import { Actor } from '@/service/x6/shapes/actor.js';

describe('service/x6/shapes/actor.js', () => {
    let victim;

    beforeEach(() => {
        victim = new Actor();
    });

    it('can create the object', () => {
        expect(victim.constructor.name).toEqual('Actor');
    });

    describe('updateStyle', () => {
        const color = 'foo';
        const dash = '3 3';
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
});
