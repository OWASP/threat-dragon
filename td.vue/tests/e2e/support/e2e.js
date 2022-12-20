// support file used by cypress to provide global scripts

// run before every test in every spec file, invokes the application 
beforeEach(() => {
    cy.log('Invoke the Threat Dragon application');
    cy.visit('/', {
        onBeforeLoad: (win) => win.sessionStorage.clear()
    });
    cy.get('.Vue-Toastification__toast--error').should('be.visible');
    cy.get('.Vue-Toastification__close-button').click();
});
