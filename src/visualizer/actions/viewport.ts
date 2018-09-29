export const SELECT_NODE = 'SELECT_NODE';
export function selectNode(id) {
  return {
    type: SELECT_NODE,
    payload: id,
  };
}

export const SELECT_EDGE = 'SELECT_EDGE';
export function selectEdge(id) {
  return {
    type: SELECT_EDGE,
    payload: id,
  };
}

export const SELECT_PREVIOUS_TYPE = 'SELECT_PREVIOUS_TYPE';
export function selectPreviousType() {
  return {
    type: SELECT_PREVIOUS_TYPE,
  };
}

export const CLEAR_SELECTION = 'CLEAR_SELECTION';
export function clearSelection() {
  return {
    type: CLEAR_SELECTION,
  };
}

export const FOCUS_ELEMENT = 'FOCUS_ELEMENT';
export function focusElement(id) {
  return {
    type: FOCUS_ELEMENT,
    payload: id,
  };
}

export const FOCUS_ELEMENT_DONE = 'FOCUS_ELEMENT_DONE';
export function focusElementDone(id) {
  return {
    type: FOCUS_ELEMENT_DONE,
    payload: id,
  };
}

export const STORE_NODE_AND_EDGES = 'STORE_NODE_AND_EDGES';
export function storeNodeAndEdges(field) {
  return {
    type: STORE_NODE_AND_EDGES,
    payload: field,
  };
}

export const STORE_EDGES = 'STORE_EDGES';
export function storeEdges(name) {
  return {
    type: STORE_EDGES,
    payload: name,
  };
}

export const STORE_PENDING_EDGES = 'STORE_PENDING_EDGES';
export function storePendingEdges() {
  return {
    type: STORE_PENDING_EDGES
  };
}

export const PREVIOUS_NODE_AND_EDGES  = 'PREVIOUS_NODE_AND_EDGES';
export function previousNodeAndEdges() {
  return {
    type: PREVIOUS_NODE_AND_EDGES
  };
}
