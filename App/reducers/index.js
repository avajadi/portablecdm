//import { combineReducers } from 'redux';
import { persistCombineReducers } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import portCallReducer from './portcallreducer';
import stateReducer from './statereducer';
import settingsReducer from './settingsreducer';
import sendingReducer from './sendingreducer';
import locationReducer from './locationreducer';
import filterReducer from './filterreducer';
import vesselReducer from './vesselreducer';
import errorReducer from './errorreducer';
import favoritesReducer from './favoritesreducer';
import cacheReducer from './cachereducer';
import berthReduder from './berthreducer';

export default persistCombineReducers(
  { 
    key: 'primary', 
    whitelist: ['states', 'settings', 'filters', 'favorites', 'cache'], 
    storage: AsyncStorage
  }, {
  portCalls: portCallReducer,
  states: stateReducer,
  settings: settingsReducer,
  sending: sendingReducer,
  location: locationReducer,
  filters: filterReducer,
  vessel: vesselReducer,  
  error: errorReducer,
  favorites: favoritesReducer,
  cache: cacheReducer,
  berths: berthReduder
});