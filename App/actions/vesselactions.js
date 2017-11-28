import * as types from './types';
import { checkResponse } from '../util/httpResultUtils';
import { createTokenHeaders, createLegacyHeaders, getCert } from '../util/portcdmUtils';
import { noSummary, hasEvents } from '../config/instances';
import {Alert} from 'react-native';
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
        
        return pinch.fetch(`${connection.host}:${connection.port}/vr/vessel/${vesselUrn}`,
        {
            method: 'GET',
            headers: !!connection.username ? createLegacyHeaders(connection) : createTokenHeaders(token, connection.host),
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