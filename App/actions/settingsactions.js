import * as types from './types';   
import { APP_VERSION } from '../config/version';

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
        
        // Need to clear all cached port calls since they are unique to ports
        // but only if host changed since last time
        if (getState().settings.connection.host !== host) {
            dispatch({
                type: types.CACHE_CLEAR,
            });

            dispatch({
                type: types.SETTINGS_CHANGE_HOST,
                payload: host
            });
        }
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

export const checkNewVersion = () => {
    return (dispatch, getState) => {
        console.log('Current version: ' + APP_VERSION);
        if (getState().settings.appVersion !== APP_VERSION) {
            dispatch({
                type: types.CACHE_CLEAR,
            });
            dispatch({
                type: types.FILTER_CLEAR,
            });
            dispatch({
                type: types.SETTINGS_UPDATE_VERSION,
                payload: APP_VERSION,
            });

            return true;
        }
    }

    return false;
}