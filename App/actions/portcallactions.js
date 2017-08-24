import * as types from './types';
import { checkResponse } from '../util/httpResultUtils';
import { createLegacyHeaders, createTokenHeaders } from '../util/portcdmUtils';
import {Alert} from 'react-native';

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
        
        return fetch(`${connection.host}:${connection.port}/vr/vessel/${vesselUrn}`,
        {
            headers: createLegacyHeaders(connection)
        })
        .then(result => {
            if(checkResponse(result))
             return result.json();
            else return null;
         })
        .then(vessel => dispatch({type: types.FETCH_VESSEL_SUCCESS, payload: vessel}))
    }
};

/**
 * fetches all portcalls matching the filter criteries defined in the filterReducer
 */
export const fetchPortCalls = () => {
  return (dispatch, getState) => {
    dispatch({type: types.FETCH_PORTCALLS});
    const connection = getState().settings.connection;
    const token = getState().settings.token;
    console.log('TOKEN***************: ' + token.accessToken);
    const filters = getState().filters;
    const filterString = createFilterString(filters, getState);
    return fetch(`${connection.host}:${connection.port}/pcb/port_call${filterString}`,
      {
        headers: createLegacyHeaders(connection)
      })
        .then(result => {
           if(checkResponse(result))
            return result.json();
           else return null;
        })
        .then(portCalls => applyFilters(portCalls, filters))
        .then(portCalls => Promise.all(portCalls.map(portCall => {
            return fetch(`${connection.host}:${connection.port}/vr/vessel/${portCall.vesselId}`,
            {
                //headers: createLegacyHeaders(connection)
            })
            .then(result => result.json())
            .then(vessel => {portCall.vessel = vessel; return portCall})
        })))
        .then(portCalls => {
            dispatch({type: types.FETCH_PORTCALLS_SUCCESS, payload: portCalls})
        })
  };
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
    const getReliability = getState().settings.fetchReliability;
    return fetch(`${connection.host}:${connection.port}/pcb/port_call/${portCallId}/operations`,
        {
            headers: createLegacyHeaders(connection)
        }
    )
    .then(result => result.json())
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
            
            return fetchReliability(operations, connection, portCallId)
        }
    )
    .then(operations => {
    dispatch({type: types.FETCH_PORTCALL_OPERATIONS_SUCCESS, payload: operations})
    })      
    .catch(error => console.log("\n-----------------\n" + error + "\n---------------------"));
  };
};

// HELPER FUNCTIONS
async function fetchReliability(operations, connection, portCallId) {
    if(operations.length <= 0) return operations;
    await fetch(`${connection.host}:${connection.port}/dqa/reliability/${portCallId}`, 
        {
            headers: createLegacyHeaders(connection)
        }
    )
    .then(result => {
        console.log('Fetching reliabilities.... ' + result);

       if(result.status !== 200) {
           Alert.alert(
               'Error',
               'Unable to fetch reliabilities. Please uncheck "Fetch reliabilities" in Settings.'
           );
           return null;
       }
       else return result.json();
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
        }));                
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