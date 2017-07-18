import { combineReducers } from 'redux';
import PortCallReducer from './portcallreducer';
import StateReducer from './statereducer';

export default combineReducers({
  portCalls: PortCallReducer,
  states: StateReducer
})