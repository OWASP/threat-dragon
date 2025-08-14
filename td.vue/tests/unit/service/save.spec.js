import Vue from 'vue';

import save from '@/service/save.js';

describe('service/save.js', () => {
    const state = { data: { foo: 'bar', summary: { title: 'test title '}}};
    
    describe('local', () => {
        let mockAnchor;
        beforeEach(() => {
            Vue.$toast = {
			    success: jest.fn(),
			    error: jest.fn(),
                warning: jest.fn()
            };
            mockAnchor = {
                click: jest.fn(),
                remove: jest.fn()
            };
            window.URL = {
                createObjectURL: jest.fn()
            };
            document.createElement = jest.fn().mockReturnValue(mockAnchor);
            save.local(state);
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
