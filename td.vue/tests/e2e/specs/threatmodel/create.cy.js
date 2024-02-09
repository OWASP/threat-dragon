describe('create a new threat model', () => {
    beforeEach(() => {
        cy.get('#local-login-btn').click();
        cy.get('a[href="#/local/threatmodel/new"]').click();
        cy.url().should('contain', '/local/New%20Threat%20Model/edit');
    });

    it('can edit the title', () => {
        cy.get('#title').clear().type('new name');
        cy.contains('Editing: new name');
    });

    it('can edit the owner', () => {
        cy.get('#owner').should('be.visible')
            .should('not.be', 'disabled')
            .type('owner');
    });

    it('can edit the reviewer', () => {
        cy.get('#reviewer').should('be.visible')
            .should('not.be', 'disabled')
            .type('reviewer');
    });

    it('can edit the description', () => {
        cy.get('#description').should('be.visible')
            .should('not.be', 'disabled')
            .type('description');
    });

    it('should have the contributors field', () => {
        cy.get('#contributors').should('be.visible');
    });

    it('can add a new diagram', () => {
        cy.get('.add-diagram-link').click();
        cy.get('#diagram-group-0').should('be.visible');
        cy.get('.input-group-append').click();
        cy.get('#diagram-group-0').should('not.be', 'visible');
    });

    it('has the form control buttons', () => {
        cy.get('#td-save-btn').should('be.visible');
        cy.get('#td-reload-btn').should('be.visible');
        cy.get('#td-close-btn').should('be.visible');
    });
});
