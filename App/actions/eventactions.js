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

export const updatePortCallIds = (lastUpdated) => {
    return (dispatch, getEvent) => {
        let updatedAfter = '&updated_after=' + new Date(lastUpdated).toISOString();

        return dispatch(fetchPortCallIds(updatedAfter));
    }
}

export const fetchPortCallIds = (filterString) => {
    return (dispatch, getState) => {
        const connection = getState().settings.connection;
        const token = getState().settings.token;
        const { locations } = getState().favorites;
        const { arrivingWithin, departingWithin } = getState().filters;
        const timeParameters = getTimeParameters(arrivingWithin, departingWithin);
        const locationParams = getLocationParameters(locations);
        const url = `${connection.host}:${connection.port}/pcb/event?${timeParameters}${locationParams}${filterString ? filterString : ''}`;

        console.log('Fetching events: ' + url);

        return pinch.fetch(url,
            {
                method: 'GET',
                headers: connection.username ? createLegacyHeaders(connection) : createTokenHeaders(token, connection.host),
                sslPinning: getCert(connection),
            })
            .then(result => {
                let err = checkResponse(result);
                if (!err) {
                    return JSON.parse(result.bodyString);
                }

                dispatch({type: types.SET_ERROR, payload: err});
                throw new Error('dispatched');
            }).then(result => Promise.all(result.map(element => element.portCallId)))
            .then(result => result.filter((elem, index) => result.indexOf(elem) === index))
            .catch(err => {
                if (!err.message != 'dispatched') {
                    dispatch({
                        type: types.SET_ERROR,
                        payload: {
                            description: err.message,
                            title: 'Unable to fetch events for locations!',
                        }
                    });
                }
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
        oneYearAhead.setFullYear(oneYearAhead.getFullYear() + 1);
        toTime += oneYearAhead.toISOString();
    } else {
        let to = new Date();
        to.setHours(to.getHours + departingWithin);
        toTime += to.toISOString();
    }

    return fromTime + '&' + toTime;
}

function getLocationParameters(locations) {
    let parameters = '';

    for (let i = 0, location; location = locations[i]; i++) {
        parameters += `&location=${location}`;
    }

    return parameters;
}