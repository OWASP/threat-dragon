import nodes from '@/service/diagram/v1/nodes.js';

describe('service/diagram/v1/nodes.js', () => {
    let cell, constructor, mapFn;

    const getCell = () => ({
        angle: 0,
        size: {
            width: 5,
            height: 10
        },
        position: {
            x: 2,
            y: 12
        },
        id: 'asdf',
        z: -2,
        attrs: {
            text: {
                text: 'asdf'
            }
        }
    });

    describe('map', () => {
        beforeEach(() => {
            constructor = jest.fn();
            cell = getCell();
            mapFn = nodes.map(constructor);
            mapFn(cell);
        });

        it('sets the angle', () => {
            expect(constructor).toHaveBeenCalledWith(expect.objectContaining({
                angle: cell.angle
            }));
        });

        it('sets the width', () => {
            expect(constructor).toHaveBeenCalledWith(expect.objectContaining({
                width: cell.size.width
            }));
        });

        it('sets the height', () => {
            expect(constructor).toHaveBeenCalledWith(expect.objectContaining({
                height: cell.size.height
            }));
        });

        it('sets the x', () => {
            expect(constructor).toHaveBeenCalledWith(expect.objectContaining({
                x: cell.position.x
            }));
        });

        it('sets the y', () => {
            expect(constructor).toHaveBeenCalledWith(expect.objectContaining({
                y: cell.position.y
            }));
        });

        it('sets the id', () => {
            expect(constructor).toHaveBeenCalledWith(expect.objectContaining({
                id: cell.id
            }));
        });

        it('sets the zIndex', () => {
            expect(constructor).toHaveBeenCalledWith(expect.objectContaining({
                zIndex: cell.z
            }));
        });

        it('sets the label', () => {
            expect(constructor).toHaveBeenCalledWith(expect.objectContaining({
                label: cell.attrs.text.text
            }));
        });
    });

    it('sets an empty label', () => {
        constructor = jest.fn();
        cell = getCell();
        delete cell.attrs;
        mapFn = nodes.map(constructor);
        mapFn(cell);

        expect(constructor).toHaveBeenCalledWith(expect.objectContaining({
            label: ''
        }));
    });
});
