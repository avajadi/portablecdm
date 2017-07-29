import { combineReducers } from 'redux';
import portCallReducer from './portcallreducer';
import stateReducer from './statereducer';
import settingsReducer from './settingsreducer';
import sendingReducer from './sendingreducer';
import locationReducer from './locationreducer';

export default combineReducers({
  portCalls: portCallReducer,
  states: stateReducer,
  settings: settingsReducer,
  sending: sendingReducer,
  location: locationReducer
})