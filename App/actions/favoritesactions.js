import * as types from './types';

export const addFavoriteLocations = (favoriteLocations) => {
    return {
        type: types.ADD_FAVORITE_LOCATIONS,
        payload: favoriteLocations
    }
    
}

export const toggleFavoritePortCall = (portCallId) => {
    return (dispatch, getState) => {
        if(getState().favorites.portCalls.includes(portCallId)) {
            dispatch({
                type: types.REMOVE_FAVORITE_PORTCALL,
                payload: portCallId,
            });

            return false;
        }

        dispatch({
            type: types.ADD_FAVORITE_PORTCALL,
            payload: portCallId,
        });
        
        return true;
    }
}

export const toggleFavoriteVessel = (imo) => {
    return (dispatch, getState) => {
        if(getState().favorites.vessels.includes(imo)) {
            dispatch({
                type: types.REMOVE_FAVORITE_VESSEL,
                payload: imo,
            });

            return false;
        }
        dispatch({
            type: types.ADD_FAVORITE_VESSEL,
            payload: imo,
        });

        return true;
    }
}
