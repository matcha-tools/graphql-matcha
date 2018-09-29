import * as _ from 'lodash';

import * as ActionTypes from '../actions/';

import { extractTypeId } from '../introspection';


export type DisplayOptions = {
  rootTypeId?: string;
  skipRelay: boolean;
  sortByAlphabet: boolean;
  showLeafFields: boolean;
  hideRoot: boolean;
};

export type StateInterface = {
  schema: any;
  displayOptions: DisplayOptions;
  selected: {
    previousTypesIds: string[];
    currentNodeId: string | null;
    currentEdgeId: string | null;
    scalar: string | null;
    queryModeHistory: string[];  
    multipleEdgeIds: string[];
  };
  graphView: {
    svg: string;
    focusedId: string | null;
  };
  menuOpened: boolean;
  errorMessage: string | null;
};

const initialState: StateInterface = {
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

function pushHistory(currentTypeId: string, previousState): string[] {
  let previousTypesIds = previousState.selected.previousTypesIds;
  let previousTypeId = previousState.selected.currentNodeId;

  if (previousTypeId === null || previousTypeId === currentTypeId) return previousTypesIds;

  if (_.last(previousTypesIds) !== previousTypeId) return [...previousTypesIds, previousTypeId];
}

function isRelay(field:any): boolean {
  if (field.relayType) {
    return true;
  } else {
    return false;
  }
}

function grabArgs(field:any): boolean {
  if (Object.keys(field.args).length !== 0) {
    return true;
  } else {
    return false;
  }
}

export function rootReducer(previousState = initialState, action) {
  const { type } = action;
  switch (type) {
    case ActionTypes.CHANGE_SCHEMA:
      return {
        ...previousState,
        schema: action.payload.introspection,
        displayOptions: _.defaults(action.payload.displayOptions, initialState.displayOptions),
        graphView: initialState.graphView,
        selected: initialState.selected,
      };
    case ActionTypes.CHANGE_DISPLAY_OPTIONS:
      let displayOptions = {
        ...previousState.displayOptions,
        ...action.payload,
      };
      return {
        ...previousState,
        displayOptions,
        graphView: initialState.graphView,
        selected: initialState.selected,
      };
    case ActionTypes.SVG_RENDERING_FINISHED:
      return {
        ...previousState,
        graphView: {
          ...previousState.graphView,
          svg: action.payload,
        },
      };
    case ActionTypes.SELECT_NODE:
      const currentNodeId = action.payload;
      if (currentNodeId === previousState.selected.currentNodeId) return previousState;

      return {
        ...previousState,
        selected: {
          ...previousState.selected,
          previousTypesIds: pushHistory(currentNodeId, previousState),
          currentNodeId,
          currentEdgeId: null,
          scalar: null,
        },
      };
    case ActionTypes.SELECT_EDGE:
      let currentEdgeId = action.payload;

      // deselect if click again
      if (currentEdgeId === previousState.selected.currentEdgeId) {
        return {
          ...previousState,
          selected: {
            ...previousState.selected,
            currentEdgeId: null,
            scalar: null,
          },
        };
      }

      let nodeId = extractTypeId(currentEdgeId);
      return {
        ...previousState,
        selected: {
          ...previousState.selected,
          previousTypesIds: pushHistory(nodeId, previousState),
          currentNodeId: nodeId,
          currentEdgeId,
          scalar: null,
        },
      };
    case ActionTypes.SELECT_PREVIOUS_TYPE:
      return {
        ...previousState,
        selected: {
          ...previousState.selected,
          previousTypesIds: _.initial(previousState.selected.previousTypesIds),
          currentNodeId: _.last(previousState.selected.previousTypesIds),
          currentEdgeId: null,
          scalar: null,
        },
      };
    case ActionTypes.CLEAR_SELECTION:
      return {
        ...previousState,
        selected: initialState.selected,
      };
    case ActionTypes.FOCUS_ELEMENT:
      return {
        ...previousState,
        graphView: {
          ...previousState.graphView,
          focusedId: action.payload,
        },
      };
    case ActionTypes.FOCUS_ELEMENT_DONE:
      if (previousState.graphView.focusedId !== action.payload) return previousState;

      return {
        ...previousState,
        graphView: {
          ...previousState.graphView,
          focusedId: null,
        },
      };
    case ActionTypes.TOGGLE_MENU:
      return {
        ...previousState,
        menuOpened: !previousState.menuOpened,
      };
    case ActionTypes.REPORT_ERROR:
      return {
        ...previousState,
        errorMessage: action.payload,
      };
    case ActionTypes.CLEAR_ERROR:
      return {
        ...previousState,
        errorMessage: initialState.errorMessage,
      };
    case ActionTypes.CHANGE_SELECTED_TYPEINFO:
      return {
        ...previousState,
        selected: {
          ...previousState.selected,
          typeinfo: action.payload,
        },
      };
    case ActionTypes.STORE_NODE_AND_EDGES:
      const edgeIds = previousState.selected.multipleEdgeIds;
      const previousQueryHistory = previousState.selected.queryModeHistory;

      let name;
      // check for args, if it has arguments append '(args)' to the name
      if (grabArgs(action.payload)) {
        name = `${action.payload.name}(args)`;
      } else {
        name = action.payload.name;
      }
      
      let payload;
      // check to see if the node has relay, if so append edges and node to the array
      if (isRelay(action.payload)) {
        payload = [name, "edges", "node"];
      } else {
        payload = [name];
      }

      // Push into queryModeHistory if edges have been selected & ensure previous selection was a node
      if (edgeIds.length > 0 && !Array.isArray(previousQueryHistory[previousQueryHistory.length - 1])) {
        return {
          ...previousState,
          selected: {
            ...previousState.selected,
            // Push selected edgeIds on previous node before pushing new node into the queryModeHistory
            queryModeHistory: [...previousQueryHistory, edgeIds,...payload],
            // Initialize to an empty array when navigating to a new node
            multipleEdgeIds: [] 
          }
        }  
      } else {
        // If no edges were selected in previous node, only push new node to the array
        return {
          ...previousState,
          selected: {
            ...previousState.selected,
            queryModeHistory: [...previousState.selected.queryModeHistory, ...payload]
          }
        }  
      }

    case ActionTypes.STORE_EDGES:
      const previousEdgeIds = previousState.selected.multipleEdgeIds.slice();
      // do not allow duplicates 
      if (!_.includes(previousEdgeIds, action.payload)) {
        return {  
          ...previousState,
          selected: {
            ...previousState.selected, 
            multipleEdgeIds: [...previousEdgeIds, action.payload],
          }
        }
      } else {
        // remove reselected edges
        _.pull(previousEdgeIds, action.payload.name);
        return {  
          ...previousState,
          selected: {
            ...previousState.selected, 
            multipleEdgeIds: [...previousEdgeIds]
          }
        }
      }
    case ActionTypes.STORE_PENDING_EDGES:
      // if user exits out of query mode or hides schema, grab all selected edges and push to queryModeHistory
      const pendingEdgeIds = previousState.selected.multipleEdgeIds;
      if (pendingEdgeIds.length > 0) {
        return {
          ...previousState,
          selected: {
            ...previousState.selected,
            queryModeHistory: [...previousState.selected.queryModeHistory, pendingEdgeIds]
          }
        }
      } else {
        // add an empty array to the query history, indicating to user that fields need to be inputted
        return {
          ...previousState,
          selected: {
            ...previousState.selected,
            queryModeHistory: [...previousState.selected.queryModeHistory, []]
          }
        }
      }
      //TODO clean up,
    case ActionTypes.PREVIOUS_NODE_AND_EDGES:
      // if on query mode, revert back to previous node/edges
      const previousHistory = previousState.selected.queryModeHistory.slice();

      // get the last element of the array
      const lastElement = _.last(previousHistory);

      // check to see if the last element in history is a node
      if (lastElement === 'node') {
        // First check to see if length of array is 3, this will usually indicate start of query mode. 
        if (previousHistory.length === 3) {
          // reset to initial values for query mode
          return {
            ...previousState,
            selected: {
              ...previousState.selected,
              queryModeHistory: [],
              multipleEdgeIds: [],
            }
          }
        }

        // If length is greater than 3, multiple entries performed, then the previous element should contain edges and type.
        // skip those elements and go straight to the element before it
        const elementBeforeEdges = previousHistory[previousHistory.length - 4];

        // check to see if that element is an array of fields, node, or type
        if (Array.isArray(elementBeforeEdges)) {
          // if it is, store that array as your current edgeId's
          // return a slice of queryModeHistory up to the index of that element
          const newQueryHistory = previousHistory.slice(0, previousHistory.length - 4);
          return {
            ...previousState,
            selected: {
              ...previousState.selected,
              queryModeHistory: newQueryHistory,
              multipleEdgeIds: elementBeforeEdges
            }
          }
        } else if (elementBeforeEdges === 'node') {
          // if a node, create a slice of the queryModeHistory retaining up to that node
          const newQueryHistory = previousHistory.slice(0, previousHistory.length - 3);
          return {
            ...previousState,
            selected: {
              ...previousState.selected,
              queryModeHistory: newQueryHistory,
            }
          }
        }

        // Still inside of checking last element as a node, check to see if the element before the edges is not a node
        if (elementBeforeEdges !== 'node') {
          // have to check if the previous element before edges is a node
          const elementBeforeType = previousHistory[previousHistory.length - 5];

          // if an array, store that array as your current edgeId's and update queryHistory
          if (Array.isArray(elementBeforeType)) {
            const newQueryHistory = previousHistory.slice(0, previousHistory.length - 5);
            return {
              ...previousState,
              selected: {
                ...previousState.selected,
                queryModeHistory: newQueryHistory,
                multipleEdgeIds: elementBeforeType
              }
            }
          } else { 
            // this else checks to see if the element before TYPE is a node
            const newQueryHistory = previousHistory.slice(0, previousHistory.length - 3);
            // need to backtrack by removing the node, edges, and type
            // slice of array up to that point should be returned in state
            return {
              ...previousState,
              selected: {
                ...previousState.selected,
                queryModeHistory: newQueryHistory,
              }
            }
          }
        } else { 
          // this else is checking to see if the element before EDGES is a node 
          const newQueryHistory = previousHistory.slice(0, previousHistory.length - 4);
          // need to backtrack by removing the node, edges, and type
          // slice of array up to that point should be returned in state
          return {
            ...previousState,
            selected: {
              ...previousState.selected,
              queryModeHistory: newQueryHistory,
            }
          }
        }
      } else {
      // last element is not a node, should only be a type
      const secondToLastElement = previousHistory[previousHistory.length - 2];
      
      // check second to last element to ensure it's not an array
      if (Array.isArray(secondToLastElement)) {
        // if it is an array, need to store array in multiple edges and update history up to that point
        return {
          ...previousState,
          selected: {
            ...previousState.selected,
            queryModeHistory: [...previousHistory.slice(0, previousHistory.length - 2)],
            multipleEdgeIds: secondToLastElement,
          }
        }
      } else {
        // if the second to last element is not an array, then update history up to that point
        return {
          ...previousState,
          selected: {
            ...previousState.selected,
            queryModeHistory: [...previousHistory.slice(0, previousHistory.length - 1)],
            multipleEdgeIds: []
          }
        }
      }
    }
    default:
      return previousState;
  }
}
