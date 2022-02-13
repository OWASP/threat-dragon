import env from '@/service/env.js';
import save from '@/service/save.js';

describe('service/save.js', () => {
    const data = { foo: 'bar' };
    const name = 'test.json';

    describe('browser', () => {
        let mockAnchor;
        beforeEach(() => {
            mockAnchor = {
                click: jest.fn(),
                remove: jest.fn()
            };
            env.isElectron = jest.fn().mockReturnValue(false);
            window.URL = {
                createObjectURL: jest.fn()
            };
            document.createElement = jest.fn().mockReturnValue(mockAnchor);
            save.local(data, name);
        });

        it('creates the object url', () => {
            expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1);
        });

        it('clicks the link', () => {
            expect(mockAnchor.click).toHaveBeenCalledTimes(1);
        });

        it('removes the anchor', () => {
            expect(mockAnchor.remove).toHaveBeenCalledTimes(1);
        });
    });

    describe('electron', () => {
        beforeEach(() => {
            env.isElectron = jest.fn().mockReturnValue(true);
        });

        // TODO
    });
});
