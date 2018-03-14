import * as types from './types';
import { checkResponse } from '../util/httpResultUtils';
import { createTokenHeaders, createLegacyHeaders, getCert } from '../util/portcdmUtils';
import { Alert } from 'react-native';
import pinch from 'react-native-pinch';
import { appendPortCallIds, updatePortCallIds } from './eventactions';
import colors from '../config/colors';
import { filterChangeArrivingWithin } from './index';

const APPENDING_PORTCALLS_TIMEOUT_MS = 1000;

export const clearPortCallSelection = () => {
    return {
        type: types.CLEAR_PORTCALL_SELECTION
    }
}

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
                    return dispatch(fetchSinglePortCall(id));
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
                    dispatch(fetchSinglePortCall(id))
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

export const fetchSinglePortCall = (portCallId) => (dispatch, getState) => {
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
        .then(portCall => dispatch(fetchVesselForPortCall(portCall)))
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
                return dispatch(fetchVesselForPortCall(portCall));
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

const fetchVesselForPortCall = (portCall) =>  {
    return (dispatch, getState) => {
        const connection = getState().settings.connection;
        const token = getState().settings.token;
        const favorites = getState().favorites;
        const contentType = getState().settings.instance.contentType;
        return pinch.fetch(`${connection.scheme + connection.host}:${connection.port}/vr/vessel/${portCall.vesselId}`,
        {
            method: 'GET',
            headers: !!connection.username ? createLegacyHeaders(connection, contentType) : createTokenHeaders(token, contentType),
            sslPinning: getCert(connection),
        })
        .then(result => {
            let err = checkResponse(result);
            if (!err)
                return JSON.parse(result.bodyString);

            dispatch({ type: types.SET_ERROR, payload: err });
            throw new Error('dispatched');
        })
        .then(vessel => {
            portCall.vessel = vessel;
            portCall.favorite = favorites.portCalls.includes(portCall.portCallId);
            vessel.favorite = favorites.vessels.includes(vessel.imo);
            return portCall;
        });
    }
}

function fetchFavoritePortCalls(dispatch, getState) {
    const connection = getState().settings.connection;
    const token = getState().settings.token;
    const favorites = getState().favorites;
    const contentType = getState().settings.instance.contentType;
    const headers = !!connection.username ? createLegacyHeaders(connection, contentType) : createTokenHeaders(token, contentType);
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
                    return dispatch(fetchVesselForPortCall(portCall));
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
                Promise.all(favoriteVessels.map(favoriteVessel => dispatch(fetchVesselForPortCall(favoriteVessel))
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

/**
 * Fetches all operations for the port call with the specified id
 *
 * @param {string} portCallId
 */
export const fetchPortCallOperations = (portCallId) => {
    return (dispatch, getState) => {
        dispatch({ type: types.FETCH_PORTCALL_OPERATIONS })
        const connection = getState().settings.connection;
        const token = getState().settings.token;
        const getReliability = getState().settings.fetchReliability;
        const contentType = getState().settings.instance.contentType;
        const headers = !!connection.username ? createLegacyHeaders(connection, contentType) : createTokenHeaders(token, contentType);
        console.log('Fetching operations for port call ' + portCallId);
        return pinch.fetch(`${connection.scheme + connection.host}:${connection.port}/pcb/port_call/${portCallId}${getState().settings.instance.portCallEndPoint}`,
            {
                method: 'GET',
                headers: headers,
                sslPinning: getCert(connection),
            }
        )
            .then(result => {
                console.log('Response for operation in port call');
                let err = checkResponse(result);
                if (!err)
                    return JSON.parse(result.bodyString);

                dispatch({ type: types.SET_ERROR, payload: err });
                throw new Error('dispatched');
            })
            // Sort the operations, port_visits first, then earliest arrival start first
            .then(sortOperations)
            .then(filterStatements)
            .then(operations => {
                const locations = getState().location.locations;
                return operations.map(operation => {
                    if (operation.at) {
                        // Actually case sensitive, so keep in mind
                        operation.atLocation = locations.find(location => location.URN.toUpperCase() === operation.at.toUpperCase());
                    }
                    if (operation.from) {
                        operation.fromLocation = locations.find(location => location.URN.toUpperCase() === operation.from.toUpperCase());
                    }
                    if (operation.to) {
                        operation.toLocation = locations.find(location => location.URN.toUpperCase() === operation.to.toUpperCase());
                    }
                    
                    operation.statements.map(statement => {
                        if (statement.at) {
                            // Actually case sensitive, so keep in mind
                            statement.atLocation = locations.find(location => location.URN.toUpperCase() === statement.at.toUpperCase());
                        }
                        if (statement.from) {
                            statement.fromLocation = locations.find(location => location.URN.toUpperCase() === statement.from.toUpperCase());
                        }
                        if (statement.to) {
                            statement.toLocation = locations.find(location => location.URN.toUpperCase() === statement.to.toUpperCase());
                        }
                    });

                    return operation;
                });
            })
            //.then(extractWarnings)
            .then((operations) => {
                if (!getReliability) return operations;

                return fetchReliability(operations, headers, connection, portCallId);
            }
            )
            .then(maybeOperations => {
                if (!!maybeOperations)
                    dispatch({ type: types.FETCH_PORTCALL_OPERATIONS_SUCCESS, payload: maybeOperations })
                else if (getReliability)
                    dispatch({ type: types.SET_ERROR, payload: { title: "RELIABILITY_FAIL" } });
            })
            .catch(err => {
                if (err.message !== 'dispatched') {
                    dispatch({
                        type: types.SET_ERROR, payload: {
                            description: err.message,
                            title: 'Unable to connect to the server!'
                        }
                    });
                }
            });
    };
};

// HELPER FUNCTIONS
async function fetchReliability(operations, headers, connection, portCallId) {
    if (operations.length <= 0) return operations;
    await pinch.fetch(`${connection.scheme + connection.host}:${connection.port}/dqa/reliability/${portCallId}`,
        {
            method: 'GET',
            headers: headers,
            sslPinning: getCert(connection),
        }
    )
        .then(result => {
            console.log('Fetching reliabilities.... ' + result.status);
            if (result.status !== 200) {
                return null;
            }
            else return JSON.parse(result.bodyString);
        })
        // Add the reliability for the entire portcall as member of the array
        .then(result => {
            operations.reliability = Math.floor(result.reliability * 100);

            return result;
        })
        // For every operation in the result
        .then(result => result.operations.map(resultOperation => {
            // We need to find the operation in our own data structure and set it's reliability
            let ourOperation = operations.find(operation => operation.eventId === resultOperation.eventId);
            ourOperation.reliability = Math.floor(resultOperation.reliability * 100);
            // Then for each state in the operation
            resultOperation.states.map(resultState => {
                // We want the onProbability data
                ourOperation.reportedStates[resultState.stateId].onTimeProbability = {
                    probability: Math.floor(resultState.onTimeProbability.probability * 100),
                    reason: resultState.onTimeProbability.reason,
                    accuracy: Math.floor(resultState.onTimeProbability.accuracy * 100)
                }

                // Go through all statements we have stored in our data, and add reliability and reliability changes to the structure.
                ourOperation.reportedStates[resultState.stateId].forEach(ourStatement => {
                    for (let i = 0; i < resultState.messages.length; i++) {
                        if (ourStatement.messageId == resultState.messages[i].messageId) {
                            // We want the reliability for this statement
                            ourStatement.reliability = Math.floor(resultState.messages[i].reliability * 100);
                            // And also all the changes for the statement.
                            ourStatement.reliabilityChanges = resultState.messages[i].reliabilityChanges;
                        }
                    }
                })
            });
        })).catch(err => {
            console.log('Unable to fetch reliabilities.');
            console.log("Error: " + err);
            operations = false;
        });;
    return operations;
}

function filterStatements(operations) {
    return Promise.all(operations.map(operation => {
        let reportedStates = {};

        operation.statements.forEach(statement => {
            let stateDef = statement.stateDefinition;
            if (!reportedStates[stateDef]) {
                reportedStates[stateDef] = [statement];
            } else {
                reportedStates[stateDef].push(statement);
            }
        });

        operation.reportedStates = reportedStates;
        return operation;
    }));
}

function sortOperations(operations) {
    return operations.sort((a, b) => {
        // Port visit should be on top!
        if (a.definitionId === 'PORT_VISIT') return -1;
        if (b.definitionId === 'PORT_VISIT') return 1;

        let aTime = new Date(a.startTime);
        let bTime = new Date(b.startTime);

        if (aTime < bTime) return -1;
        if (aTime > bTime) return 1;
        else return 0;
    });
}

/**
 * Removes warnings from the operation level, and instead assigns it to
 * the reportedState it warns about. Only thing left should be warnings
 * that aren't about a certain state.
 *
 * @param {[Operation]} operations
 *
 * @return
 *  all operations, with warnings that is connected to a certain state
 */
function extractWarnings(operations) {
    // Go through all operations
    return operations.map(operation => {
        let { warnings, reportedStates } = operation;
        // And for each warning in each operation
        for (let i = 0; i < warnings.length; i++) {
            let found = false;
            warning = warnings[i];
            // See if any warning contains the id of any reported state
            for (let state in reportedStates) {
                let index = warning.message.indexOf(state);
                // If it does, add it to the warnings of the reportedState instead
                if (index >= 0) {
                    if (!operation.reportedStates[state].warnings) {
                        operation.reportedStates[state].warnings = [warning];
                    } else {
                        operation.reportedStates[state].warnings.push(warning);
                    }

                    found = true;
                }
            }
            if (found) {
                warnings[i] = null;
            }
        }
        // And remove the warnings that was connected to a state
        operation.warnings = warnings.filter(warning => !!warning);

        return operation;
    });
}
