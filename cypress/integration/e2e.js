describe("Integration tests", () => {
  it("visits the site, opens the schema", () => {
    cy.visit("http://localhost:9090");
    cy.contains("Show Schema").click();

  });

  it("toggles into query mode, activating Root node", () => {
    cy.contains("Draft Query").click();
    cy.get('.active').should('have.text','Root');
  });

  it("clicks allFilms, and populates the query editor", () =>{
   cy.get(':nth-child(1) > .doc-category > :nth-child(2)') 
   cy.get(':nth-child(1) > .CodeMirror-line > [role="presentation"] > .cm-punctuation').should('have.text',"{");
   cy.get('.cm-property').should('have.text',"allFilms");
   cy.get(':nth-child(1) > .CodeMirror-line > [role="presentation"] > .cm-punctuation').should('have.text',"}");
  });

});
