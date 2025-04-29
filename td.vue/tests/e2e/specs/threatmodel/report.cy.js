describe('report', () => {
    beforeEach(() => {
        cy.get('#local-login-btn').click();
        cy.get('a[href="#/demo/select"]').click();
        // Use the list-group-item that contains the text instead of data-model-name attribute
        cy.get('.list-group-item').contains('Demo Threat Model').click();
        cy.url().should('contain', '/models/Demo%20Threat%20Model');
        cy.get('#td-report-btn').click();
    });

    describe('report options', () => {
        it('shows/hides out of scope elements', () => {
            cy.get('.entity-title')
                .contains('Web Application Config (Store)')
                .should('be.visible');
    
            cy.get('#show_outofscope').click({ force: true });
    
            cy.get('.entity-title')
                .contains('Web Application Config (Store)')
                .should('not.be','visible');
    
            cy.get('#show_outofscope').click({ force: true });
        });
    
        it('shows/hides mitigated threats', () => {
            // First find any entity that contains "Unauthorised access"
            cy.contains('Unauthorised access').should('be.visible');
    
            cy.get('#show_mitigated').click({ force: true });
    
            // After clicking the checkbox, the text should not be visible
            cy.contains('Unauthorised access').should('not.be','visible');
    
            cy.get('#show_mitigated').click({ force: true });
            
            // After clicking the checkbox again, the text should be visible again
            cy.contains('Unauthorised access').should('be.visible');
        });
    
        it('shows/hides model diagrams', () => {
            cy.get('.td-readonly-diagram')
                .should('be.visible');
    
            cy.get('#show_models').click({ force: true });
    
            cy.get('.td-readonly-diagram')
                .should('not.be','visible');
    
            cy.get('#show_models').click({ force: true });
        });
    
        it('shows/hides TD branding', () => {
            cy.get('.td-brand-text')
                .should('not.be','visible');
    
            cy.get('#show_branding').click({ force: true });

            cy.get('.td-brand-text')
                .contains('OWASP Threat Dragon')
                .should('be.visible');
    
            cy.get('#show_branding').click({ force: true });
        });
    });

    describe('executive summary', () => {
        const selectors = {
            description: '.td-summary',
            descriptionTitle: '.td-description-title',
            wrapper: '.td-executive-summary'
        };

        // This could be abstracted/reused in the future
        const assertRowHasValue = (name, val) => {
            cy.get(`[data-test-id="${name}"]`)
                .should('contain', name)
                .and('contain', val.toString());
        };

        it('shows the exec summary title', () => {
            // Check for the executive summary section
            cy.get(selectors.wrapper).should('be.visible');
        });

        it('shows the description', () => {
            // Check for the description title and content
            cy.get(selectors.descriptionTitle).should('be.visible');
            cy.get(selectors.description).should('be.visible');
        });

        it('displays the table data', () => {
            assertRowHasValue('Total Threats', 14);
            assertRowHasValue('Total Mitigated', 4);
            assertRowHasValue('Not Mitigated', 10);
            assertRowHasValue('Open / High Priority', 4);
            assertRowHasValue('Open / Medium Priority', 4);
            assertRowHasValue('Open / Low Priority', 2);
            assertRowHasValue('Open / Unknown Priority', 0);
        });
    });
});
