import { combineReducers } from 'redux';
import portCallReducer from './portcallreducer';
import stateReducer from './statereducer';
import settingsReducer from './settingsreducer';
import sendingReducer from './sendingreducer';
import locationReducer from './locationreducer';
import filterReducer from './filterreducer';
import vesselReducer from './vesselreducer';
import errorReducer from './errorreducer';
import serverReducer from './serverreducer';
import favoritesReducer from './favoritesreducer';

export default combineReducers({
  portCalls: portCallReducer,
  states: stateReducer,
  settings: settingsReducer,
  sending: sendingReducer,
  location: locationReducer,
  filters: filterReducer,
  vessel: vesselReducer,  
  error: errorReducer,
  server: serverReducer,
  favorites: favoritesReducer,
});