import { ADD_FAVORITE_STATE, REMOVE_FAVORITE_STATE, REPLACE_FAVORITE_STATES } from '../actions/types';
import { REHYDRATE } from 'redux-persist';
import stateCatalogue from './state_catalogue.json';

const INITIAL_STATE = { 
  stateCatalogue: stateCatalogue,
  favoriteStates: [],
  stateById: function(id) {
    return this.stateCatalogue.find(stateDef => stateDef.StateId === id);
  },
  allowedToReportState: function(role, stateId) {
    return true;
  }
};

// This only works because
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