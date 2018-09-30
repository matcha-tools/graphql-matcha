import { parseQueryArray } from "../../../src/helpers";
import { storeEdges, selectNode, clearSelection } from '../../../src/visualizer/actions/viewport.ts';
import reducer from '../../../src/visualizer/reducers/index';

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

  describe('actions', () => {
    it('should create an action to store an edge', () => {
      const edge = 'title'
      const expectedAction = {
        type: STORE_EDGES,
        payload: edge
      }
      expect(storeEdges(edge)).toEqual(expectedAction);
    });

    it('should create an action to select a node', () => {
      const node = 'TYPE::Film'
      const expectedAction = {
        type: SELECT_NODE,
        payload: edge
      }
      expect(selectNode(node)).toEqual(expectedAction);
    });

    it('should create an action to clear selection', () => {
      const expectedAction = {
        type: CLEAR_SELECTION,
      }
      expect(clearSelection()).toEqual(expectedAction);
    });
  });

  describe("Reducers", () => {

    const initialState = {
      schema: null,
      displayOptions: {
        rootTypeId: undefined,
        skipRelay: true,
        sortByAlphabet: false,
        showLeafFields: true,
        hideRoot: false,
      },
      selected: {
        previousTypesIds: [],
        currentNodeId: null,
        currentEdgeId: null,
        scalar: null,
        queryModeHistory: [], 
        multipleEdgeIds: [],
      },
      graphView: {
        svg: null,
        focusedId: null,
      },
      menuOpened: false,
      errorMessage: null,
    };

    it("should return to initial state when dispatching clearSelection", () => {
      expect(reducer({}, { type: CLEAR_SELECTION })).toEqual(initialState)
    });

    it("should store the selected node when dispatching selectNode", () => {
      const expectedState = {
      schema: null,
      displayOptions: {
        rootTypeId: undefined,
        skipRelay: true,
        sortByAlphabet: false,
        showLeafFields: true,
        hideRoot: false,
      },
      selected: {
        previousTypesIds: ['TYPE::Film'],
        currentNodeId: 'TYPE::Film',
        currentEdgeId: null,
        scalar: null,
        queryModeHistory: [], 
        multipleEdgeIds: [],
      },
      graphView: {
        svg: null,
        focusedId: null,
      },
      menuOpened: false,
      errorMessage: null,
      }
      expect(reducer({}, { type: SELECT_NODE, payload: 'TYPE::Film' })).toEqual(expectedState)
    });

    it("should store edges when dispatching storeEdges", () => {
      const name = 'title';
      const expectedState = {
        schema: null,
        displayOptions: {
          rootTypeId: undefined,
          skipRelay: true,
          sortByAlphabet: false,
          showLeafFields: true,
          hideRoot: false,
        },
        selected: {
          previousTypesIds: [],
          currentNodeId: null,
          currentEdgeId: null,
          scalar: null,
          queryModeHistory: [], 
          multipleEdgeIds: ['title'],
        },
        graphView: {
          svg: null,
          focusedId: null,
        },
        menuOpened: false,
        errorMessage: null,
      };
      expect(reducer({}, { 
        type: STORE_EDGES,
        payload: name,
      })).toEqual(expectedState)
    });

    it("should not store the same edge inside of multipleEdgeIds when dispatching storeEdges", () => {
      const name = 'title';
      const expectedState = {
        schema: null,
        displayOptions: {
          rootTypeId: undefined,
          skipRelay: true,
          sortByAlphabet: false,
          showLeafFields: true,
          hideRoot: false,
        },
        selected: {
          previousTypesIds: [],
          currentNodeId: null,
          currentEdgeId: null,
          scalar: null,
          queryModeHistory: [], 
          multipleEdgeIds: ['title'],
        },
        graphView: {
          svg: null,
          focusedId: null,
        },
        menuOpened: false,
        errorMessage: null,
      };
      expect(reducer({expectedState}, { 
        type: STORE_EDGES,
        payload: name,
      })).toNotEqual(expectedState)
    });
  });

});