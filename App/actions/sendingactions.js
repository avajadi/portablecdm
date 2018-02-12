import * as types from './types';
import pinch from 'react-native-pinch';

import {objectToXml} from '../util/xmlUtils';
import {createLegacyHeaders, createTokenHeaders, getCert} from '../util/portcdmUtils';


export const clearReportResult = () => {
    return {
        type: types.SEND_PORTCALL_CLEAR_RESULT
    }
}

export const sendPortCall = (pcmAsObject, stateType) => {
    return (dispatch, getState) => {
        const { connection, token } = getState().settings;
        dispatch({type: types.SEND_PORTCALL});
        
        return pinch.fetch(`${connection.host}:${connection.port}/amss/state_update/`, {
            method: 'POST',
            headers: {
              ...(!!connection.username ? createLegacyHeaders(connection) : createTokenHeaders(token, connection.host)), 
              'Content-Type' : 'application/xml'},
            body: objectToXml(pcmAsObject, stateType),
            sslPinning: getCert(connection),
        })
        .then(result => {
            console.log(JSON.stringify(result));
            if(result.status === 200 || result.status === 202) return result;

            let error = result.bodyString;              
            throw new Error(error);
        })
        .then(result => {
            dispatch({type: types.SEND_PORTCALL_SUCCESS, payload: result})
        })
        .catch(error => {
            dispatch({type: types.SEND_PORTCALL_FAILURE, payload: error.message})
        })
    }
}

export const initPortCall = (pcmAsObject, stateType) => {
    return (dispatch, getState) => {
        const { connection, token } = getState().settings;
        dispatch({type: types.SEND_PORTCALL});

        return pinch.fetch(`${connection.host}:${connection.port}/pcr/port_call/`, {
            method: 'POST',
            headers: {
              ...(!!connection.username ? createLegacyHeaders(connection) : createTokenHeaders(token, connection.host)), 
              'Content-Type' : 'application/json'},
            body: createInitParams(pcmAsObject.vesselId),
            sslPinning: getCert(connection),
        })
        .then(result => {
            console.log(JSON.stringify(result));
            if(result.status === 200) return JSON.parse(result.bodyString);

            let error = result.bodyString;              
            throw new Error(result.status + ': ' + error);
        })
        .then(result => {
            pcmAsObject.portCallId = result.portCallId;
            return dispatch(sendPortCall(pcmAsObject, stateType));
        })
        .catch(error => {
            dispatch({type: types.SEND_PORTCALL_FAILURE, payload: error.message})
        })
    }
}

function createInitParams(vesselId) {
    return `{"vesselId":"${vesselId}"}`;
}