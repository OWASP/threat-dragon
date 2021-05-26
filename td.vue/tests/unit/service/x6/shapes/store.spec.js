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
        let cell;

        beforeEach(() => {
            cell = {
                setAttrByPath: jest.fn()
            };
            store.updateStyle(cell, color, dash);
        });

        it('sets the topLine/stroke attribute', () => {
            expect(cell.setAttrByPath).toHaveBeenCalledWith('topLine/stroke', color);
        });

        it('sets the topLine/strokeDasharray attribute', () => {
            expect(cell.setAttrByPath).toHaveBeenCalledWith(
                'topLine/strokeDasharray', dash);
        });

        it('sets the bottomLine/stroke attribute', () => {
            expect(cell.setAttrByPath).toHaveBeenCalledWith('bottomLine/stroke', color);
        });

        it('sets the bottomLine/strokeDasharray attribute', () => {
            expect(cell.setAttrByPath).toHaveBeenCalledWith(
                'bottomLine/strokeDasharray', dash);
        });
    });
});
