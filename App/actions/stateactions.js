import * as types from './types';

export const addFavoriteState = (stateId) => {
  return {
    type: types.ADD_FAVORITE_STATE,
    payload: stateId
  };
};

export const replaceFavoriteStates = (stateIds) => {
    return {
        type: types.REPLACE_FAVORITE_STATES,
        payload: stateIds
    }
};

export const removeFavoriteState = (stateId) => {
  return {
    type: types.REMOVE_FAVORITE_STATE,
    payload: stateId
  }
}