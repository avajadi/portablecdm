import * as types from './types';
import portCDM, { reliability } from '../services/backendservices'

function handleErrors(response) {
    console.log("in handle error");
    if(!response.ok) {
        console.log("found an error!");
        throw Error(response);
    }

    console.log("------------response from handleErrors-----------")
    return response;
}

export const filterChangeVesselList = (vesselList) => {
    return {
        type: types.FILTER_CHANGE_VESSEL_LIST,
        payload: vesselList
    };
};

export const filterChangeLimit = (limit) => {
    return {
        type: types.FILTER_CHANGE_LIMIT,
        payload: limit
    };
};

export const filterChangeSortBy = (sortBy) => {
    return {
        type: types.FILTER_CHANGE_SORTBY,
        payload: sortBy
    };
};

export const filterChangeOrder = (order) => {
    return {
        type: types.FILTER_CHANGE_ORDER,
        payload: order
    }
}

export const filterChangeArrivingWithin = (arrivingWithinHours) => {
    return {
        type: types.FILTER_CHANGE_ARRIVING_WITHIN,
        payload: arrivingWithinHours
    };
};

export const filterChangeDepartingWithin = (departingWithinHours) => {
    return {
        type: types.FILTER_CHANGE_DEPARTING_WITHIN,
        payload: departingWithinHours
    }
}

export const filterClearArrivingDepartureTime = () => {
    return {
        type: types.FILTER_CLEAR_TIME
    };
};

export const filterChangeOnlyFuturePortCalls = (show) => {
    return {
        type: types.FILTER_ONLY_FUTURE_PORTCALLS,
        payload: show
    };
};

export const changeHostSetting = (host) => {
    return {
        type: types.SETTINGS_CHANGE_HOST,
        payload: host
    };
};

export const createVesselList = (vesselListName) => {
    return {
        type: types.SETTINGS_ADD_VESSEL_LIST,
        payload: vesselListName
    }
}

export const deleteVesselList = (vesselListName) => {
    return {
        type: types.SETTINGS_REMOVE_VESSEL_LIST,
        payload: vesselListName
    }
}

export const clearVesselResult = () => {
    return {
        type: types.FETCH_VESSEL_CLEAR
    }
}

export const addVesselToList = (vessel, listName) => {
    return {
        type: types.SETTINGS_ADD_VESSEL_TO_LIST,
        payload: {
            vessel: vessel,
            listName: listName
        }
    };
};

export const removeVesselFromList = (vessel, listName) => {
    return {
        type: types.SETTINGS_REMOVE_VESSEL_FROM_LIST,
        payload: {
            vessel: vessel,
            listName: listName
        }
    };
};

export const changePortSetting = (port) => {
    return {
        type: types.SETTINGS_CHANGE_PORT,
        payload: port
    };
};

export const addFavoriteState = (stateId) => {
  return {
    type: types.ADD_FAVORITE_STATE,
    payload: stateId
  };
};

export const replaceFavoriteStates = (stateIds) => {
    return {
        type: types.REPLACE_FAVORITE_STATES,
        payload: stateIds
    }
};

export const removeFavoriteState = (stateId) => {
  return {
    type: types.REMOVE_FAVORITE_STATE,
    payload: stateId
  }
}

export const clearPortCallSelection = () => {
    return {
        type: types.CLEAR_PORTCALL_SELECTION
    }
}

export const clearReportResult = () => {
    return {
        type: types.SEND_PORTCALL_CLEAR_RESULT
    }
}

export const sendPortCall = (pcmAsObject, stateType) => {
    return (dispatch, getState) => {
        const { connection } = getState().settings;
        dispatch({type: types.SEND_PORTCALL});
        portCDM.sendPortCall(pcmAsObject, stateType)
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

export const fetchVessel = (vesselUrn) => {
    return (dispatch, getState) => {
    
        const connection = getState().settings.connection;
        
        return fetch(`${connection.host}:${connection.port}/vr/vessel/${vesselUrn}`,
        {
            headers: {
            'Content-Type': 'application/json',
            'X-PortCDM-UserId': connection.username,
            'X-PortCDM-Password': connection.password,
            'X-PortCDM-APIKey': 'eeee'
            }
        })
        .then(result => result.json())
        .then(vessel => dispatch({type: types.FETCH_VESSEL_SUCCESS, payload: vessel}))
    }
};

function getFilterString(filter, value, count) {
    return count <= 0 ? `?${filter}=${value}` : `&${filter}=${value}`
}

function createFilterString(filters, getState) {
    let filterString = '';
    let count = 0;
    for(filter in filters) {
        if(!filters.hasOwnProperty(filter)) continue;
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
    console.log(filterString);
    return filterString;
}

export const fetchPortCalls = () => {
  return (dispatch, getState) => {
    dispatch({type: types.FETCH_PORTCALLS});

    const connection = getState().settings.connection;
    const filters = getState().filters;
    const filterString = createFilterString(filters, getState);
    return fetch(`${connection.host}:${connection.port}/pcb/port_call${filterString}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-PortCDM-UserId': connection.username,
          'X-PortCDM-Password': connection.password,
          'X-PortCDM-APIKey': 'eeee'
        }
      })
        .then(result => result.json())
        .then(portCalls => applyFilters(portCalls, filters))
        .then(portCalls => Promise.all(portCalls.map(portCall => {
            return fetch(`${connection.host}:${connection.port}/vr/vessel/${portCall.vesselId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-PortCDM-UserId': connection.username,
                    'X-PortCDM-Password': connection.password,
                    'X-PortCDM-APIKey': 'eeee'
                }
            })
            .then(result => result.json())
            .then(vessel => {portCall.vessel = vessel; return portCall})
        })))
        .then(portCalls => {
            dispatch({type: types.FETCH_PORTCALLS_SUCCESS, payload: portCalls})
        })
  };
}

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

export const fetchPortCallStructure = (portCallId) => {
    return (dispatch, getState) => {
        dispatch({type: types.FETCH_PORTCALL_STRUCTURE});

        const connection = getState().settings.connection;
        return fetch(`${connection.host}:${connection.port}/pcb/port_call/${portCallId}/structure`, 
          {
              headers: {
                'X-PortCDM-UserId': connection.username,
                'X-PortCDM-Password': connection.password,
                'X-PortCDM-APIKey': 'eeee'        
              }
          }
        )
        .then(result => result.json())
        .then(structure => dispatch({type: types.FETCH_PORTCALL_STRUCTURE_SUCCESS, payload: structure}))
    }
}

export const fetchLocations = (locationType) => {
    return (dispatch, getState) => {
        dispatch({type: types.FETCH_LOCATIONS});
        const connection = getState().settings.connection;
        fetch(`${connection.host}:${connection.port}/location-registry/locations`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-PortCDM-UserId': connection.username,
                    'X-PortCDM-Password': connection.password,
                    'X-PortCDM-APIKey': 'eeee'
                }
            })
            .then(result => result.json())
            .then(locations => {
                dispatch({type: types.FETCH_LOCATIONS_SUCCESS, payload: locations});
            })
    }
}

export const selectPortCall = (portCall) => {
    return {
        type: types.SELECT_PORTCALL,
        payload: portCall        
    };
}
/** Selects location to be either atLocation, fromLocation or toLocation
 *  when sending in a portcall message
 * 
 * @param {string} locationSort 
 *  "atLocation" | "fromLocation" | "toLocation"
 * @param {location data structure} location 
 *  the Location data structure retreived from /location-registry
 */
export const selectLocation = (locationSort, location) => {
    return {
        type: types.SEND_PORTCALL_SELECT_LOCATION,
        payload: {
            locationType: locationSort,
            location: location,
        }
    }
}

export const fetchPortCallOperations = (portCallId) => {
  return (dispatch) => {
    dispatch({type: types.FETCH_PORTCALL_OPERATIONS})
    portCDM.getPortCallOperations(portCallId)
      .then(handleErrors)
      .then(result => result.json())
      .then(sortOperations)
      .then(filterStatements)
      .then(addLocationsToOperations)
      .then(extractWarnings)
    //   .then(fetchReliability)
      .then(operations => {
        dispatch({type: types.FETCH_PORTCALL_OPERATIONS_SUCCESS, payload: operations})
      })      
      .catch(error => console.log("\n-----------------\n" + error + "\n---------------------"));
  };
}

// HELPER FUNCTIONS



async function fetchReliability(operations) {
    if(operations.length <= 0) return operations;
    await reliability.getPortCallReliability(operations[0].portCallId)
                .then(result => result.json())
                // Add the reliability for the entire portcall as 
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

function addLocationsToOperations(operations) {
    return Promise.all(operations.map(async operation => {
        try {
            if(operation.at) {
                operation.atLocation = await portCDM.getLocation(operation.at)
                                            .then(result => result.json());               
            }

            if(operation.from) {
                operation.fromLocation = await portCDM.getLocation(operation.from)
                                                .then(result => result.json());
            }

            if(operation.to) {
                operation.toLocation = await portCDM.getLocation(operation.to)
                                                .then(result => result.json());
            }
        } catch(error) {
            console.log(error);
        }finally {
            return operation;
        }
    }));
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