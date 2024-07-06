// support file used by cypress to provide global scripts

// run before every test in every spec file, invokes the application 
beforeEach(() => {
    cy.log('Invoke the Threat Dragon application');
    cy.visit('/', {
        onBeforeLoad: (win) => win.sessionStorage.clear()
    });
    cy.get('#local-login-btn').should('be.visible');
});
