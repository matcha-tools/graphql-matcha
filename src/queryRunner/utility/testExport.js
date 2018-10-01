export function fillTestTemplate(query, response) {
  const filledTemplate = 
  `xit('', () => {
    const query = 
    \`${query}\`;
    const expected = 
    \`${response}\`;
    return integrationServer.graphqlQuery(app,query)
    .then((response) => {expect(response.statusCode).to.equal(200);
      expect(response.body).to.have.deep.equals(expected);
    });
  });`;
  return filledTemplate;
}

export function createTestFileContents(its){
  const prettier = require("prettier/standalone");
  const plugins = [require("prettier/parser-flow")];
  const formattedTests = prettier.format(wrapIts(its), {parser:'flow',plugins});
  return formattedTests;
}

function wrapIts(its){
  const mochaWrap = `
  const request = require('request');
  const integrationServer = require("./integrationServer");
  const chai = require('chai');
  
  const expect = chai.expect;
  
  describe('GraphQL Integration Tests', () => {
    let app;
  
    before((done) => {
      app = integrationServer.start(done);
    });
  
    after((done) => {
      integrationServer.stop(app, done);
    });
  
  
    describe('Queries...', () => {
  
      ${its}
  
    });
  });`
  return mochaWrap;
}

export function downloadJSFile(fname,contents){
  const fileContents = [contents];
  const element = document.createElement("a");
  const file = new Blob(fileContents, { type: "application/javascript" });
  element.href = URL.createObjectURL(file);
  element.download = fname;
  element.click();
}