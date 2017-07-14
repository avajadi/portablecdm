import * as types from '../actions/types';

const INITIAL_STATE = { 
  foundPortCalls: [],
  selectedPortCall: null,
  vessel: null,
  selectedPortCallOperations: [],
  portCallsAreLoading: false,
  selectedPortCallIsLoading: false,
}

// MÅSTE LISTA UT HUR MAN SKA GÖRA UTAN LOADING BOOLEANSARNA, ATT SÄTTA DOM TILL TRUE NÄR VI INITIERAR EN 

export default (state = INITIAL_STATE, action) => {

  switch(action.type) {
    case types.SELECT_PORTCALL:
      // const vessel = action.payload.vessel;
      let {vessel, ...portCall} = action.payload;
      return { ... state, vessel: vessel, selectedPortCall: portCall }
    case types.FETCH_PORTCALLS:
      return { ... state, portCallsAreLoading: true};
    case types.FETCH_PORTCALLS_SUCCESS:
      return { ...state, foundPortCalls: action.payload, portCallsAreLoading: false };
    case types.FETCH_PORTCALL_OPERATIONS:
      return { ...state, selectedPortCallIsLoading: true};
    case types.FETCH_PORTCALL_OPERATIONS_SUCCESS:
      return { ...state, selectedPortCallOperations: action.payload, selectedPortCallIsLoading: false};
    default:
      return state;
  }
}