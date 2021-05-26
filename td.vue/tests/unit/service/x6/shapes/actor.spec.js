import actor from '@/service/x6/shapes/actor.js';

describe('service/x6/shapes/actor.js', () => {
    let victim;

    beforeEach(() => {
        victim = new actor.Actor();
    });

    it('can create the object', () => {
        expect(victim.constructor.name).toEqual('Actor');
    });

    describe('updateStyle', () => {
        const color = 'foo';
        const dash = '3 3';
        let cell;

        beforeEach(() => {
            cell = {
                setAttrByPath: jest.fn()
            };
            actor.updateStyle(cell, color, dash);
        });

        it('sets the body/stroke attribute', () => {
            expect(cell.setAttrByPath).toHaveBeenCalledWith('body/stroke', color);
        });

        it('sets the body/strokeDasharray attribute', () => {
            expect(cell.setAttrByPath).toHaveBeenCalledWith(
                'body/strokeDasharray', dash);
        });
    });
});
