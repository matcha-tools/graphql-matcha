describe("Integration tests", () => {
  it("visits the site", () => {
    cy.visit("http://localhost:9090");
  });

  it("disables the Draft button until the schema has generated", () => {
    cy.contains("View Schema").click();
    cy.get(".vis-control > button").should("be.disabled");
    cy.wait(1500);
    cy.get(".vis-control > button").should("be.enabled");
    cy.wait(500);
    cy.contains("Hide Schema").click();
  });

  it("toggles in/out of query mode via button", () => {
    cy.contains("View Schema").click();
    cy.wait(1000);
    cy.get(".vis-control > button").click();
    cy.wait(600);
    cy.get('.loader').click();
  });

  it("selects starship node, enters draft mode to focus on ROOT", () => {
    cy.contains("Starship").click();
    cy.wait(400);
    cy.get(".vis-control > button").click();
    cy.get(".active").should("have.text", "Root ");
  });

  it("clicks allFilms, and populates the query editor", () => {
    cy.get(":nth-child(1) > .doc-category > :nth-child(2)").click();
    cy.get(".query-editor").contains("{");
    cy.contains(".query-editor", "{allFilms{edges{node{...fields}}}}");
  });

  xit("PRETTY clicks allFilms, and populates the query editor", () => {
    cy.get(":nth-child(1) > .doc-category > :nth-child(2)").click();
    cy.get(".query-editor").contains("{");
    cy.contains(".query-editor", "allFilms {");
    cy.contains(".query-editor", "edges {");
    cy.contains(".query-editor", "node {");
    cy.contains(".query-editor", "...fields");
  });

  it("clicks film field, exits query mode, runs the query with result", () => {
    cy.get(":nth-child(1) > .doc-category > :nth-child(2)").click();
    cy.get('.loader').click();
    cy.get(".execute-button").click();
    cy.wait(1200);
    //check results
    cy.get(
      '.result-window > .CodeMirror > .CodeMirror-scroll > .CodeMirror-sizer > [style="position: relative; top: 0px;"] > .CodeMirror-lines'
    ).contains("A New Hope");
    cy.get(
      '.result-window > .CodeMirror > .CodeMirror-scroll > .CodeMirror-sizer > [style="position: relative; top: 0px;"] > .CodeMirror-lines'
    ).contains("The Empire Strikes Back");
  });

  it("clears the current querytext, types in a query, runs it", () => {
    cy.get(".query-editor textarea").type("{ctrl}a{del}", {
      delay: 50,
      force: true
    });
    cy.get(".query-editor textarea").type(
      "{{}allVehicles{{}vehicles{{}crew}}}",
      { delay: 50, force: true }
    );
    cy.get(".execute-button").click();
    cy.wait(1200);
  });

  xit("PRETTY goes back in to QMode, selects allPlanets > population", () => {
    cy.get(".vis-control > button").click();
    cy.get(".active").should("have.text", "Root ");
    cy.get(".doc-category > :nth-child(6)").click();
    cy.get(".doc-category > :nth-child(7)").click();
    cy.contains(".query-editor", "allPlanets {");
    cy.contains(".query-editor", "edges {");
    cy.contains(".query-editor", "node {");
    cy.contains(".query-editor", "population");
  });

  it("goes back in to QMode, selects allPlanets > population", () => {
    cy.get(".vis-control > button").click();
    cy.get(".active").should("have.text", "Root ");
    cy.get(".doc-category > :nth-child(6)").click();
    cy.get(".doc-category > :nth-child(7)").click();
    cy.get(".doc-category > :nth-child(7)").should('have.class','-selected');
    cy.contains(".query-editor", "{allPlanets{edges{node{population}}}}");
  });

  it("selects name,  climates,  deselects planet> population", () => {
    cy.get(".doc-category > :nth-child(8)").click();
    cy.get(".doc-category > :nth-child(8)").should('have.class','-selected');
    cy.get(".doc-category > :nth-child(2)").click();
    cy.get(".doc-category > :nth-child(2)").should('have.class','-selected');
    cy.get(".doc-category > :nth-child(7)").click();
    cy.get(".doc-category > :nth-child(7)").should('not.have.class','-selected');
    cy.contains(".query-editor", "{allPlanets{edges{node{climates name}}}}");
  });

  it("navigates to residentConnection, selects name, birth year", () => {
    cy.get(".doc-category > :nth-child(11)").click();
    cy.get(".doc-category > :nth-child(2)").click();
    cy.get(".doc-category > :nth-child(2)").should('have.class','-selected');
    cy.get(".doc-category > :nth-child(3)").click();
    cy.get(".doc-category > :nth-child(3)").should('have.class','-selected');
    cy.contains(
      ".query-editor",
      "{allPlanets{edges{node{climates name residentConnection{edges{node{name birthYear}}}}}}}"
    );
  });

  it("hits the back button, sees previous query", () => {
    cy.get(".back").click();
    cy.get(".doc-category > :nth-child(2)").should('have.class','-selected');
    cy.get(".doc-category > :nth-child(8)").should('have.class','-selected');
    cy.contains(".query-editor", "{allPlanets{edges{node{climates name}}}}");
  });

  it("exits query mode, and keeps the last generated query", () => {
    cy.get('.loader').click();
    cy.contains(".query-editor", "{allPlanets{edges{node{climates name}}}}");
  });

  xit("PRETTY exits query mode, and keeps the last generated query", () => {
    cy.get(".vis-control > button").click();
    cy.contains(".query-editor", "allPlanets {");
    cy.contains(".query-editor", "edges {");
    cy.contains(".query-editor", "node {");
    cy.contains(".query-editor", "population");
  });
});
