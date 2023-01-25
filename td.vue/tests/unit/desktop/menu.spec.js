import menu from '@/desktop/menu.js';

describe('desktop/menu.js', () => {

   const menuItems = menu.getMenuTemplate();

   describe('Desktop menu', () => {

        it('returns a dropdown menu', () => {
            // the actual length of the menu system is platform dependent
            expect(menuItems.length).toBeGreaterThanOrEqual(5);
        });

        it('contains the edit role', () => {
            const editMenu = {"role": "editMenu"};
            expect(menuItems).toContainEqual(editMenu);
        });

        it('contains the view role', () => {
            const viewMenu = {"role": "viewMenu"};
            expect(menuItems).toContainEqual(viewMenu);
        });

        it('contains the Window role', () => {
            const windowMenu = {"role": "windowMenu"};
            expect(menuItems).toContainEqual(windowMenu);
        });

    });

   describe('Desktop File menu', () => {

        const fileItems = menuItems.find((item) => item.label === 'File');

        it('contains the Close role', () => {
            const closeRole = {"role": "close"};
            expect(fileItems.submenu).toContainEqual(closeRole);
        });

        it('contains open model', () => {
            const openModelItem = fileItems.submenu.find((item) => item.label === 'Open Model');
            expect(openModelItem).toBeDefined();
        });

        it('contains recent items', () => {
            const recentItems = {"role": "recentdocuments", "submenu": [{"role": "clearrecentdocuments"}]}
            expect(fileItems.submenu).toContainEqual(recentItems);
        });

        it('contains save model', () => {
            const saveModelItem = fileItems.submenu.find((item) => item.label === 'Save Model');
            expect(saveModelItem).toBeDefined();
        });

        it('contains save model as', () => {
            const saveModelAsItem = fileItems.submenu.find((item) => item.label === 'Save Model As');
            expect(saveModelAsItem).toBeDefined();
        });

        it('contains new model', () => {
            const newModelItem = fileItems.submenu.find((item) => item.label === 'New Model');
            expect(newModelItem).toBeDefined();
        });

        it('contains close model', () => {
            const closeModelItem = fileItems.submenu.find((item) => item.label === 'Close Model');
            expect(closeModelItem).toBeDefined();
        });

    });

   describe('Desktop Help menu', () => {

        const helpItems = menuItems.find((item) => item.label === 'Help');

        it('contains recent items', () => {
            const helpItem = helpItems.submenu.find((item) => item.label === 'Documentation');
            expect(helpItem).toBeDefined();
        });

        it('contains recent items', () => {
            const helpItem = helpItems.submenu.find((item) => item.label === 'Visit us at OWASP');
            expect(helpItem).toBeDefined();
        });

        it('contains recent items', () => {
            const helpItem = helpItems.submenu.find((item) => item.label === 'OWASP Cheat Sheets');
            expect(helpItem).toBeDefined();
        });

        it('contains recent items', () => {
            const helpItem = helpItems.submenu.find((item) => item.label === 'Visit us on GitHub');
            expect(helpItem).toBeDefined();
        });

        it('contains recent items', () => {
            const helpItem = helpItems.submenu.find((item) => item.label === 'Submit an Issue');
            expect(helpItem).toBeDefined();
        });

        it('contains recent items', () => {
            const helpItem = helpItems.submenu.find((item) => item.label === 'Check for updates ...');
            expect(helpItem).toBeDefined();
        });

    });
});
