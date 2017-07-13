import * as types from '../actions/types';

const INITIAL_STATE = { 
  foundPortCalls: [],
  selectedPortCallOperations: [],
  portCallsAreLoading: true,
  selectedPortCallIsLoading: true,
}

// MÅSTE LISTA UT HUR MAN SKA GÖRA UTAN LOADING BOOLEANSARNA, ATT SÄTTA DOM TILL TRUE NÄR VI INITIERAR EN 

export default (state = INITIAL_STATE, action) => {

  switch(action.type) {
    case types.FETCH_PORTCALLS_COMPLETED:
      return { ...state, foundPortCalls: action.payload, portCallsAreLoading: false };
    case types.FETCH_PORTCALL_OPERATIONS_COMPLETED:
      return { ...state, selectedPortCallOperations: action.payload, selectedPortCallIsLoading: false};
    default:
      return state;
  }
}