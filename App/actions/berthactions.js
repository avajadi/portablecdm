import pinch from 'react-native-pinch';

import {
    BERTH_SELECT_BERTH,
    BERTH_FETCHING_EVENTS,
    BERTH_FETCHING_EVENTS_FAILURE,
    BERTH_FETCHING_EVENTS_SUCCESS,
    SET_ERROR
} from './types';


import { checkResponse } from '../util/httpResultUtils';
import { createTokenHeaders, createLegacyHeaders, getCert } from '../util/portcdmUtils';
import { noSummary, hasEvents } from '../config/instances';

export const selectBerthLocation = (location) => {
    return {type: BERTH_SELECT_BERTH, payload: location}
}

export const fetchEventsForLocation = (locationURN, time) => (dispatch, getState) => {
    const { connection, token } = getState().settings;

    const lookBehindDays = 7;
    const lookAheadDays = 14;

    const earliestTime = new Date(time);
    earliestTime.setDate(earliestTime.getDate() - lookBehindDays);
    const latestTime = new Date(time);
    latestTime.setDate(latestTime.getDate() + lookAheadDays);
    const fromTime = earliestTime.toISOString();
    const endTime = latestTime.toISOString();

    const url = `${connection.host}:${connection.port}/pcb/event?from_time=${fromTime}&to_time=${endTime}&location=${locationURN}`;
    
    dispatch({type: BERTH_FETCHING_EVENTS});

    return pinch.fetch(url,
        {
            method: 'GET',
            headers: connection.username ? createLegacyHeaders(connection) : createTokenHeaders(token, connection.host),
            sslPinning: getCert(connection),
        })
        .then(result => {
            // console.log(JSON.stringify(result));
            let err = checkResponse(result);
            if (!err) {
                return JSON.parse(result.bodyString);
            }
            
            dispatch({type: SET_ERROR, payload: err});
            throw new Error('dispatched');
        })
        .then(events => {
            let structure = [];
            const defaultEventLength = 15;
                        
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

                            if(iStartTime > jkEndTime && (!nextStartTime || iEndTime < nextStartTime)) {
                                structure[j].splice(k + 1, 0, events[i]);
                                foundSlot = true;
                                break;
                            }
                        }
                        if(foundSlot) break;
                    }

                    if(!foundSlot) {
                        structure.push([events[i]]);
                    }
                }
            }

            return structure;
        })
        .then(structure => {
            structure.sort((a, b) => b.length - a.length);
            // console.log(JSON.stringify(structure));
            dispatch({type: BERTH_FETCHING_EVENTS_SUCCESS, payload: structure});
        })
        .catch(err => {
            if (!err.message != 'dispatched') {
                dispatch({
                    type: SET_ERROR,
                    payload: {
                        description: err.message,
                        title: 'Unable to fetch events for location!',
                    }
                });

                dispatch({
                    type: BERTH_FETCHING_EVENTS_FAILURE,
                });
            }
        })
}

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