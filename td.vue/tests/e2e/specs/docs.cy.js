describe('docs', () => {

    describe('pages', () => {
        beforeEach(() => {
            cy.visit('/docs');
        });
    
        it('navigates to the About page', () => {
            cy.get('.fa-info-circle').click();
            cy.get('.list-group-item-action[href="/docs/home/about/about.html"]').should('be.visible');
        });
    
        it('navigates to the SBOM page', () => {
            cy.get('.fa-shield-alt').click();
            cy.get('.list-group-item-action[href="/docs/home/trust/sbom.html"]').should('be.visible');
        });

        it('navigates to the Installation page', () => {
            cy.get('.fa-power-off').click();
            cy.get('.list-group-item-action[href="/docs/usage/install/options.html"]').should('be.visible');
        });

        it('navigates to the Modeling page', () => {
            cy.get('.fa-project-diagram').click();
            cy.get('.list-group-item-action[href="/docs/usage/modeling/gettingstarted.html"]').should('be.visible');
        });

        it('navigates to the Collaboration page', () => {
            cy.get('.fa-user-ninja').should('be.visible');
        });

        it('navigates to the Environment page', () => {
            cy.get('.fa-cog').should('be.visible');
        });

        it('navigates to the CLI page', () => {
            cy.get('.fa-layer-group').should('be.visible');
        });

        it('navigates to the Schema page', () => {
            cy.get('.fa-database').click();
            cy.get('.list-group-item-action[href="/docs/development/schema/process.html"]').should('be.visible');
        });

        it('navigates to the API page', () => {
            cy.get('.fa-server').should('be.visible');
        });

        it('navigates to the Testing page', () => {
            cy.get('.fa-heartbeat').click();
            cy.get('.list-group-item-action[href="/docs/development/testing/unit.html"]').should('be.visible');
        });

        it('navigates to the Actions page', () => {
            cy.get('.fa-github-alt').click();
            cy.get('.list-group-item-action[href="/docs/development/actions/about.html"]').should('be.visible');
        });

        it('navigates to the Internationalization page', () => {
            cy.get('.fa-globe-africa').should('be.visible');
        });

        it('navigates to the Local page', () => {
            cy.get('.fa-code').should('be.visible');
        });

        it('navigates to the Release-Process page', () => {
            cy.get('.fa-rocket').should('be.visible');
        });
    });

    describe('sbom', () => {
        beforeEach(() => {
            cy.visit('/docs');
            cy.get('.fa-shield-alt').click();
            cy.get('.list-group-item-action[href="/docs/home/trust/sbom.html"]').click();
        });

        it('has the download links for the SBOMs', () => {
            cy.get('a[href="/docs/downloads/site_json_bom.json"]').should('be.visible');
            cy.get('a[href="/docs/downloads/site_xml_bom.xml"]').should('be.visible');
            cy.get('a[href="/docs/downloads/server_json_bom.json"]').should('be.visible');
            cy.get('a[href="/docs/downloads/server_xml_bom.xml"]').should('be.visible');
            cy.get('a[href="/docs/downloads/canonical_json_bom.json"]').should('be.visible');
            cy.get('a[href="/docs/downloads/canonical_xml_bom.xml"]').should('be.visible');
        });

        it('has a datatable with the canonical SBOM', () => {
            // Arbitrary number.  The datatable plugin manipulates the dom
            // anyways.  For a smoke test, we just want to know there's data in it
            cy.get('.td-data-table').find('tr').its('length').should('be.gt', 5);
        });
    });

/*    describe('navbar', () => {
        const verifyExternalUrl = (selector, url) => {
            cy.get(selector)
                .find('a')
                .should('have.attr', 'href', url)
                .and('have.attr', 'rel', 'noopener noreferrer');
        };

        it('links to the demo application', () => {
            verifyExternalUrl('fa-flask', 'https://www.threatdragon.com/#');
        });

        it('links to Threat Dragon releases', () => {
            verifyExternalUrl('fa-cloud-download-alt', 'https://github.com/OWASP/threat-dragon/releases');
        });

        it('links to Threat Dragon github', () => {
            verifyExternalUrl('fa-github', 'https://github.com/OWASP/threat-dragon');
        });
    });
*/
});
