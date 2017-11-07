import * as types from './types';   

export const changeFetchReliability = (fetchReliability) => {
    return {
        type: types.SETTINGS_CHANGE_FETCH_RELIABILITY,
        payload: fetchReliability
    }
}

export const changeUser = (username, password) => {
    return {
        type: types.SETTINGS_CHANGE_USER,
        payload: {
            username: username,
            password: password
        }
    }
};

export const changePortUnlocode = (unlocode) => {
    return {
        type: types.SETTINGS_CHANGE_PORT_UNLOCODE,
        payload: unlocode
    }
}

export const changeHostSetting = (host) => {
    return (dispatch, getState) => {
        dispatch({
            type: types.SETTINGS_CHANGE_HOST,
            payload: host
        });

        // Need to clear all cached port calls since they are unique to ports
        dispatch({
            type: types.CACHE_CLEAR,
        });
    }
};

export const createVesselList = (vesselListName) => {
    return {
        type: types.SETTINGS_ADD_VESSEL_LIST,
        payload: vesselListName
    }
}

export const deleteVesselList = (vesselListName) => {
    return {
        type: types.SETTINGS_REMOVE_VESSEL_LIST,
        payload: vesselListName
    }
}

export const clearVesselResult = () => {
    return {
        type: types.FETCH_VESSEL_CLEAR
    }
}

export const addVesselToList = (vessel, listName) => {
    return {
        type: types.SETTINGS_ADD_VESSEL_TO_LIST,
        payload: {
            vessel: vessel,
            listName: listName
        }
    };
};

export const removeVesselFromList = (vessel, listName) => {
    return {
        type: types.SETTINGS_REMOVE_VESSEL_FROM_LIST,
        payload: {
            vessel: vessel,
            listName: listName
        }
    };
};

export const changePortSetting = (port) => {
    return {
        type: types.SETTINGS_CHANGE_PORT,
        payload: port
    };
};