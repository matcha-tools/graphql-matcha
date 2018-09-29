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
    case ActionTypes.STORE_NODE:
      const edgeIds = previousState.selected.multipleEdgeIds
      const previousQueryHistory = previousState.selected.queryModeHistory;
      
      // Push into queryModeHistory if edges have been selected & ensure previous selection was a node
      if (edgeIds.length > 0 && !Array.isArray(previousQueryHistory[previousQueryHistory.length - 1])) {
        return {
          ...previousState,
          selected: {
            ...previousState.selected,
            // Push selected edgeIds on previous node before pushing new node into the queryModeHistory
            queryModeHistory: [...previousQueryHistory, edgeIds, action.payload],
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
            queryModeHistory: [...previousState.selected.queryModeHistory, action.payload]
          }
        }  
      }

    case ActionTypes.STORE_EDGES:
      const previousEdgeIds = previousState.selected.multipleEdgeIds.slice();
      // do not allow duplicates 
      if (!_.includes(previousEdgeIds, action.payload.name)) {
        return {  
          ...previousState,
          selected: {
            ...previousState.selected, 
            multipleEdgeIds: [...previousEdgeIds, action.payload.name],
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
        return previousState;
      }
    case ActionTypes.PREVIOUS_NODE_AND_EDGES:
      // if on query mode, revert back to previous node/edges
      const previousHistory = previousState.selected.queryModeHistory.slice();
      // look at the last two elements in the array
      if (previousHistory.length > 1) {
        // get the last two  elements
        const lastElement = previousHistory[previousHistory.length - 1];
        const secondToLastElement = previousHistory[previousHistory.length - 2];

        // check to see if the last Element is an array
        if (Array.isArray(lastElement) && typeof secondToLastElement === 'string') {
          // if so, remove that last element and place it in the edges when updating store
          const removedLastTwoElements = previousState.selected.queryModeHistory.slice(0, previousState.selected.queryModeHistory.length - 3);
          // check
          console.log('checking the newly updated array ', removedLastTwoElements);

          return {
            ...previousState,
            selected: {
              ...previousState.selected,
              queryModeHistory: [...removedLastTwoElements],
              multipleEdgeIds: lastElement,
            }
          }
        }


        return  {
          ...previousState,
          selected: {
            ...previousState.selected,
            queryModeHistory: []
          }
        }

      } else {
        // if the last element is a string it means no edges were selected
        const lastElement = previousHistory[0];
        // ensure that it's a string
        if (typeof lastElement === 'string') {
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
        }
      }
    default:
      return previousState;
  }
}
