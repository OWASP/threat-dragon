describe('editing threat models', () => {
    describe('editing a new model', () => {
        beforeEach(() => {
            cy.get('#local-login-btn').click();
            cy.get('a[href="#/local/threatmodel/new"]').click();
            // Fill out the form
            cy.get('#threat-model-title').type('Test Threat Model');
            cy.get('#threat-model-owner').type('Test Owner');
            cy.get('#threat-model-description').type('Test Description');
            cy.get('#threat-model-reviewer').type('Test Reviewer');
            // Submit the form
            cy.get('button[type="submit"]').click();
            // After submitting the form, we should be redirected to the edit page with the model name
            cy.url().should('include', '/models/').and('include', '/edit');
        });

        it('can edit the title', () => {
            cy.get('#title').clear();
            cy.get('#title').type('new name');
            cy.get('#title').should('have.value', 'new name');
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
            // Initially there might be no diagrams
            // Click the add diagram link to add a new diagram
            cy.get('.add-diagram-link').click();
            
            // Verify a diagram was added
            cy.get('.diagram-inputs').should('exist');
            
            // Remove the diagram
            cy.get('.remove-diagram-btn').click();
            
            // Verify the diagram was removed
            cy.get('.diagram-inputs').should('not.exist');
        });

        it('has the form control buttons', () => {
            cy.get('#td-save-btn').should('be.visible');
            cy.get('#td-reload-btn').should('be.visible');
            cy.get('#td-close-btn').should('be.visible');
        });
    });

    describe('editing a new model with confirmation dialogs', () => {
        const newName = 'Something New Goes Here!';

        beforeEach(() => {
            cy.get('#local-login-btn').click();
            cy.get('a[href="#/local/threatmodel/new"]').click();
            // Fill out the form
            cy.get('#threat-model-title').type('Test Threat Model');
            cy.get('#threat-model-owner').type('Test Owner');
            cy.get('#threat-model-description').type('Test Description');
            cy.get('#threat-model-reviewer').type('Test Reviewer');
            // Submit the form
            cy.get('button[type="submit"]').click();
            // After submitting the form, we should be redirected to the edit page with the model name
            cy.url().should('include', '/models/').and('include', '/edit');
        });

        afterEach(() => {
            cy.get('#nav-sign-out').click();
        });

        describe('cancel', () => {
            it('goes back without prompting if data has not been edited', () => {
                cy.get('#td-close-btn').click();
                // After closing, we should be back at the model view page
                cy.url().should('include', '/models/').and('not.include', '/edit');
                // Check for the model name in the URL
                cy.url().should('include', 'Threat%20Model');
            });

            describe('after editing', () => {
                beforeEach(() => {
                    cy.get('#title').clear();
                    cy.get('#title').type(newName);
                    cy.get('#title').should('have.value', newName);
                    cy.get('#td-close-btn').click();
                });

                it('does not reset if the user selects cancel', () => {
                    cy.get('.modal-footer .btn-secondary').contains('Cancel').click();
                    // After canceling, we should still be on the edit page
                    cy.url().should('include', '/models/').and('include', '/edit');
                    cy.get('#title').should('have.value', newName);
                });

                it('resets data and goes back if the user selects ok', () => {
                    cy.get('.modal-footer .btn-danger').contains('OK').click();
                    // After confirming, we should be back at the model view page
                    cy.url().should('include', '/models/').and('not.include', '/edit');
                    // Check for the model name in the URL
                    cy.url().should('include', 'Threat%20Model');
                });
            });
        });

        describe('reload', () => {
            it('does nothing if data has not changed', () => {
                cy.get('#td-reload-btn').click();
                // Check that we're still on the edit page
                cy.url().should('include', 'edit');
            });

            describe('with changed data', () => {
                beforeEach(() => {
                    cy.get('#title').clear();
                    cy.get('#title').type(newName);
                    cy.get('#title').should('have.value', newName);
                    cy.get('#td-reload-btn').click();
                });

                it('does not reload if the user cancels', () => {
                    cy.get('.modal-footer .btn-secondary').contains('Cancel').click();
                    cy.get('#title').should('have.value', newName);
                });

                it('reloads if the user confirms', () => {
                    cy.get('.modal-footer .btn-danger').contains('OK').click();
                    // Check that the title has been reset
                    cy.get('#title').should('not.have.value', newName);
                });
            });
        });

        describe.skip('save', () => {
            // TODO: Write better tests after implementation details of saving locally are determined
            it('returns to the threat model view', () => {
                cy.get('#title').clear();
                cy.get('#title').type(newName);
                cy.get('#title').should('have.value', newName);
                cy.get('#td-save-btn').click();
                // After saving, we should be back at the model view page
                cy.url().should('include', '/models/').and('not.include', '/edit');
                // Check for the model name in the URL
                cy.url().should('include', 'Threat%20Model');
            });
        });
    });
});
