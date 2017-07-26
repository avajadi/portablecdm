import { ADD_FAVORITE_STATE, REMOVE_FAVORITE_STATE, REPLACE_FAVORITE_STATES } from '../actions/types';
import { REHYDRATE } from 'redux-persist/constants';
import stateCatalogue from './state_catalogue.json';

const INITIAL_STATE = { 
  stateCatalogue: stateCatalogue,
  favoriteStates: ['CargoOp_Commenced', 'Bunkering_Commenced', 'Arrival_PortArea_Confirmed', 'AnchoringOp_Confirmed'],
  lookup: {},
  stateById: (stateId) => null,
};

let lookup = {};
for(let i=0; i<INITIAL_STATE.stateCatalogue.length; i++) {
  lookup[INITIAL_STATE.stateCatalogue[i].StateId] = INITIAL_STATE.stateCatalogue[i];
}

INITIAL_STATE.lookup = lookup;

INITIAL_STATE.stateById = function(id) {
  return this.lookup[id];
}

INITIAL_STATE.stateById = INITIAL_STATE.stateById.bind(INITIAL_STATE);

const stateReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case ADD_FAVORITE_STATE:
      return { ...state, favoriteStates: [...state.favoriteStates, action.payload] }
    case REMOVE_FAVORITE_STATE:
      return { ...state, favoriteStates: state.favoriteStates.filter(elem => action.payload !== elem)}
    case REPLACE_FAVORITE_STATES:
      return { ...state, favoriteStates: action.payload}
    default:
      return state;
  }
}

export default stateReducer;