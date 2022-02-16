import save from '@/service/save.js';

describe('service/save.js', () => {
    const data = { foo: 'bar' };
    const name = 'test.json';
    
    describe('local', () => {

        let mockAnchor;
        beforeEach(() => {
            mockAnchor = {
                click: jest.fn(),
                remove: jest.fn()
            };
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
});
