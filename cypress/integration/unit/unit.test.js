import { parseQueryArray } from "../../../src/utils/parsers";
import {expect} from 'chai';

describe("Unit tests", () => {
  
  describe("Query Parser", () => {

    it("should auto complete queries generated ending on a Root Node with no fields selected", () => {
      let array = ["allFilms", "edges", "node"];
      let expectedString = `{allFilms{edges{node{FIELDS}}}}`;
      let result = parseQueryArray(array);
      expect(result).to.equal(expectedString);
    });

    it("given one element, it should wrap it in curlies and add Placeholder", () => {
      let array = ["Authors"];
      let expectedString = `{Authors{FIELDS}}`;
      let result = parseQueryArray(array);
      expect(result).to.equal(expectedString);
    });

    it("given multiple elements, it should wrap it in curlies and add placeholder", () => {
      let array = ["ROOT","Child","GrandChild"];
      let expectedString = `{ROOT{Child{GrandChild{FIELDS}}}}`;
      let result = parseQueryArray(array);
      expect(result).to.equal(expectedString);
    });
    
    it("should return query string from query array", () => {
      let array = ["allFilms", "edges", "node", ["id", "title"]];
      let expectedString = `{allFilms{edges{node{id title}}}}`;
      let result = parseQueryArray(array);
      expect(result).to.equal(expectedString);
    });
    it("should auto complete queries generated ending on a Root Node with no fields selected", () => {
      let array = ["allFilms", "edges", "node", []];
      let expectedString = `{allFilms{edges{node{id}}}}`;
      let result = parseQueryArray(array);
      expect(result).to.equal(expectedString);
    });
  });
});
