import { storeEdges, selectNode, clearSelection } from '../../src/visualizer/actions/viewport.ts';
import {rootReducer } from '../../src/visualizer/reducers/index';
import * as ActionTypes from '../../src/visualizer/actions/';
import {expect} from 'chai';

describe("Actions unit Testing", () => {
  describe('actions', () => {
    it('should create an action to store an edge', () => {
      const edge = 'title'
      const expectedAction = {
        type: ActionTypes.STORE_EDGES,
        payload: edge
      };
      expect(storeEdges(edge)).to.deep.equal(expectedAction);
    });
  
    it('should create an action to select a node', () => {
      const node = 'TYPE::Film'
      const expectedAction = {
        type: ActionTypes.SELECT_NODE,
        payload: node
      };
      expect(selectNode(node)).to.deep.equal(expectedAction);
    });
  
    it('should create an action to clear selection', () => {
      const expectedAction = { type: ActionTypes.CLEAR_SELECTION };
      expect(clearSelection()).to.deep.equal(expectedAction);
    });
  });
});


describe("Reducers unit testing", () => {
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

  xit("should return to initial state when dispatching clearSelection", () => {
    expect(rootReducer({}, { type: ActionTypes.CLEAR_SELECTION })).to.deep.equal(initialState)
  });

  xit("should store the selected node when dispatching selectNode", () => {
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
    expect(rootReducer({}, { type: ActionTypes.SELECT_NODE, payload: 'TYPE::Film' })).to.deep.equal(expectedState)
  });

  xit("should store edges when dispatching storeEdges", () => {
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
    expect(rootReducer({}, { 
      type: ActionTypes.STORE_EDGES,
      payload: name,
    })).to.deep.equal(expectedState)
  });

  xit("should not store the same edge inside of multipleEdgeIds when dispatching storeEdges", () => {
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
    expect(rootReducer({expectedState}, { 
      type: ActionTypes.STORE_EDGES,
      payload: name,
    })).toNotEqual(expectedState)
  });

  xit("should store the pending edges in queryModeHistory when exiting out of query mode", () => {
    const intialStateForStoringPendingEdges = {
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
        multipleEdgeIds: ['title', 'id', 'director'],
      },
      graphView: {
        svg: null,
        focusedId: null,
      },
      menuOpened: false,
      errorMessage: null,
    };
    const expectedStateForStoringPendingEdges = {
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
        queryModeHistory: [['title', 'id', 'director']], 
        multipleEdgeIds: [],
      },
      graphView: {
        svg: null,
        focusedId: null,
      },
      menuOpened: false,
      errorMessage: null,
    };
    expect(rootReducer({intialStateForStoringPendingEdges}, { 
      type: ActionTypes.STORE_PENDING_EDGES,
    })).toNotEqual(expectedStateForStoringPendingEdges)
  });
});


describe("PREVIOUS_NODE_AND_EDGES reducer", () => {
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
  describe("If the last element is 'node'", () => {

    it("should return to initial state if the length of the queryModeHistory array is 3", () => {
      const initialForThisTest = {
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
          queryModeHistory: ["allfilms", "edges", "node"], 
          multipleEdgeIds: [],
        },
        graphView: {
          svg: null,
          focusedId: null,
        },
        menuOpened: false,
        errorMessage: null,
      };
      expect(rootReducer(initialForThisTest, { type: ActionTypes.PREVIOUS_NODE_AND_EDGES })).to.deep.equal(initialState)
    });

    xit("should return to the previous node, remove the present edges and node, and store previously selected edges in multipleEdgeIds", () => {
      const initialForThisTest = {
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
          queryModeHistory: ["allfilms", "edges", "node", ["title", "episodeID", "openingCrawl"], "speciesConnection", "edges", "node"], 
          multipleEdgeIds: ["name"],
        },
        graphView: {
          svg: null,
          focusedId: null,
        },
        menuOpened: false,
        errorMessage: null,
      }
      const expectedForThisTest = {
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
          queryModeHistory: ["allfilms", "edges", "node"], 
          multipleEdgeIds: ["title", "episodeID", "openingCrawl"],
        },
        graphView: {
          svg: null,
          focusedId: null,
        },
        menuOpened: false,
        errorMessage: null,
      }
      expect(rootReducer(initialForThisTest , { type: ActionTypes.STORE_PENDING_EDGES })).to.deep.equal(expectedForThisTest)
    });

    xit("should return to the previous node, remove the present edges and node, and contain an empty array for multipleEdgeIds if no edges were selected in previous node", () => {
      const initialForThisTest = { 
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
          queryModeHistory: ["allPeople", "edges", "node", "filmConnection", "edges", "node"], 
          multipleEdgeIds: [],
        },
        graphView: {
          svg: null,
          focusedId: null,
        },
        menuOpened: false,
        errorMessage: null,
      }
      const expectedForThisTest = {
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
          queryModeHistory: ["allPeople", "edges", "node"], 
          multipleEdgeIds: [],
        },
        graphView: {
          svg: null,
          focusedId: null,
        },
        menuOpened: false,
        errorMessage: null,
      }
      expect(rootReducer(initialForThisTest , { type: ActionTypes.STORE_PENDING_EDGES })).to.deep.equal(expectedForThisTest)
    });

    xit("should return to the previous type and store previously selected edges in multipleEdgeIds", () => {
      const initialForThisTest = { 
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
          queryModeHistory: ["planet(args)", ["name", "diameter", "gravity"], "residentConnection", "edges", "node"], 
          multipleEdgeIds: ["mass", "height"],
        },
        graphView: {
          svg: null,
          focusedId: null,
        },
        menuOpened: false,
        errorMessage: null,
      }
      const expectedForThisTest = {
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
          queryModeHistory: ["planet(args)"], 
          multipleEdgeIds: ["name", "diameter", "gravity"],
        },
        graphView: {
          svg: null,
          focusedId: null,
        },
        menuOpened: false,
        errorMessage: null,
      }
      expect(rootReducer(initialForThisTest , { type: ActionTypes.STORE_PENDING_EDGES })).to.deep.equal(expectedForThisTest)
    });

    xit("should return to the previous type and contain an empty array for multipleEdgeIds if no edges were selected in previous type", () => {
      const initialForThisTest = { 
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
          queryModeHistory: ["species(args)", "personConnection", "edges", "node"], 
          multipleEdgeIds: ["gender"],
        },
        graphView: {
          svg: null,
          focusedId: null,
        },
        menuOpened: false,
        errorMessage: null,
      }
      const expectedForThisTest = {
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
          queryModeHistory: ["species(args)"], 
          multipleEdgeIds: [],
        },
        graphView: {
          svg: null,
          focusedId: null,
        },
        menuOpened: false,
        errorMessage: null,
      }
      expect(rootReducer(initialForThisTest , { type: ActionTypes.STORE_PENDING_EDGES })).to.deep.equal(expectedForThisTest)
    });

  });

  describe("If the last element is not 'node'", () => {
    
    xit("should return to the previously selected node or type and store previously selected edges in multipleEdgeIds", () => {
      const initialForThisTest = {
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
          queryModeHistory: ["starship(args)", ["crew"], "pilotConnection", "edges", "node", ["name", "eyecolor"], "homeworld"], 
          multipleEdgeIds: ["climates", "terrains"],
        },
        graphView: {
          svg: null,
          focusedId: null,
        },
        menuOpened: false,
        errorMessage: null,
      }
      const expectedForThisTest = {
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
          queryModeHistory: ["starship(args)", ["crew"], "pilotConnection", "edges", "node"], 
          multipleEdgeIds: ["name", "eyecolor"],
        },
        graphView: {
          svg: null,
          focusedId: null,
        },
        menuOpened: false,
        errorMessage: null,
      }
      expect(rootReducer(initialForThisTest , { type: ActionTypes.STORE_PENDING_EDGES })).to.deep.equal(expectedForThisTest)
    });

    xit("should return to the previously selected node or type and contain an empty array for multipleEdgeIds if no edges were selected in previous type", () => {
      const initialForThisTest = {
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
          queryModeHistory: ["film(args)", ["title", "episodeID"], "speciesConnection", "edges", "node", "homeworld"], 
          multipleEdgeIds: ["gravity", "population"],
        },
        graphView: {
          svg: null,
          focusedId: null,
        },
        menuOpened: false,
        errorMessage: null,
      }
      const expectedForThisTest = {
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
          queryModeHistory: ["film(args)", ["title", "episodeID"], "speciesConnection", "edges", "node"], 
          multipleEdgeIds: [],
        },
        graphView: {
          svg: null,
          focusedId: null,
        },
        menuOpened: false,
        errorMessage: null,
      }
      expect(rootReducer(initialForThisTest , { type: ActionTypes.STORE_PENDING_EDGES })).to.deep.equal(expectedForThisTest)
    });
  });
});