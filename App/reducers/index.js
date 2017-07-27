import { combineReducers } from 'redux';
import portCallReducer from './portcallreducer';
import stateReducer from './statereducer';
import settingsReducer from './settingsreducer';

export default combineReducers({
  portCalls: portCallReducer,
  states: stateReducer,
  settings: settingsReducer,
})