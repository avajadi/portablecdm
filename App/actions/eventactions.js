import * as types from './types';
import { checkResponse } from '../util/httpResultUtils';
import { createTokenHeaders, createLegacyHeaders, getCert } from '../util/portcdmUtils';
import { noSummary, hasEvents } from '../config/instances';
import pinch from 'react-native-pinch';

export const appendPortCallIds = (lastPortCall) => {
    return (dispatch, getEvent) => {
        dispatch({ type: types.FETCH_PORTCALLS });

        return dispatch(fetchPortCallIds());
    }
}

export const fetchPortCallIds = (filterString) => {
    return (dispatch, getState) => {
        const connection = getState().settings.connection;
        const token = getState().settings.token;
        const { locations } = getState().favorites;
        const { arrivingWithin, departingWithin } = getState().filters;
        const timeParameters = getTimeParameters(arrivingWithin, departingWithin);

        return pinch.fetch(`${connection.host}:${connection.port}/pcb/event?${timeParameters}${filterString}`,
            {
                method: 'GET',
                headers: connection.username ? createLegacyHeaders(connection) : createTokenHeaders(token, connection.host),
                sslPinning: getCert(connection),
            })
            .then(result => {

            })
    }
}


// Helper functions
function getTimeParameters(arrivingWithin, departingWithin) {
    let fromTime = 'from_time=';
    if (arrivingWithin == 0) {
        fromTime += '1970-01-01T00:00:00Z';
    } else {
        let from = new Date();
        from.setHours(from.getHours - arrivingWithin);
        fromTime += from.toISOString();
    }

    let toTime = 'to_time=';
    if (departingWithin == 0) {
        let oneYearAhead = new Date();
        oneYearAhead.setFullYear(oneYearAhead.getFullYear + 1);
        toTime += oneYearAhead.toISOString;
    } else {
        let to = new Date();
        to.setHours(to.getHours + departingWithin);
        toTime += to.toISOString();
    }

    return fromTime + '&' + toTime;
}