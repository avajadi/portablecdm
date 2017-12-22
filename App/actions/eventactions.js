import * as types from './types';
import { checkResponse } from '../util/httpResultUtils';
import { createTokenHeaders, createLegacyHeaders, getCert } from '../util/portcdmUtils';
import { noSummary, hasEvents } from '../config/instances';
import pinch from 'react-native-pinch';

export const appendPortCalls = (lastPortCall) => {
    return (dispatch, getState) => {

        dispatch({
            type: types.CACHE_APPENDING_PORTCALLS
        })
        let filters = getState().filters;
        let filterString = '';
        let beforeOrAfter = filters.order === 'DESCENDING' ? 'before' : 'after';
        if (filters.sort_by === 'LAST_UPDATE') {
            filterString = `updated_${beforeOrAfter}=${new Date(lastPortCall.lastUpdated).toISOString()}`;
        } else {
            filterString = `${beforeOrAfter}=${new Date(filters.order === 'DESCENDING' ? lastPortCall.startTime : lastPortCall.endTime).toISOString()}`;
        }

        const portCalls = getState().cache.portCalls;

        return fetchPortCalls(dispatch, getState, filterString).then(() => {
            let toAppend = getState().portCalls.foundPortCalls.filter((x) => !portCalls.some((y) => y.portCallId == x.portCallId));

            console.log('Fetched another ' + toAppend.length + ' port calls while having ' + portCalls.length + ' cached port calls.');

            // Redux will think we're still appending portcalls for awhile, so that we can't spam requests
            setTimeout(() => {
                dispatch({
                    type: types.CACHE_ENABLE_APPENDING_PORTCALLS
                });
            }, APPENDING_PORTCALLS_TIMEOUT_MS);
            
            dispatch({
                type: types.CACHE_PORTCALLS,
                payload: portCalls.concat(toAppend)
            });
        });
    }
}

export const fetchPortCallIds = (filterString) => {
    return (dispatch, getState) => {
        dispatch({ type: types.FETCH_PORTCALLS });

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
    const fromTime = 'from_time=';
    if (arrivingWithin == 0) {
        fromTime += '1970-01-01T00:00:00Z';
    } else {
        let from = new Date();
        from.setHours(from.getHours - arrivingWithin);
        fromTime += from.toISOString();
    }

    const toTime = 'to_time=';
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