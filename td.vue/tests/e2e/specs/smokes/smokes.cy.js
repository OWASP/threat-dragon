// quick test to see if the edit page is accessible

describe('smoke tests', () => {
    beforeEach(() => {
        cy.launchThreatDragon();
    });

    describe('login', () => {
        it('has a welcome message', () => {
            cy.contains('OWASP Threat Dragon');
        });
    
        it('always displays local login option', () => {
            cy.get('#local-login-btn').should('be.visible');
        });
    });

    describe('locale', () => {
        it('shows default locale (English)', () => {
            cy.get('.td-locale-select .td-dropdown-toggle').should('contain.text', 'English');
        });

        it('shows locale dropdown with all available languages', () => {
            const LOCALES_AVAILABLE_COUNT = 14;

            cy.get('.td-locale-select .td-dropdown-toggle').click();
            cy.get('.td-dropdown-scroll button').should('have.length', LOCALES_AVAILABLE_COUNT);
            cy.get('.td-dropdown-scroll button').should('contain.text', 'English');
        });
    });

    describe('create and edit', () => {
        beforeEach(() => {
            cy.get('#local-login-btn').click();
            cy.get('a[href="#/local/threatmodel/new"]').click();
            cy.url().should('contain', '/local/New%20Threat%20Model/edit');
        });
    
        it('can edit the title', () => {
            cy.get('#title').clear().type('new name');
            cy.contains('Editing: new name');
        });
    
        it('can add a new diagram', () => {
            cy.get('.add-diagram-link').click();
            cy.get('#diagram-group-0').should('be.visible');
            cy.get('.input-group-append').click();
            cy.get('#diagram-group-0').should('not.be', 'visible');
        });
    
        it('has the close control buttons', () => {
            cy.get('#td-close-btn').should('be.visible');
        });
    });
});

