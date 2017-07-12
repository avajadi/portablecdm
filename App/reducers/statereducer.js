import { ADD_FAVORITE_STATE, REMOVE_FAVORITE_STATE } from '../actions/types';

const INITIAL_STATE = { 
  stateDefinitions: [], 
  favoriteStates: [] 
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case ADD_FAVORITE_STATE:
      return { ...state, favoriteStates: [...state.favoriteStates, action.payload] }
    case REMOVE_FAVORITE_STATE:
      return { ...state, favoriteStates: state.favoriteStates.filter(elem => action.payload !== elem)}
    default:
      return state;
  }
}