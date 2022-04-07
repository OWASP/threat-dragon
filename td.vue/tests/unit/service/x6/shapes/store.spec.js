import { StoreShape }  from '@/service/x6/shapes/store.js';

describe('service/x6/shapes/store.js', () => {
    let victim;

    beforeEach(() => {
        victim = new StoreShape();
    });

    it('can create the object', () => {
        expect(victim.constructor.name).toEqual('Store');
    });

    describe('updateStyle', () => {
        const color = 'foo';
        const dash = '5 2';
        const stroke = 1;

        beforeEach(() => {
            victim.setAttrByPath = jest.fn();
            victim.updateStyle(color, dash, stroke);
        });

        it('sets the topLine/stroke attribute', () => {
            expect(victim.setAttrByPath).toHaveBeenCalledWith('topLine/stroke', color);
        });

        it('sets the topLine/strokeDasharray attribute', () => {
            expect(victim.setAttrByPath).toHaveBeenCalledWith(
                'topLine/strokeDasharray', dash);
        });

        it('sets the topLine/strokeWidth attribute', () => {
            expect(victim.setAttrByPath).toHaveBeenCalledWith('topLine/strokeWidth', stroke);
        });

        it('sets the bottomLine/stroke attribute', () => {
            expect(victim.setAttrByPath).toHaveBeenCalledWith('bottomLine/stroke', color);
        });

        it('sets the bottomLine/strokeDasharray attribute', () => {
            expect(victim.setAttrByPath).toHaveBeenCalledWith(
                'bottomLine/strokeDasharray', dash);
        });

        it('sets the bottomLine/strokeWidth attribute', () => {
            expect(victim.setAttrByPath).toHaveBeenCalledWith('bottomLine/strokeWidth', stroke);
        });
    });

    describe('setName', () => {
        it('sets the name', () => {
            const name = 'sName';
            victim.setName(name);
            expect(victim.label).toEqual(name);
        });
    });
});
