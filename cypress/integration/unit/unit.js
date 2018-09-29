import { parseQueryArray } from "../../../src/helpers";

describe("Unit tests", () => {
  
  describe("Query Parser", () => {
    
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
