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
  queryMode: boolean,
  displayOptions: DisplayOptions;
  selected: {
    previousTypesIds: string[];
    currentNodeId: string | null;
    currentEdgeId: string | null;
    scalar: string | null;
    queryModeHistory: string[]; // added in 
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
  queryMode: false,
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
    queryModeHistory: [], // added in
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

// function pushEdges(currentEdgeId: string, previousState): string[] {

//   // get array of edge id's
//   let previousMultipleEdgeIds = previousState.selected.multipleEdgeIds; 

//   // ensure no duplicates are being passed in
//   if (_.includes(previousMultipleEdgeIds, currentEdgeId)) {
//     // return if duplicate
//     return previousMultipleEdgeIds
//   } else {
//     return [...previousMultipleEdgeIds, currentEdgeId]
//   }
// }

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
    case ActionTypes.QUERY_MODE_ENABLED:
      return {
        ...previousState,
        queryMode: action.payload,
      }  
    case ActionTypes.SELECT_MULTIPLE_EDGES:
      return {
        ...previousState,
        selected: {
          ...previousState.selected,
        }
      }
    case ActionTypes.STORE_NODE:
      // store into queryMode if the edges have values 
      const edgeIds = previousState.selected.multipleEdgeIds
      if (edgeIds.length > 0) {
        return {
          ...previousState,
          selected: {
            ...previousState.selected,
            queryModeHistory: [...previousState.selected.queryModeHistory,  edgeIds, action.payload],
            multipleEdgeIds: [] // reset to empty 
          }
        }  
      } else {
        return {
          ...previousState,
          selected: {
            ...previousState.selected,
            queryModeHistory: [...previousState.selected.queryModeHistory, action.payload]
          }
        }  
      }

    case ActionTypes.STORE_EDGES:
      // get current node id 
      let checkNode = extractTypeId(action.payload.id); 
      let previousNode = previousState.selected.currentNodeId;

      // if we're still on the current node, keep populating the value 
      // might not need this, just reset value during select node 
      if (checkNode === previousNode) {
        // do not allow duplicates 
        if (!_.includes(previousState.selected.multipleEdgeIds, action.payload.name)) {
          return {  
            ...previousState,
            selected: {
              ...previousState.selected, 
              multipleEdgeIds: [...previousState.selected.multipleEdgeIds, action.payload.name],
            }
          }
        }
      } 
    default:
      return previousState;
  }
}
