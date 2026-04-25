const loginLocal = () => {
    cy.visit('/');
    cy.get('#local-login-btn').click();
    cy.get('#nav-sign-out');
};

const openDemoModel = () => {
    loginLocal();
    cy.visit('/#/demo/select');
    cy.get('[data-model-name="Demo Threat Model"]').click();
    cy.url().should('contain', '/local/Demo%20Threat%20Model');
    cy.get('#td-edit-btn');
};

const openNewModel = () => {
    loginLocal();
    cy.visit('/#/local/threatmodel/new');
    cy.url().should('contain', '/local/New%20Threat%20Model/edit');
    cy.get('#description');
};

describe('visual regression - local provider routes', () => {
    it('captures the public home route', () => {
        cy.visit('/');
        cy.get('#local-login-btn');
        cy.matchVisualSnapshot('home');
    });

    it('captures the local dashboard route', () => {
        loginLocal();
        cy.url().should('contain', '/dashboard');
        cy.matchVisualSnapshot('local-dashboard');
    });

    it('captures the demo selector route', () => {
        loginLocal();
        cy.visit('/#/demo/select');
        cy.url().should('contain', '/demo/select');
        cy.get('[data-model-name="Demo Threat Model"]');
        cy.matchVisualSnapshot('local-demo-select');
    });

    it('captures the import route', () => {
        loginLocal();
        cy.visit('/#/local/threatmodel/import');
        cy.url().should('contain', '/local/threatmodel/import');
        cy.get('#json-input');
        cy.matchVisualSnapshot('local-import');
    });

    it('captures the new threat model route resolved to edit state', () => {
        openNewModel();
        cy.matchVisualSnapshot('local-new-threat-model-edit');
    });

    it('captures the template gallery route', () => {
        loginLocal();
        cy.visit('/#/local/templates');
        cy.url().should('contain', '/local/templates');
        cy.get('#nav-sign-out');
        cy.matchVisualSnapshot('local-template-gallery');
    });

    it('captures the demo threat model view route with a sample diagram', () => {
        openDemoModel();
        cy.get('#td-report-btn');
        cy.matchVisualSnapshot('local-demo-threat-model');
    });

    it('captures the demo threat model edit route', () => {
        openDemoModel();
        cy.get('#td-edit-btn').click();
        cy.url().should('contain', '/edit');
        cy.get('#description');
        cy.matchVisualSnapshot('local-demo-threat-model-edit');
    });

    it('captures the demo diagram edit route with a sample diagram loaded', () => {
        openDemoModel();
        cy.get('.td-diagram-thumb').first().click();
        cy.url().should('contain', '/edit/Main%20Request%20Data%20Flow');
        cy.get('#graph-container');
        cy.matchVisualSnapshot('local-demo-diagram-edit');
    });

    it('captures the demo report route', () => {
        openDemoModel();
        cy.get('#td-report-btn').click();
        cy.url().should('contain', '/report');
        cy.get('#td-return-btn');
        cy.matchVisualSnapshot('local-demo-report');
    });

    it('captures the export template route', () => {
        openDemoModel();
        cy.get('#manage-model-btn').click();
        cy.get('#export-template-option').click();
        cy.url().should('contain', '/local/export-template');
        cy.get('#name').should('have.value', 'Demo Threat Model');
        cy.matchVisualSnapshot('local-export-template');
    });
});
