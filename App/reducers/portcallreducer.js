import * as types from '../actions/types';

const INITIAL_STATE = { 
  foundPortCalls: [], 
  portCallsAreLoading: true 
}

export default (state = INITIAL_STATE, action) => {

  switch(action.type) {
    case types.FETCH_PORTCALLS_COMPLETED:
      return { ...state, foundPortCalls: action.payload, portCallsAreLoading: false }
    default:
      return state;
  }
}