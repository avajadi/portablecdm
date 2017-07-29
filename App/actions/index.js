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

export const changeHostSetting = (host) => {
    return {
        type: types.SETTINGS_CHANGE_HOST,
        payload: host
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

export const fetchPortCalls = () => {
  return (dispatch) => {
    dispatch({type: types.FETCH_PORTCALLS});
    portCDM.getPortCalls()
            .then(result => result.json())
            .then(portCalls => Promise.all(portCalls.map(portCall => {
                 return portCDM.getVessel(portCall.vesselId)
                    .then(result => result.json())
                    .then(vessel => {portCall.vessel = vessel; return portCall})
            })))
            .then(portCalls => {
              dispatch({type: types.FETCH_PORTCALLS_SUCCESS, payload: portCalls})
            })
  };
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
                // For every operation in the result
                .then(result => result.operations.map(resultOperation => {
                    // We need to find the operation in our own data structure and set it's reliability
                    let ourOperation = operations.find(operation => operation.operationId === resultOperation.operationId);
                    ourOperation.reliability = Math.floor(resultOperation.reliability * 100);
                    // Then for each state in the operation
                    resultOperation.states.map(resultState => {
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