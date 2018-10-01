import { parseQueryStack } from "../../src/utils/parsers";
import { expect } from "chai";
//FIXME cannot use prettier for tests... 
// import { format } from "prettier";

describe("Unit tests", () => {
  describe("Query Parser", () => {
    it("should auto complete queries generated ending on a Root Node with no fields selected", () => {
      const array = ["allFilms", "edges", "node"];
      const expectedString = `{allFilms{edges{node{...fields}}}}`;
      const result = parseQueryStack(array);
      // expect(result).to.equal(format(expectedString, { parser: "graphql" }));
      expect(result).to.equal(expectedString);
    });

    it("should auto complete queries generated ending on a Root Node with no fields selected", () => {
      const array = ["allFilms", "edges", "node", []];
      const expectedString = `{allFilms{edges{node{...fields}}}}`;
      const result = parseQueryStack(array);
      // expect(result).to.equal(format(expectedString, { parser: "graphql" }));
      expect(result).to.equal(expectedString);
    });

    it("given one element, it should wrap it in curlies and add fragment", () => {
      const array = ["Authors"];
      const expectedString = `{Authors{...fields}}`;
      const result = parseQueryStack(array);
      // expect(result).to.equal(format(expectedString, { parser: "graphql" }));
      expect(result).to.equal(expectedString);
    });

    it("given multiple elements, it should wrap it in curlies and add fragment", () => {
      const array = ["ROOT", "Child", "GrandChild"];
      const expectedString = `{ROOT{Child{GrandChild{...fields}}}}`;
      const result = parseQueryStack(array);
      // expect(result).to.equal(format(expectedString, { parser: "graphql" }));
      expect(result).to.equal(expectedString);
    });

    it("should return query string from query array", () => {
      const array = ["allFilms", "edges", "node", ["id", "title"]];
      const expectedString = `{allFilms{edges{node{id title}}}}`;
      const result = parseQueryStack(array);
      // expect(result).to.equal(format(expectedString, { parser: "graphql" }));
      expect(result).to.equal(expectedString);
    });

  

    it("should properly parse out a Connection after adding fields", () => {
      const array = [
        "allFilms",
        "edges",
        "node",
        ["id", "title"],
        "speciesConnection",
        "edges",
        "node"
      ];
      const expectedString = `{allFilms{edges{node{id title speciesConnection{edges{node{...fields}}}}}}}`;
      const result = parseQueryStack(array);
      // expect(result).to.equal(format(expectedString, { parser: "graphql" }));
      expect(result).to.equal(expectedString);
    });
  });
});
