import * as types from './types';

import {objectToXml} from '../util/xmlUtils';


export const clearReportResult = () => {
    return {
        type: types.SEND_PORTCALL_CLEAR_RESULT
    }
}

export const sendPortCall = (pcmAsObject, stateType) => {
    return (dispatch, getState) => {
        const { connection } = getState().settings;
        dispatch({type: types.SEND_PORTCALL});

        fetch(`${connection.host}:${connection.port}/amss/state_update/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/xml',
                'X-PortCDM-UserId': connection.username,
                'X-PortCDM-Password': connection.password,
                'X-PortCDM-APIKey': 'eeee'
            },
            body: objectToXml(pcmAsObject, stateType)
        })
        .then(result => {
            if(result.ok) return result;

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