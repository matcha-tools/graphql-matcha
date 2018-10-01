import { parseQueryArray } from "../../src/utils/parsers";
import { expect } from "chai";
import { format } from "prettier";

describe("Unit tests", () => {
  describe("Query Parser", () => {
    it("should auto complete queries generated ending on a Root Node with no fields selected", () => {
      let array = ["allFilms", "edges", "node"];
      let expectedString = `{allFilms{edges{node{...fields}}}}`;
      let result = parseQueryArray(array);
      expect(result).to.equal(format(expectedString, { parser: "graphql" }));
    });

    it("given one element, it should wrap it in curlies and add fragment", () => {
      let array = ["Authors"];
      let expectedString = `{Authors{...fields}}`;
      let result = parseQueryArray(array);
      expect(result).to.equal(format(expectedString, { parser: "graphql" }));
    });

    it("given multiple elements, it should wrap it in curlies and add fragment", () => {
      let array = ["ROOT", "Child", "GrandChild"];
      let expectedString = `{ROOT{Child{GrandChild{...fields}}}}`;
      let result = parseQueryArray(array);
      expect(result).to.equal(format(expectedString, { parser: "graphql" }));
    });

    it("should return query string from query array", () => {
      let array = ["allFilms", "edges", "node", ["id", "title"]];
      let expectedString = `{allFilms{edges{node{id title}}}}`;
      let result = parseQueryArray(array);
      expect(result).to.equal(format(expectedString, { parser: "graphql" }));
    });

    it("should auto complete queries generated ending on a Root Node with no fields selected", () => {
      let array = ["allFilms", "edges", "node", []];
      let expectedString = `{allFilms{edges{node{...fields}}}}`;
      let result = parseQueryArray(array);
      expect(result).to.equal(format(expectedString, { parser: "graphql" }));
    });

    it("should properly parse out a Connection after adding fields", () => {
      let array = [
        "allFilms",
        "edges",
        "node",
        ["id", "title"],
        "speciesConnection",
        "edges",
        "node"
      ];
      let expectedString = `{allFilms{edges{node{episodeID openingCrawl speciesConnection{edges{node{...fields}}}}}}}`;
      let result = parseQueryArray(array);
      expect(result).to.equal(format(expectedString, { parser: "graphql" }));
    });
  });
});
