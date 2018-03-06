import * as types from './types';   
import { APP_VERSION } from '../config/version';
import pinch from 'react-native-pinch';
import { createTokenHeaders, createLegacyHeaders, getCert } from '../util/portcdmUtils';
import { checkResponse } from '../util/httpResultUtils';
import createInstanceInfo from '../config/instances';

export const changeFetchReliability = (fetchReliability) => {
    return {
        type: types.SETTINGS_CHANGE_FETCH_RELIABILITY,
        payload: fetchReliability
    }
}

export const changeUser = (username, password, remember) => {
    return {
        type: types.SETTINGS_CHANGE_USER,
        payload: {
            username,
            password,
            remember,
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

export const changeScheme = (useSSL) => {
    return (dispatch, getState) => {
        if (useSSL) {
            dispatch({
                type: types.SETTINGS_CHANGE_SCHEME,
                payload: 'https://'
            });
            dispatch({
                type: types.SETTINGS_CHANGE_PORT,
                payload: 8443,
            })
        } else {
            dispatch({
                type: types.SETTINGS_CHANGE_SCHEME,
                payload: 'http://'
            });
            dispatch({
                type: types.SETTINGS_CHANGE_PORT,
                payload: 8080,
            });
        }
    }
}

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

export const fetchInstance = () => {
    return (dispatch, getState) => {
        let connection = getState().settings.connection;
        const token = getState().settings.token;
        console.log('Fetching instance info...');
        console.log(JSON.stringify(connection));
        console.log(`${connection.scheme + connection.host}:${connection.port}/application-info/version`);
        return pinch.fetch(`${connection.scheme + connection.host}:${connection.port}/application-info/version`, {
                method: 'GET',
                headers: !!connection.username ? createLegacyHeaders(connection, 'application/json') : createTokenHeaders(token, 'application/json'),
                sslPinning: getCert(connection),
            })
            .then(result => {
                let err = checkResponse(result);
                if(!err)
                    return JSON.parse(result.bodyString);
                
                dispatch({type: types.SET_ERROR, payload: err});
                throw new Error(types.ERR_DISPATCHED);
            }).then(instanceInfo => 
                dispatchInstanceInfo(instanceInfo, connection.host, dispatch)).catch(err => {
                dispatchInstanceInfo(null, connection.host, dispatch);
                if (err.message !== types.ERR_DISPATCHED) {
                    if (connection.scheme === 'https://') { // Try again without https
                        dispatch(changeScheme(false));
                        dispatch(fetchInstance());
                    } else {
                        dispatch({type: types.SET_ERROR, payload: {
                            title: 'Unable to fetch instance info!', 
                            description: 
                              !err.description ? 'Please check your internet connection.' 
                                                : err.description}});
                    }
                }
            });
    }
}

function dispatchInstanceInfo(instanceInfo, host, dispatch) {
    let generatedInfo = createInstanceInfo(instanceInfo, host);
    console.log('Generated info: ' + JSON.stringify(generatedInfo));
    dispatch({
        type: types.SETTINGS_FETCH_INSTANCE,
        payload: generatedInfo,
    });
}