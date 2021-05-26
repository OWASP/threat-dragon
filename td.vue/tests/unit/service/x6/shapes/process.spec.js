import process from '@/service/x6/shapes/process.js';

describe('service/x6/shapes/process.js', () => {
    let victim;

    beforeEach(() => {
        victim = new process.ProcessShape();
    });

    it('can create the object', () => {
        expect(victim.constructor.name).toEqual('Process');
    });

    describe('updateStyle', () => {
        const color = 'foo';
        const dash = '3 3';
        let cell;

        beforeEach(() => {
            cell = {
                setAttrByPath: jest.fn()
            };
            process.updateStyle(cell, color, dash);
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
