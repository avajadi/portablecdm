import { combineReducers } from 'redux';
import portCallReducer from './portcallreducer';
import stateReducer from './statereducer';

export default combineReducers({
  portCalls: portCallReducer,
  states: stateReducer
})