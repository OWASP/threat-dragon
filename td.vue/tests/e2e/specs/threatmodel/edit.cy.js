describe('editing threat models', () => {
    describe('editing a new model', () => {
        beforeEach(() => {
            cy.get('#local-login-btn').click();
            cy.get('a[href="#/local/threatmodel/new"]').click();
            cy.url().should('equal', Cypress.config().baseUrl + '#/local/New%20Threat%20Model/edit');
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

    describe('editing a new model', () => {
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
                cy.get('#td-close-btn').click();
                cy.url().should('equal', Cypress.config().baseUrl + '#/local/New%20Threat%20Model');
                cy.contains('New Threat Model');
            });

            describe('after editing', () => {
                beforeEach(() => {
                    cy.get('#title').clear().type(newName);
                    cy.contains(`Editing: ${newName}`);
                    cy.get('#td-close-btn').click();
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
});
