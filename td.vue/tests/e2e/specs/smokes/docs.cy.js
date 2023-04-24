describe('docs', () => {

  describe('page', () => {
    beforeEach(() => {
      cy.visit('/docs');
    });

    it('navigates to the SBOM page', () => {
      cy.get('.fa-shield-alt').click();
      cy.get('.list-group-item-action[href="/docs/home/trust/sbom.html"]').should('be.visible');
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
});
