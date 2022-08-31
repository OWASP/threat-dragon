// these unit tests are waiting to be filled in during the desktop development
import menu from '@/desktop/desktop.menu.js';

describe('desktop/desktop.menu.js', () => {

    it('returns a dropdown menu', () => {
        // the actual length of the menu system is platform dependent
        expect(menu.menuTemplate.length).toBeGreaterThanOrEqual(5);
    });

});
