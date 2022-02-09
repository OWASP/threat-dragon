// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// https://github.com/cypress-io/cypress/issues/1123#issuecomment-620074238
Cypress.Commands.add('paste', {
    prevSubject: true,
    element: true
}, ($element, text) => {
    const subString = text.substr(0, text.length - 1).replace(/\n/g, '');
    const lastChar = text.slice(-1);
  
    $element.text(subString);
    $element.val(subString);
    cy.get($element.selector).type(lastChar);
});