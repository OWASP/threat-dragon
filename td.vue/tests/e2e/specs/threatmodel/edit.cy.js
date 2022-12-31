describe('editing a threat model', () => {
    const newName = 'Something New Goes Here!';

    beforeEach(() => {
        cy.get('#local-login-btn').click();
        cy.get('a[href="#/local/threatmodel/new"]').click();
        cy.url().should('equal', Cypress.config().baseUrl + '#/local/New%20Threat%20Model/edit');
    });

    afterEach(() => {
        cy.get('#nav-sign-out').click();
    });

    describe('cancel', () => {
        it('goes back without prompting if data has not been edited', () => {
            cy.get('#td-cancel-btn').click();
            cy.url().should('equal', Cypress.config().baseUrl + '#/local/New%20Threat%20Model');
            cy.contains('New Threat Model');
        });

        describe('after editing', () => {
            beforeEach(() => {
                cy.get('#title').clear().type(newName);
                cy.contains(`Editing: ${newName}`);
                cy.get('#td-cancel-btn').click();
            });

            it('does not reset if the user selects cancel', () => {
                cy.get('.modal-footer .btn-secondary').contains('Cancel').click();
                cy.url().should('equal', Cypress.config().baseUrl + '#/local/New%20Threat%20Model/edit');
                cy.contains(`Editing: ${newName}`);
            });

            it('resets data and goes back if the user selects ok', () => {
                cy.get('.modal-footer .btn-danger').contains('OK').click();
                cy.url().should('equal', Cypress.config().baseUrl + '#/local/New%20Threat%20Model');
                cy.contains('New Threat Model');
            });
        });
    });

    describe('reload', () => {
        it('does nothing if data has not changed', () => {
            cy.get('#td-reload-btn').click();
            cy.contains(`Editing: New Threat Model`);
        });

        describe('with changed data', () => {

            beforeEach(() => {
                cy.get('#title').clear().type(newName);
                cy.contains(`Editing: ${newName}`);
                cy.get('#td-reload-btn').click();
            });

            it('does not reload if the user cancels', () => {
                cy.get('.modal-footer .btn-secondary').contains('Cancel').click();
                cy.contains(`Editing: ${newName}`);
            });

            it('reloads if the user confirms', () => {
                cy.get('.modal-footer .btn-danger').contains('OK').click();
                cy.contains('Editing: New Threat Model');
            });
        });
    });

    describe.skip('save', () => {
        // TODO: Write better tests after implementation details of saving locally are determined
        it('returns to the threat model view', () => {
            cy.get('#title').clear().type(newName);
            cy.contains(`Editing: ${newName}`);
            cy.get('#td-save-btn').click();
            cy.url().should('equal', Cypress.config().baseUrl + '#/local/New%20Threat%20Model');
            cy.contains(newName);
        });
    });
});
