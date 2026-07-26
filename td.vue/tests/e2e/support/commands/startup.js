Cypress.Commands.add('launchThreatDragon', () => {
    cy.intercept('GET', '/api/config').as('getConfig');
    cy.visit('/', {
        onBeforeLoad: (win) => win.sessionStorage.clear()
    });
    cy.wait('@getConfig');
    cy.get('.spinner-border').should('not.exist');
    cy.get('#local-login-btn').should('be.visible');
});