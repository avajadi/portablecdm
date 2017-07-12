import * as types from './types';
import portCDM from '../services/backendservices'

export const addFavoriteState = (stateId) => {
  return {
    type: types.ADD_FAVORITE_STATE,
    payload: stateId
  };
};

export const removeFavoriteState = (stateId) => {
  return {
    type: types.REMOVE_FAVORITE_STATE,
    payload: stateId
  }
}

export const fetchPortCalls = () => {
  return (dispatch) => {
    portCDM.getPortCalls()
            .then(result => result.json())
            .then(portCalls => Promise.all(portCalls.map(portCall => {
                 return portCDM.getVessel(portCall.vesselId)
                    .then(result => result.json())
                    .then(vessel => {portCall.vessel = vessel; return portCall})
            })))
            .then(portCalls => {
              dispatch({type: types.FETCH_PORTCALLS_COMPLETED, payload: portCalls})
            })
  };
}