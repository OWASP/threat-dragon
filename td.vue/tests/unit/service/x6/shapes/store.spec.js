import { ObjectExt } from '@antv/x6';

import store from '@/service/x6/shapes/store.js';

describe('service/x6/shapes/store.js', () => {
    let victim;

    beforeEach(() => {
        victim = new store.Store();
        ObjectExt.setByPath = jest.fn();
    });

    it('can create the object', () => {
        expect(victim.constructor.name).toEqual('Store');
    });

    describe('propHooks', () => {
        const label = 'test';
        let res;

        beforeEach(() => {
            res = store.propHooks({ label, foo: 'bar' });
        });

        it('sets the label from the metadata', () => {
            expect(ObjectExt.setByPath).toHaveBeenCalledWith(
                { foo: 'bar' },
                'attrs/label/text',
                label
            );
        });

        it('returns the other data', () => {
            expect(res).toEqual({ foo: 'bar' });
        });
    });


    describe('updateStyle', () => {
        const color = 'foo';
        const dash = '3 3';
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
});
