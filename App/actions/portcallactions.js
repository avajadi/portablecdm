import * as types from './types';
import { checkResponse } from '../util/httpResultUtils';
import { createTokenHeaders, createLegacyHeaders, getCert } from '../util/portcdmUtils';
import pinch from 'react-native-pinch';
import { appendPortCallIds, updatePortCallIds } from './eventactions';
import { appendVesselToPortCall } from './vesselactions';

const APPENDING_PORTCALLS_TIMEOUT_MS = 1000;

export const selectPortCall = (portCall) => {
    return {
        type: types.SELECT_PORTCALL,
        payload: portCall
    };
}

export const bufferPortCalls = () => {
    return (dispatch, getState) => {
        const { portCalls } = getState().cache;
        const limit = getState().settings.cacheLimit;

        const beforeFetching = portCalls.length;
        if (portCalls.length < limit && portCalls.length > 0) {
            dispatch(appendPortCalls(portCalls[portCalls.length - 1])).then(() => {
                if (beforeFetching < getState().cache.portCalls.length) {
                    dispatch(bufferPortCalls());
                }
            })
        }
    }
}

export const appendPortCalls = (lastPortCall) => {
    return (dispatch, getState) => {

        dispatch({
            type: types.CACHE_APPENDING_PORTCALLS
        })

        const cache = getState().cache.portCalls;

        if (getState().favorites.locations.length > 0) {
            return dispatch(appendPortCallIds(lastPortCall)).then(ids => {
                return Promise.all(ids.map(id => {
                    return dispatch(fetchPortCall(id));
                })).then(portCalls => 
                    dispatch(appendFetchedPortCalls(cache, portCalls)));
            });
        }

        let filters = getState().filters;
        let filterString = '';
        let beforeOrAfter = filters.order === 'DESCENDING' ? 'before' : 'after';
        if (filters.sort_by === 'LAST_UPDATE') {
            filterString = `updated_${beforeOrAfter}=${new Date(lastPortCall.lastUpdated).toISOString()}`;
        } else {
            filterString = `${beforeOrAfter}=${new Date(filters.order === 'DESCENDING' ? lastPortCall.startTime : lastPortCall.endTime).toISOString()}`;
        }

        return dispatch(fetchPortCalls(filterString)).then(() => 
            dispatch(appendFetchedPortCalls(cache, getState().portCalls.foundPortCalls)));
    }
}

const appendFetchedPortCalls = (cached, newPortCalls) => {
    return (dispatch, getState) => {
        let toAppend = newPortCalls.filter((x) => !cached.some((y) => y.portCallId == x.portCallId));

        console.log('Fetched another ' + toAppend.length + ' port calls while having ' + cached.length + ' cached port calls.');

        // Redux will think we're still appending portcalls for awhile, so that we can't spam requests
        setTimeout(() => {
            dispatch({
                type: types.CACHE_ENABLE_APPENDING_PORTCALLS
            });
        }, APPENDING_PORTCALLS_TIMEOUT_MS);
        
        dispatch({
            type: types.CACHE_PORTCALLS,
            payload: cached.concat(toAppend)
        });
    }
}

export const updatePortCalls = () => {
    return (dispatch, getState) => {
        const { portCalls: cache, lastUpdated } = getState().cache;

        // Maybe TODO: Instead use after/before when updating on filter Arrival_Date
        let updatedAfter = 'updated_after=' + new Date(lastUpdated).toISOString();

        /* Favorite locations? */
        if (getState().favorites.locations.length > 0) {
            return dispatch(updatePortCallIds(lastUpdated)).then(ids =>
                Promise.all(ids.map(id =>
                    dispatch(fetchPortCall(id))
                )).then(portCalls => 
                    dispatch(updateFetchedPortCalls(cache, portCalls)))
            );
        }

        return dispatch(fetchPortCalls(updatedAfter)).then(() => 
            dispatch(updateFetchedPortCalls(cache, getState().portCalls.foundPortCalls)));
    };
}

const updateFetchedPortCalls = (cache, newPortCalls) => (dispatch, getState) => {
    dispatch({
        type: types.CACHE_UPDATE,
        payload: new Date().getTime(),
    });

    return fetchFavoritePortCalls(dispatch, getState)
        .then(favoritePortCalls => applyFilters(favoritePortCalls, getState().filters))
        .then(favoritePortCalls => {
            newPortCalls = newPortCalls
            .filter(portCall => !favoritePortCalls.some(favorite => favorite.portCallId === portCall.portCallId))
            .concat(favoritePortCalls);
            
            console.log('Only fetched ' + newPortCalls.length + ' while having ' + cache.length + ' cached port calls.');

            let counter = 0;
            for (let i = 0; i < newPortCalls.length; i++) { // This mysteriously didn't work with foreach
                let portCall = newPortCalls[i];
                let toBeReplaced = cache.find((x) => x.portCallId === portCall.portCallId);
                if (!!toBeReplaced) {
                    cache.splice(cache.indexOf(toBeReplaced), 1);
                    counter++;
                }
            }

            console.log('Updated ' + counter + ' port calls.');

            dispatch({
                type: types.CACHE_PORTCALLS,
                payload: getState().filters.order === 'DESCENDING' ? newPortCalls.concat(cache) : cache.concat(newPortCalls),
            });

            dispatch({
                type: types.FETCH_PORTCALLS_SUCCESS
            });
        });
}

export const fetchPortCall = (portCallId) => (dispatch, getState) => {
    dispatch({type: types.FETCH_PORTCALLS});
    const connection = getState().settings.connection;
    const token = getState().settings.token;
    const favorites = getState().favorites;
    const contentType = getState().settings.instance.contentType;

    return pinch.fetch(`${connection.scheme + connection.host}:${connection.port}/pcb/port_call/${portCallId}`,
        {
            method: 'GET',
            headers: !!connection.username ? createLegacyHeaders(connection, contentType) : createTokenHeaders(token, contentType),
            sslPinning: getCert(connection)
        })
        .then(result => {
            let err = checkResponse(result);
            if(!err) {
                return JSON.parse(result.bodyString);
            }

            // dispatch({type: types.SET_ERROR, payload: err});
            throw new Error('dispatched');

        })
        .then(portCall => dispatch(appendVesselToPortCall(portCall)))
        .then(portCall => {
            dispatch({type: types.FETCH_PORTCALLS_SUCCESS});
            return portCall;
        })
        .catch(err => {
            if (err.message != 'dispatched') {
                dispatch({
                    type: types.SET_ERROR, payload: {
                        description: err.message,
                        title: 'Unable to connect to the server!'
                    }
                });
            }
        });
}

export const fetchPortCalls = (additionalFilterString) => {
    return (dispatch, getState) => {
        dispatch({ type: types.FETCH_PORTCALLS });
        const connection = getState().settings.connection;
        const token = getState().settings.token;
        const filters = getState().filters;
        const filterString = createFilterString(filters, getState) + (!!filters ? '&' : '?') + additionalFilterString;
        const favorites = getState().favorites;
        const contentType = getState().settings.instance.contentType;
        const headers = !!connection.username ? createLegacyHeaders(connection, contentType) : createTokenHeaders(token, contentType);
        return pinch.fetch(`${connection.scheme + connection.host}:${connection.port}/pcb/port_call${filterString}`,{
                method: 'GET',
                headers,
                sslPinning: getCert(connection),
            })
            .then(result => {
                let err = checkResponse(result);
                if (!err)
                    return JSON.parse(result.bodyString);

                dispatch({ type: types.SET_ERROR, payload: err });
                throw new Error('dispatched');
            }).then(portCalls => applyFilters(portCalls, filters))
            .then(portCalls => Promise.all(portCalls.map(portCall => {
                return dispatch(appendVesselToPortCall(portCall));
            })))
            .then(portCalls => {
                dispatch({ type: types.FETCH_PORTCALLS_SUCCESS, payload: portCalls });
            }).catch(err => {
                if (err.message != 'dispatched') {
                    dispatch({
                        type: types.SET_ERROR, payload: {
                            description: err.message,
                            title: 'Unable to connect to the server!'
                        }
                });
            }
        });    
    }
}

function fetchFavoritePortCalls(dispatch, getState) {
    const connection = getState().settings.connection;
    const token = getState().settings.token;
    const favorites = getState().favorites;
    const contentType = getState().settings.instance.contentType;
    const headers = connection.username ? createLegacyHeaders(connection, contentType) : createTokenHeaders(token, contentType);
    console.log('Fetching favorite port calls...');
    return Promise.all(favorites.portCalls.map(favorite => {
        console.log('Favorite: ' + favorite);
        return pinch.fetch(`${connection.scheme + connection.host}:${connection.port}/pcb/port_call/${favorite}`,
            {
                method: 'GET',
                headers,
                sslPinning: getCert(connection),
            }).then(result => {
                let err = checkResponse(result);
                if (!checkResponse(result))
                    return JSON.parse(result.bodyString);

                return undefined;
            }).then(portCall => {
                if (!!portCall) {
                    return dispatch(appendVesselToPortCall(portCall));
                }
            });
    })).then(favoritePortCalls => {

        if (favoritePortCalls.includes(undefined))
            favoritePortCalls = [];

        let filterString = '';
        for (let i = 0; i < favorites.vessels.length; i++) {
            filterString += `${((i === 0) ? '?' : '&')}vessel=${favorites.vessels[i]}`;
        }

        if (favorites.vessels.length === 0) return favoritePortCalls;

        return pinch.fetch(`${connection.scheme + connection.host}:${connection.port}/pcb/port_call${filterString}`,
            {
                method: 'GET',
                headers,
                sslPinning: getCert(connection),
            })
            .then(result => {
                let err = checkResponse(result);
                if (!err)
                    return JSON.parse(result.bodyString);

                dispatch({ type: types.SET_ERROR, payload: err });
                throw new Error('dispatched');
            }).then(favoriteVessels =>
                Promise.all(favoriteVessels.map(favoriteVessel => dispatch(appendVesselToPortCall(favoriteVessel))
                )).then(favoriteVessels => {
                    return favoriteVessels
                        .filter(favoriteVessel => !favoritePortCalls.some(favoritePortCall => favoritePortCall.portCallId === favoriteVessel.portCallId))
                        .concat(favoritePortCalls);
                }));
    })
        .catch(err => {
            if (err.message != 'dispatched') {
                dispatch({
                    type: types.SET_ERROR, payload: {
                        description: err.message,
                        title: 'Unable to connect to the server!'
                    }
                });
            }
        });

    return [];
}

// Helper functions for fetchPortCalls
function getFilterString(filter, value, count) {
    return count <= 0 ? `?${filter}=${value}` : `&${filter}=${value}`
}

/**
 * Given the filters object from the Redux Store and the getState function, converts all the filters
 * to a actual query string
 *
 * @param {object} filters
 * @param {function} getState
 */
function createFilterString(filters, getState) {
    let filterString = '';
    let count = 0;
    for (filter in filters) {
        if (!filters.hasOwnProperty(filter)) continue;
        // Vessel lists filter are a bunch of &vessel=XX&vessel=XX
        if (filter === 'vesselList') {
            const vesselListStr = filters[filter];
            if (vesselListStr === 'all') {
                continue;
            }
            let vesselList = getState().settings.vesselLists[vesselListStr];
            for (vessel of vesselList) {
                filterString += getFilterString('vessel', vessel.imo);
                count++;
            }
            continue;
        }
        if (filter === 'arrivingWithin') {
            let arrivingFilter = filters[filter];
            if (arrivingFilter === 0) continue;

            let after = new Date(); // from now
            let before = new Date();
            before.setHours(after.getHours() + arrivingFilter); // until arrivingFilter's hours from now
            filterString += getFilterString('after', after.toISOString(), count);
            filterString += getFilterString('before', before.toISOString(), count);

            count++;
            continue;
        }
        if (filter === 'departingWithin') {
            let departingFilter = filters[filter];
            if (departingFilter === 0) continue;

            const nowDate = new Date();

            let after = new Date();
            after.setMonth(nowDate.getMonth() - 1); // Assume portcalls dont last more than a month
            let before = new Date();
            before.setHours(nowDate.getHours() + departingFilter);
            filterString += getFilterString('after', after.toISOString(), count);
            filterString += getFilterString('before', before.toISOString(), count);

            count++;
            continue;
        }

        if (filter === 'onlyFetchActivePortCalls') {
            if (filters.onlyFetchActivePortCalls) {
                let now = new Date();
                filterString += getFilterString('after', now.toISOString(), count);
            }

            count++;
            continue;
        }

        if (filter === 'stages') {
            let stages = filters[filter];
            for (let i = 0, stage; stage = stages[i]; i++) {
                filterString += getFilterString('stage', stage, count);
                count++;
            }
            
            continue;
        }

        filterString += getFilterString(filter, filters[filter], count);
        count++;
    }
    console.log('Filterstring: ' + filterString);
    return filterString;
}

/**
 *
 *
 * @param {[object]} portCalls
 * @param {object} filters
 */
function applyFilters(portCalls, filters) {

    if (filters.onlyFetchActivePortCalls) {
        portCalls = portCalls.filter(portCall => portCall.stage !== 'SAILED');
    }
    //if(filters.arrivingWithin === 0 && filters.departingWithin === 0) return portCalls; // no need to filter

    const nowDate = new Date();

    if (filters.arrivingWithin > 0) {
        const arrivingWithinDate = new Date();
        arrivingWithinDate.setHours(nowDate.getHours() + filters.arrivingWithin);
        portCalls = portCalls.filter(portCall => {
            const startDate = new Date(portCall.startTime);
            if (arrivingWithinDate - startDate >= 0 && startDate - nowDate >= 0) {
                return true;
            } else {
                return false
            }
        })

        return portCalls;
    }

    if (filters.departingWithin > 0) {
        const departingWithinDate = new Date();
        departingWithinDate.setHours(nowDate.getHours() + filters.departingWithin);
        let count = 0;
        portCalls = portCalls.filter(portCall => {
            count++;
            const endDate = new Date(portCall.endTime);
            if (endDate - nowDate >= 0 && departingWithinDate - endDate >= 0) {
                return true;
            } else {
                return false
            }
        });
        return portCalls;
    }

    return portCalls;
}
// end helper functions

