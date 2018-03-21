import * as types from './types';
import { checkResponse } from '../util/httpResultUtils';
import { createTokenHeaders, createLegacyHeaders, getCert } from '../util/portcdmUtils';
import pinch from 'react-native-pinch';

export const selectVessel = (vessel) => {
    return {
        type: types.SELECT_VESSEL,
        payload: vessel,
    };
}

/**Given a URN for a vessel, fetches the vessel information from the backend
 * 
 * @param {string} vesselUrn 
 */
export const fetchVessel = (vesselUrn) => {
    return (dispatch, getState) => {
    
        const connection = getState().settings.connection;
        const token = getState().settings.token;
        const contentType = getState().settings.instance.contentType;
        
        return pinch.fetch(`${connection.scheme + connection.host}:${connection.port}/vr/vessel/${vesselUrn}`,
        {
            method: 'GET',
            headers: !!connection.username ? createLegacyHeaders(connection, contentType) : createTokenHeaders(token, contentType),
            sslPinning: getCert(connection),
        })
        .then(result => {
            if(result.status === 404) {
                dispatch({
                    type: types.SET_ERROR, 
                    payload: {
                        title: 'Vessel not found',
                        description: 'No vessel named ' + vesselName + ' found!',
                    }
                });
                throw new Error('dispatched');
            }

            let err = checkResponse(result);
            if(!err)
                return JSON.parse(result.bodyString);
            
            dispatch({type: types.SET_ERROR, payload: err});
            throw new Error('dispatched');
         })
        .then(vessel => dispatch({type: types.FETCH_VESSEL_SUCCESS, payload: vessel})
        ).catch(err => {
            if(err.message !== 'dispatched') {
                dispatch({type: types.SET_ERROR, payload: {
                    description: err.message, 
                    title: 'Unable to connect to the server!'}});
            }
        });
    }
};

export const fetchVesselFromIMO = (imo) => {
    return (dispatch, getState) => {
        
        return fetch(`http://segot.portcdm.eu:8080/SeaTrafficManagement/vessel-registry/vessel?imo=${imo}`, {
            method: 'GET',
        }).then((result) => {
            if(result.status === 404) {
                dispatch({
                    type: types.SET_ERROR, 
                    payload: {
                        title: 'Vessel not found',
                        description: 'No vessel with imo' + imo + ' found!',
                    }
                });
                throw new Error('dispatched');
            }

            let err = checkResponse(result);
            if(!err)
                return result.json();

            dispatch({type: types.SET_ERROR, payload: err});
            throw new Error('dispatched');
        }).then((json) => {
            console.log('Fetched vessel: ' + JSON.stringify(json));
            dispatch({
                type: types.FETCH_VESSEL_SUCCESS,
                payload: {
                    imo: `urn:mrn:stm:vessel:IMO:${json.imo}`,
                    mmsi: `urn:mrn:stm:vessel:MMSI:${json.mmsi}`,
                    name: json.name,
                    vesselType: json.vesselType,
                    callSign: json.callSign,
                    photoURL: json.photoURL,
                    flag: json.flag,
                    builtYear: json.builtYear,
                }
            });
        }).catch((error) => {
            if(error.message !== 'dispatched') {
                dispatch({type: types.SET_ERROR, payload: {
                    description: error.message, 
                    title: 'Unable to connect to the server!'}});
            }
        });
    }
}

export const fetchVesselByName = (vesselName) => {
    return (dispatch, getState) => {
        
        return fetch(`http://segot.portcdm.eu:8080/SeaTrafficManagement/vessel-registry/vessel?name=${vesselName}`, {
            method: 'GET',
        }).then((result) => {
            if(result.status === 404) {
                dispatch({
                    type: types.SET_ERROR, 
                    payload: {
                        title: 'Vessel not found',
                        description: 'No vessel named ' + vesselName + ' found!',
                    }
                });
                throw new Error('dispatched');
            }

            let err = checkResponse(result);
            if(!err)
                return result.json();

            dispatch({type: types.SET_ERROR, payload: err});
            throw new Error('dispatched');
        }).then((json) => {
            dispatch({
                type: types.FETCH_VESSEL_SUCCESS,
                payload: {
                    imo: `urn:mrn:stm:vessel:IMO:${json.imo}`,
                    mmsi: `urn:mrn:stm:vessel:MMSI:${json.mmsi}`,
                    name: json.name,
                    vesselType: json.vesselType,
                    callSign: json.callSign,
                    photoURL: json.photoURL,
                    flag: json.flag,
                    builtYear: json.builtYear,
                }
            });
        }).catch((error) => {
            if(error.message !== 'dispatched') {
                dispatch({type: types.SET_ERROR, payload: {
                    description: error.message, 
                    title: 'Unable to connect to the server!'}});
            }
        });
    }
}

export const appendVesselToPortCall = (portCall) =>  {
    return (dispatch, getState) => {
        const connection = getState().settings.connection;
        const token = getState().settings.token;
        const favorites = getState().favorites;
        const contentType = getState().settings.instance.contentType;
        return pinch.fetch(`${connection.scheme + connection.host}:${connection.port}/vr/vessel/${portCall.vesselId}`,
        {
            method: 'GET',
            headers: !!connection.username ? createLegacyHeaders(connection, contentType) : createTokenHeaders(token, contentType),
            sslPinning: getCert(connection),
        })
        .then(result => {
            let err = checkResponse(result);
            if (!err)
                return JSON.parse(result.bodyString);

            dispatch({ type: types.SET_ERROR, payload: err });
            throw new Error('dispatched');
        })
        .then(vessel => {
            portCall.vessel = vessel;
            portCall.favorite = favorites.portCalls.includes(portCall.portCallId);
            vessel.favorite = favorites.vessels.includes(vessel.imo);
            return portCall;
        });
    }
}
