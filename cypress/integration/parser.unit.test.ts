import { parseQueryStack } from "../../src/utils/parsers";
import { expect } from "chai";
//FIXME cannot use prettier for tests... 
// import { format } from "prettier";

describe("Unit tests", () => {
  describe("Query Parser", () => {
    it("should auto complete queries generated ending on a Root Node with no fields selected", () => {
      let array = ["allFilms", "edges", "node"];
      let expectedString = `{allFilms{edges{node{...fields}}}}`;
      let result = parseQueryStack(array);
      // expect(result).to.equal(format(expectedString, { parser: "graphql" }));
      expect(result).to.equal(expectedString);
    });

    it("should auto complete queries generated ending on a Root Node with no fields selected", () => {
      let array = ["allFilms", "edges", "node", []];
      let expectedString = `{allFilms{edges{node{...fields}}}}`;
      let result = parseQueryStack(array);
      // expect(result).to.equal(format(expectedString, { parser: "graphql" }));
      expect(result).to.equal(expectedString);
    });

    it("given one element, it should wrap it in curlies and add fragment", () => {
      let array = ["Authors"];
      let expectedString = `{Authors{...fields}}`;
      let result = parseQueryStack(array);
      // expect(result).to.equal(format(expectedString, { parser: "graphql" }));
      expect(result).to.equal(expectedString);
    });

    it("given multiple elements, it should wrap it in curlies and add fragment", () => {
      let array = ["ROOT", "Child", "GrandChild"];
      let expectedString = `{ROOT{Child{GrandChild{...fields}}}}`;
      let result = parseQueryStack(array);
      // expect(result).to.equal(format(expectedString, { parser: "graphql" }));
      expect(result).to.equal(expectedString);
    });

    it("should return query string from query array", () => {
      let array = ["allFilms", "edges", "node", ["id", "title"]];
      let expectedString = `{allFilms{edges{node{id title}}}}`;
      let result = parseQueryStack(array);
      // expect(result).to.equal(format(expectedString, { parser: "graphql" }));
      expect(result).to.equal(expectedString);
    });

  

    xit("should properly parse out a Connection after adding fields", () => {
      let array = [
        "allFilms",
        "edges",
        "node",
        ["id", "title"],
        "speciesConnection",
        "edges",
        "node"
      ];
      let expectedString = `{allFilms{edges{node{id title speciesConnection{edges{node{...fields}}}}}}}`;
      let result = parseQueryStack(array);
      // expect(result).to.equal(format(expectedString, { parser: "graphql" }));
      expect(result).to.equal(expectedString);
    });
  });
});
