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
        const { connection } = getState().settings;
        dispatch({type: types.SEND_PORTCALL});

        pinch.fetch(`${connection.host}:${connection.port}/amss/state_update/`, {
            method: 'POST',
            headers: {
              ...(!!connection.username ? createLegacyHeaders(connection) : createTokenHeaders(token)), 
              'Content-Type' : 'application/xml'},
            body: objectToXml(pcmAsObject, stateType),
            sslPinning: getCert(connection),
        })
        .then(result => {
            if(result.status === 200) return result;

            //console.log(JSON.stringify(result));
            let error = result._bodyText;              
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