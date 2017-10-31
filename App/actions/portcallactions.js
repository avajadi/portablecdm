import * as types from './types';
import { checkResponse } from '../util/httpResultUtils';
import { createTokenHeaders, createLegacyHeaders, getCert } from '../util/portcdmUtils';
import {Alert} from 'react-native';
import pinch from 'react-native-pinch';

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

/**Given a URN for a vessel, fetches the vessel information from the backend
 * 
 * @param {string} vesselUrn 
 */
export const fetchVessel = (vesselUrn) => {
    return (dispatch, getState) => {
    
        const connection = getState().settings.connection;
        const token = getState().settings.token;
        
        return pinch.fetch(`${connection.host}:${connection.port}/vr/vessel/${vesselUrn}`,
        {
            method: 'GET',
            headers: !!connection.username ? createLegacyHeaders(connection) : createTokenHeaders(token, connection.host),
            sslPinning: getCert(connection),
        })
        .then(result => {
            if(result.status === 404) {
                dispatch({
                    type: types.SET_ERROR, 
                    payload: {
                        title: 'Vessel not found',
                        description: 'No vessel named ' + vesselName + ' found!',
                    }
                });
                throw new Error('dispatched');
            }

            let err = checkResponse(result);
            if(!err)
                return JSON.parse(result.bodyString);
            
            dispatch({type: types.SET_ERROR, payload: err});
            throw new Error('dispatched');
         })
        .then(vessel => dispatch({type: types.FETCH_VESSEL_SUCCESS, payload: vessel})
        ).catch(err => {
            if(err.message !== 'dispatched') {
                dispatch({type: types.SET_ERROR, payload: {
                    description: err.message, 
                    title: 'Unable to connect to the server!'}});
            }
        });
    }
};

export const fetchVesselByName = (vesselName) => {
    return (dispatch, getState) => {
        
        return fetch(`http://segot.portcdm.eu:8080/SeaTrafficManagement/vessel-registry/vessel?name=${vesselName}`, {
            method: 'GET',
        }).then((result) => {
            if(result.status === 404) {
                dispatch({
                    type: types.SET_ERROR, 
                    payload: {
                        title: 'Vessel not found',
                        description: 'No vessel named ' + vesselName + ' found!',
                    }
                });
                throw new Error('dispatched');
            }

            let err = checkResponse(result);
            if(!err)
                return result.json();

            dispatch({type: types.SET_ERROR, payload: err});
            throw new Error('dispatched');
        }).then((json) => {
            dispatch({
                type: types.FETCH_VESSEL_SUCCESS,
                payload: {
                    imo: `urn:mrn:stm:vessel:IMO:${json.imo}`,
                    mmsi: `urn:mrn:stm:vessel:MMSI:${json.mmsi}`,
                    name: json.name,
                    vesselType: json.vesselType,
                    callSign: json.callSign,
                    photoURL: json.photoURL,
                }
            });
        }).catch((error) => {
            if(error.message !== 'dispatched') {
                dispatch({type: types.SET_ERROR, payload: {
                    description: error.message, 
                    title: 'Unable to connect to the server!'}});
            }
        });
    }
}

export const updatePortCalls = () => {
    return (dispatch, getState) => {
        const cached = getState().cache.portCalls;
    
        return fetchPortCalls(dispatch, getState).then(() => {
            dispatch({
                type: types.FILTER_CHANGE_UPDATED_AFTER,
                payload: new Date().getTime(),
            });
            let newPortCalls = getState().portCalls.foundPortCalls;

            console.log('Only fetched ' + newPortCalls.length + ' while having ' + cached.length + ' cached port calls.');

            let counter = 0;
            for(let i = 0; i < newPortCalls.length; i++) { // This mysteriously didn't work with foreach
                let portCall = newPortCalls[i];
                let toBeReplaced = cached.find((x) => x.portCallId === portCall.portCallId);
                if(!!toBeReplaced) {
                    cached.splice(cached.indexOf(toBeReplaced), 1);
                    counter++;
                }
            }

            console.log('Updated ' + counter + ' port calls.');

            dispatch({
                type: types.CACHE_PORTCALLS,
                payload: newPortCalls.concat(cached),
            });
        });
    };
}

export const fetchPortCalls = (dispatch, getState) => {
    dispatch({type: types.FETCH_PORTCALLS});
    const connection = getState().settings.connection;
    const token = getState().settings.token;
    const filters = getState().filters;
    const filterString = createFilterString(filters, getState);
    console.log('Filterstring: ' + filterString);
    console.log('Fetching port calls....');
    return pinch.fetch(`${connection.host}:${connection.port}/pcb/port_call${filterString}`,
    {
        method: 'GET',
        headers: !!connection.username ? createLegacyHeaders(connection) : createTokenHeaders(token, connection.host),
        sslPinning: getCert(connection),
    })
        .then(result => {
            console.log('Got response from port calls!');
            let err = checkResponse(result);
            if(!err)
                return JSON.parse(result.bodyString);
            
            dispatch({type: types.SET_ERROR, payload: err});
            throw new Error('dispatched');
        }).then(portCalls => applyFilters(portCalls, filters))
        .then(portCalls => Promise.all(portCalls.map(portCall => {
            return pinch.fetch(`${connection.host}:${connection.port}/vr/vessel/${portCall.vesselId}`,
            {
                method: 'GET',
                headers: !!connection.username ? createLegacyHeaders(connection) : createTokenHeaders(token, connection.host),
                sslPinning: getCert(connection),
            })
            .then(result => {
                let err = checkResponse(result);
                if(!err)
                    return JSON.parse(result.bodyString);
                
                dispatch({type: types.SET_ERROR, payload: err});
                throw new Error('dispatched');
            })
            .then(vessel => {
                portCall.vessel = vessel; 
                return portCall;
            })
        })))
        .then(portCalls => {
            dispatch({type: types.FETCH_PORTCALLS_SUCCESS, payload: portCalls});
        }).catch(err => {
            if(err.message != 'dispatched') {
                dispatch({type: types.SET_ERROR, payload: {
                    description: err.message, 
                    title: 'Unable to connect to the server!'}});
            }
        });
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
    for(filter in filters) {
        if(!filters.hasOwnProperty(filter)) continue;
        // Vessel lists filter are a bunch of &vessel=XX&vessel=XX
        if(filter === 'vesselList') {
            const vesselListStr = filters[filter];
            if(vesselListStr === 'all') {
                continue;
            }
            let vesselList = getState().settings.vesselLists[vesselListStr];
            for(vessel of vesselList) {
                filterString += getFilterString('vessel', vessel.imo);
                count++;
            }
            continue;
        }
        if(filter === 'arrivingWithin') {
            let arrivingFilter = filters[filter];
            if(arrivingFilter === 0) continue;

            let after = new Date(); // from now
            let before = new Date();
            before.setHours(after.getHours() + arrivingFilter); // until arrivingFilter's hours from now
            filterString += getFilterString('after', after.toISOString(), count);
            filterString += getFilterString('before', before.toISOString(), count);

            count++;
            continue;
        }
        if(filter === 'departingWithin') {
            let departingFilter = filters[filter];
            if(departingFilter === 0) continue;

            const nowDate = new Date();

            let after = new Date();
            after.setMonth(nowDate.getMonth() - 1); // Assume portcalls dont last more than a month
            let before = new Date();
            before.setHours(nowDate.getHours() + departingFilter);
            
            count++;
            continue;
        }

        if(filter === 'onlyFetchActivePortCalls') {
            if(filters.onlyFetchActivePortCalls) {
                let now = new Date();
                filterString += getFilterString('after', now.toISOString(), count);
            }
            
            count++;
            continue;
        }

        if(filter === 'updatedAfter') {
            let after = new Date(filters[filter]);
            console.log('Time: ' + filters[filter]);
            filterString += getFilterString('updated_after', after.toISOString(), count);
            continue;
        }

        filterString += getFilterString(filter, filters[filter], count);
        count++;
    }
    return filterString;
}

/**
 * 
 * 
 * @param {[object]} portCalls 
 * @param {object} filters 
 */
function applyFilters(portCalls, filters) {
    if(filters.arrivingWithin === 0 && filters.departingWithin === 0) return portCalls; // no need to filter

    const nowDate = new Date();

    if(filters.arrivingWithin > 0) {    
        const arrivingWithinDate = new Date();
        arrivingWithinDate.setHours(nowDate.getHours() + filters.arrivingWithin);
        portCalls = portCalls.filter(portCall => {
            const startDate = new Date(portCall.startTime);
            if(arrivingWithinDate - startDate >= 0 && startDate - nowDate >= 0 ) {
                return true;
            } else {
                return false
            }
        })

        return portCalls;
    }

    if(filters.departingWithin > 0) {
        const departingWithinDate = new Date();
        departingWithinDate.setHours(nowDate.getHours() + filters.departingWithin);
        let count = 0;
        portCalls = portCalls.filter(portCall => {
            count++;
            const endDate = new Date(portCall.endTime);
            if(endDate - nowDate >= 0 && departingWithinDate - endDate >= 0) {
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
    dispatch({type: types.FETCH_PORTCALL_OPERATIONS})
    const connection = getState().settings.connection;
    const token = getState().settings.token;
    const getReliability = getState().settings.fetchReliability;
    const headers = !!connection.username ? createLegacyHeaders(connection) : createTokenHeaders(token, connection.host);
    console.log('Fetching operations for port call ' + portCallId);
    console.log(JSON.stringify(headers));
    return pinch.fetch(`${connection.host}:${connection.port}/pcb/port_call/${portCallId}/${(connection.host.includes('dev') ? 'events' : 'operations')}`, //TODO: Update
        {
            method: 'GET',
            headers: headers,
            sslPinning: getCert(connection),
        }
    )
    .then(result => {
        console.log('Response for operation in port call');
        let err = checkResponse(result);
        console.log(JSON.stringify(result));
        if(!err)
            return JSON.parse(result.bodyString);

        dispatch({type: types.SET_ERROR, payload: err});
        throw new Error('dispatched');
    })
    // Sort the operations, port_visits first, then in 
    .then(sortOperations)
    .then(filterStatements)
    .then(operations => {
        const locations = getState().location.locations;
        return operations.map(operation => {
            if(operation.at) {
                operation.atLocation = locations.find(location => location.URN === operation.at);
            }
            if(operation.from) {
                operation.fromLocation = locations.find(location => location.URN === operation.from);
            }
            if(operation.to) {
                operation.toLocation = locations.find(location => location.URN === operation.to);
            }
            
            return operation;
        });
    })
    .then(extractWarnings)
    .then((operations) => {
            if(!getReliability) return operations;
            
            return fetchReliability(operations, headers, connection, portCallId);
        }
    )
    .then(maybeOperations => {
        if(!!maybeOperations)
            dispatch({type: types.FETCH_PORTCALL_OPERATIONS_SUCCESS, payload: maybeOperations})
        else if(getReliability)
            dispatch({type: types.SET_ERROR, payload: { title: "RELIABILITY_FAIL"}});
    })      
    .catch(err => {
        if(err.message !== 'dispatched') {
            dispatch({type: types.SET_ERROR, payload: {
                description: err.message, 
                title: 'Unable to connect to the server!'}});
        }
    });
  };
};

// HELPER FUNCTIONS
async function fetchReliability(operations, headers, connection, portCallId) {
    if(operations.length <= 0) return operations;
    await pinch.fetch(`${connection.host}:${connection.port}/dqa/reliability/${portCallId}`, 
        {
            method: 'GET',
            headers: headers,
            sslPinning: getCert(connection),
        }
    )
    .then(result => {
        console.log('Fetching reliabilities.... ' + result.status);
        console.log('Result: ');
        console.log(JSON.stringify(result));   
        if(result.status !== 200) {
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
        let ourOperation = operations.find(operation => operation.operationId === resultOperation.operationId);
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
                for(let i = 0; i< resultState.messages.length; i++) {
                    if(ourStatement.messageId == resultState.messages[i].messageId) {
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
            operations = false;
        });;                
    return operations;
}

function filterStatements(operations) {
    return Promise.all(operations.map(operation =>{
        let reportedStates = {};

        operation.statements.forEach(statement => {
            let stateDef = statement.stateDefinition;
            if(!reportedStates[stateDef]) {
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
        if(a.definitionId === 'PORT_VISIT') return -1;
        if(b.definitionId === 'PORT_VISIT') return 1;

        let aTime = new Date(a.startTime);
        let bTime = new Date(b.startTime);

        if(aTime < bTime) return -1;
        if(aTime > bTime) return 1;
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
        for(let i = 0; i < warnings.length; i++){
            let found = false;
            warning = warnings[i];
            // See if any warning contains the id of any reported state
            for(let state in reportedStates) {
                let index = warning.message.indexOf(state);
                // If it does, add it to the warnings of the reportedState instead
                if(index >= 0) {
                    if(!operation.reportedStates[state].warnings) {
                        operation.reportedStates[state].warnings = [warning];
                    } else {
                        operation.reportedStates[state].warnings.push(warning);
                    }

                    found = true;
                }
            }
            if(found) {
                warnings[i] = null;
            }
        }
        // And remove the warnings that was connected to a state
        operation.warnings = warnings.filter(warning => !!warning);

        return operation;
    });
}