const expectedRuntimeError = 'is not a function';

const installBrowserErrorCapture = () => {
    Cypress.once('window:before:load', (win) => {
        win.__tdObservedErrors = [];

        const pushError = (value) => {
            const message = value?.message || value?.reason?.message || value;
            win.__tdObservedErrors.push(String(message));
        };

        win.addEventListener('error', (event) => {
            pushError(event.error || event.message);
        });

        win.addEventListener('unhandledrejection', (event) => {
            pushError(event.reason);
        });

        win.addEventListener('securitypolicyviolation', (event) => {
            pushError(`${event.violatedDirective}: ${event.blockedURI}`);
        });

        const originalConsoleError = win.console.error.bind(win.console);
        win.console.error = (...args) => {
            args.forEach(pushError);
            originalConsoleError(...args);
        };
    });
};

const openDemoModel = (modelName) => {
    cy.get('#local-login-btn').click();
    cy.get('a[href="#/demo/select"]').click();
    cy.get(`[data-model-name="${modelName}"]`).click();
    cy.contains(modelName);
};

const openDiagramEditor = (diagramTitle) => {
    cy.contains('.diagram-edit', diagramTitle).click();
    cy.get('#graph-container').should('be.visible');
    cy.get('#graph-container .x6-graph-svg-stage')
        .children()
        .should('have.length.greaterThan', 0);
};

const selectGraphLabel = (labelPattern) => {
    cy.contains('#graph-container .x6-cell.x6-node tspan', labelPattern)
        .parents('g.x6-node')
        .first()
        .click({ force: true });
};

const assertNoObservedError = (matcher) => {
    cy.window().its('__tdObservedErrors').should((messages) => {
        expect(messages, 'captured browser errors').to.satisfy((errors) =>
            errors.every((message) => !message.includes(matcher))
        );
    });
};

const assertNoSecurityPolicyViolation = () => {
    cy.window().its('__tdObservedErrors').should((messages) => {
        expect(messages, 'captured browser errors').to.satisfy((errors) =>
            errors.every((message) => !message.includes('script-src') && !message.includes('javascript:'))
        );
    });
};

const assertNoJavascriptLinks = () => {
    cy.get('a[href^="javascript:"]').should('have.length', 0);
};

const withinVisibleModal = (callback) => {
    cy.get('.modal.show').should('have.length.at.least', 1).last().within(callback);
};

const selectAlternateThreatType = () => {
    cy.get('#threat-type option').should('have.length.greaterThan', 1);
    cy.get('#threat-type option').eq(1).invoke('text').then((optionText) => {
        cy.get('#threat-type').select(optionText, { force: true });
        cy.get('#threat-type option:selected').should('have.text', optionText);
    });
};

const addSeparatedFormTags = (fieldSelector, firstTag, secondTag) => {
    cy.get(`${fieldSelector} input[type="text"], ${fieldSelector}[type="text"]`)
        .last()
        .as('tagInput')
        .type(`${firstTag},${secondTag}`, { force: true });
    cy.contains(fieldSelector, firstTag).should('be.visible');
    cy.get('@tagInput').should('have.value', secondTag);
    cy.get('@tagInput').type('{enter}', { force: true });
    cy.contains(fieldSelector, secondTag).should('be.visible');
};

describe('Regressions discovered during vue3 migration', () => {
    beforeEach(() => {
        installBrowserErrorCapture();
        cy.visit('/');
    });

    it('updates threat edit radio and select controls without runtime errors', () => {
        openDemoModel('Demo Threat Model');
        assertNoJavascriptLinks();
        openDiagramEditor('Main Request Data Flow');
        assertNoJavascriptLinks();
        selectGraphLabel(/Database/);
        assertNoJavascriptLinks();

        cy.contains('.threat-card a', 'Unauthorised access').click();
        withinVisibleModal(() => {
            selectAlternateThreatType();
            cy.get('#status input[type="radio"]').check('Mitigated', { force: true });
            cy.get('#status input[type="radio"][value="Mitigated"]').should('be.checked');
            cy.get('#severity input[type="radio"]').check('Low', { force: true });
            cy.get('#severity input[type="radio"][value="Low"]').should('be.checked');
        });

        assertNoObservedError(expectedRuntimeError);
    });

    it('updates threat suggestion controls without runtime errors', () => {
        openDemoModel('Demo Threat Model');
        openDiagramEditor('Main Request Data Flow');
        selectGraphLabel(/Database/);

        cy.contains('a.new-threat-by-type', 'New Threat by Type').click();
        withinVisibleModal(() => {
            selectAlternateThreatType();
            cy.get('#status input[type="radio"]').check('Mitigated', { force: true });
            cy.get('#status input[type="radio"][value="Mitigated"]').should('be.checked');
            cy.get('#severity input[type="radio"]').check('Low', { force: true });
            cy.get('#severity input[type="radio"][value="Low"]').should('be.checked');
        });

        assertNoObservedError(expectedRuntimeError);
    });

    it('does not render javascript: links in the exercised threat-model flows', () => {
        assertNoJavascriptLinks();

        openDemoModel('Demo Threat Model');
        assertNoJavascriptLinks();

        openDiagramEditor('Main Request Data Flow');
        assertNoJavascriptLinks();
        selectGraphLabel(/Database/);
        assertNoJavascriptLinks();

        cy.contains('.threat-card a', 'Unauthorised access')
            .should('have.attr', 'href', '#');
    });

    it('updates Bootstrap contributor tags without runtime errors', () => {
        openDemoModel('Demo Threat Model');

        cy.get('#td-edit-btn').click();
        addSeparatedFormTags('#contributors', 'a', 'b');

        assertNoObservedError(expectedRuntimeError);
        assertNoSecurityPolicyViolation();
    });

    it('updates export-template tags through a Bootstrap dropdown without runtime errors', () => {
        openDemoModel('Demo Threat Model');

        cy.get('#manage-model-btn.dropdown-toggle, #manage-model-btn')
            .first()
            .click({ force: true });
        cy.get('#export-template-option').click({ force: true });
        addSeparatedFormTags('#template-tags', 'a', 'b');

        assertNoObservedError(expectedRuntimeError);
        assertNoSecurityPolicyViolation();
    });
});
