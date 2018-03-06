import pinch from 'react-native-pinch';

import {
    BERTH_SELECT_BERTH,
    BERTH_FETCHING_EVENTS,
    BERTH_FETCHING_EVENTS_FAILURE,
    BERTH_FETCHING_EVENTS_SUCCESS,
    BERTH_CHANGE_INSPECTION_DATE,
    BERTH_CHANGE_LOOKAHEAD_DAYS,
    BERTH_CHANGE_LOOKBEHIND_DAYS,
    BERTH_SET_FILTER_ON_SOURCES,
    SET_ERROR
} from './types';


import { checkResponse } from '../util/httpResultUtils';
import { createTokenHeaders, createLegacyHeaders, getCert } from '../util/portcdmUtils';
import { noSummary, hasEvents } from '../config/instances';

export const setFilterOnSources = (sources) => {
    return { type: BERTH_SET_FILTER_ON_SOURCES, payload: sources.map(source => source.toLowerCase()) }
}

export const selectBerthLocation = (location) => {
    return { type: BERTH_SELECT_BERTH, payload: location };
}

export const changeLookAheadDays = (lookAheadDays) => {
    return { type: BERTH_CHANGE_LOOKAHEAD_DAYS, payload: lookAheadDays };
};

export const changeLookBehindDays = (lookBehindDays) => {
    return { type: BERTH_CHANGE_LOOKBEHIND_DAYS, payload: lookBehindDays };
};

export const selectNewDate = (date) => (dispatch, getState) => {
    dispatch({type: BERTH_CHANGE_INSPECTION_DATE, payload: date});

    return dispatch(fetchEventsForLocation(getState().berths.selectedLocation.URN, date));
}

export const fetchEventsForLocation = (locationURN, time) => (dispatch, getState) => {
    const { connection, token } = getState().settings;

    const { lookBehindDays, lookAheadDays } = getState().berths;
    

    const earliestTime = new Date(time);
    earliestTime.setDate(earliestTime.getDate() - lookBehindDays);
    const latestTime = new Date(time);
    latestTime.setDate(latestTime.getDate() + lookAheadDays);
    const fromTime = earliestTime.toISOString();
    const endTime = latestTime.toISOString();

    const url = `${connection.scheme + connection.host}:${connection.port}/pcb/event?from_time=${fromTime}&to_time=${endTime}&location=${locationURN}&event_definition=VESSEL_AT_BERTH`;
    dispatch({type: BERTH_FETCHING_EVENTS});

    console.log(url);

    return pinch.fetch(url,
        {
            method: 'GET',
            headers: !!connection.username ? createLegacyHeaders(connection, 'application/json') : createTokenHeaders(token, 'application/json'),
            sslPinning: getCert(connection),
        })
        .then(result => {
            let err = checkResponse(result);
            if (!err) {
                return JSON.parse(result.bodyString);
            }
            
            dispatch({type: SET_ERROR, payload: err});
            throw new Error('dispatched');
        })
        .then(events => {
            return Promise.all(events.map(event => dispatch(fetchVessel(event))));
        })
        .then(events => {
            return Promise.all(events.map(event => dispatch(fetchStatements(event))));
        })
        .then(events => {
            // Array of arrays, each inner array holds a row with none-intersected events
            let structure = [];
            const defaultEventLength = 15; // If we have no start/endtime, use 15 minutes length
            structure.earliestTime = earliestTime;
            structure.latestTime = latestTime;                        
            if(events.length > 0) {
                let firstEvent = events.shift();
                setDisplayTime(firstEvent, defaultEventLength);
                structure.push([firstEvent]);
                structure.earliestStartTime = firstEvent.displayStartTime;
                for(let i = 0; i < events.length; i++) {
                    
                    setDisplayTime(events[i], defaultEventLength);

                    const iStartTime = events[i].displayStartTime;
                    const iEndTime = events[i].displayEndTime;

                    let foundSlot = false;

                    for(let j = 0; j < structure.length; j++) {
                        foundSlot = false;
                        for(let k = 0; k < structure[j].length; k++) {

                            let jkEndTime = structure[j][k].displayEndTime;
                            let nextStartTime = structure[j][k+1] ? structure[j][k+1].displayStartTime : null

                            // Can we fit in here?
                            if(iStartTime > jkEndTime && (!nextStartTime || iEndTime < nextStartTime)) {
                                structure[j].splice(k + 1, 0, events[i]);
                                foundSlot = true;
                                break;
                            }
                        }
                        if(foundSlot) break; // no need to look further
                    }

                    if(!foundSlot) {
                        structure.push([events[i]]); // didn't find a slot where we can fit in, add a new row
                    }
                }
            }

            return structure;
        })
        .then(structure => {
            structure.sort((a, b) => b.length - a.length); // Want the rows to be denser at the top
            dispatch({type: BERTH_FETCHING_EVENTS_SUCCESS, payload: structure});
        })
        .catch(err => {
            if (!err.message != 'dispatched') {
                dispatch({
                    type: SET_ERROR,
                    payload: {
                        description: err.message,
                        title: 'Unable to fetch events for location: ' + err.message,
                    }
                });

                dispatch({
                    type: BERTH_FETCHING_EVENTS_FAILURE,
                });
            }
        })
}

const fetchVessel = (event) =>  {
    return (dispatch, getState) => {
        const connection = getState().settings.connection;
        const token = getState().settings.token;
        return pinch.fetch(`${connection.scheme + connection.host}:${connection.port}/vr/vessel/${event.vesselId}`,
        {
            method: 'GET',
            headers: !!connection.username ? createLegacyHeaders(connection, 'application/json') : createTokenHeaders(token, contentType),
            sslPinning: getCert(connection),
        })
        .then(result => {
            let err = checkResponse(result);
            if (!err)
                return JSON.parse(result.bodyString);

            dispatch({ type: SET_ERROR, payload: err });
            throw new Error('dispatched');
        })
        .then(vessel => {
            event.vessel = vessel;
            return event;
        });
    }
}

const fetchStatements = (event) => (dispatch, getState) => {
    const { connection, token } = getState().settings;

    const url = `${connection.scheme + connection.host}:${connection.port}/pcb/event/${event.eventId}`;
    dispatch({type: BERTH_FETCHING_EVENTS});

    // console.log(url);

    return pinch.fetch(url,
        {
            method: 'GET',
            headers: !!connection.username ? createLegacyHeaders(connection, 'application/json') : createTokenHeaders(token, 'application/json'),
            sslPinning: getCert(connection),
        })
        .then(result => {
            let err = checkResponse(result);
            if (!err) {
                return JSON.parse(result.bodyString);
            }

            dispatch({type: SET_ERROR, payload: err});
            throw new Error('dispatched');
        })
        .then(eventDetails => {
            const arrivalStatements = [];
            const departureStatements = [];
            // Assuming there are only arrival_vessel_berth and departure_vessel_berth
            for(let statement of eventDetails.statements) {
                if(statement.stateDefinition.toLowerCase() === 'arrival_vessel_berth') {
                    arrivalStatements.push(statement)
                } else {
                    departureStatements.push(statement);
                }
            }
            
            event.arrivalStatements = arrivalStatements;
            event.departureStatements = departureStatements;
            event.overlappingEvents = eventDetails.overlappingEvents;

            return event;
        })
        .catch(err => {
            console.log('something went wrong in fetchStatements');
            console.log(JSON.stringify(err));
            if (!err.message != 'dispatched') {
                dispatch({
                    type: SET_ERROR,
                    payload: {
                        description: err.message,
                        title: `Unable to fetch event details for event ${event.eventId}`
                    }
                });

                dispatch({
                    type: BERTH_FETCHING_EVENTS_FAILURE,
                });
            }
        });
        
};

// **** Helpers

function setDisplayTime(event, defaultLength) {
    event.defaultedStartTime = false;
    event.defaultedEndTime = false;
    let eventStartTime = new Date(event.startTime);
    let eventEndTime = new Date(event.endTime);

    // Assuming we have either a start time or an end time
    if(eventEndTime - new Date(null) === 0) {
        // We have no end time, default it!
        eventEndTime = new Date(eventStartTime);
        eventEndTime.setMinutes(eventStartTime.getMinutes() + defaultLength);
        event.defaultedEndTime = true;
    }

    if(eventStartTime - new Date(null) === 0) {
        // We have no start time, default it!
        eventStartTime = new Date(eventEndTime);
        eventStartTime.setMinutes(eventEndTime.getMinutes() - defaultLength);
        event.defaultedStartTime = true;
    }

    event.displayStartTime = eventStartTime;
    event.displayEndTime = eventEndTime;
}