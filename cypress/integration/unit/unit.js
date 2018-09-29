import { parseQueryArray } from "../../../src/helpers";

describe("Unit tests", () => {
  
  describe("Query Parser", () => {
    
    xit("should return query string from query array", () => {
      let array = ["allFilms", "edges", "node", ["id", "title"]];
      let expectedString = `{allFilms{edges{node{id title}}}}`;
      let result = parseQueryArray(array);
      expect(result).to.equal(expectedString);
    });
    
  });
  
});
