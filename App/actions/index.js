import * as types from './types';
import portCDM, { reliability } from '../services/backendservices'

export const addFavoriteState = (stateId) => {
  return {
    type: types.ADD_FAVORITE_STATE,
    payload: stateId
  };
};

export const removeFavoriteState = (stateId) => {
  return {
    type: types.REMOVE_FAVORITE_STATE,
    payload: stateId
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

export const selectPortCall = (portCall) => {
    return {
        type: types.SELECT_PORTCALL,
        payload: portCall        
    };
}

export const fetchPortCallOperations = (portCallId) => {
  return (dispatch) => {
    dispatch({type: types.FETCH_PORTCALL_OPERATIONS})
    portCDM.getPortCallOperations(portCallId)
      .then(result => result.json())
      .then(sortOperations)
      .then(filterStatements)
      .then(addLocationsToOperations)
      .then(extractWarnings)
      .then(fetchReliability)
      .then(operations => {
        dispatch({type: types.FETCH_PORTCALL_OPERATIONS_SUCCESS, payload: operations})
      })      
      .catch(error => console.log(error));
  };
}

// HELPER FUNCTIONS

async function fetchReliability(operations) {
    if(operations.length <= 0) return operations;
    await reliability.getPortCallReliability(operations[0].portCallId)
                .then(result => result.json())
                .then(rel => rel.operations.find(operation => operation.operationId == 'PORT_VISIT'))
                .then(portVisit => {
                    if(!portVisit) return operations;
                    let existingPortVisit = operations.find(operation => operation.definitionId === 'PORT_VISIT');
                    existingPortVisit.reliability = Math.floor(portVisit.reliability * 100);
                    portVisit.states.map(state => {
                        // find the state in reported states?
                        existingPortVisit.reportedStates[state.stateId].forEach(statement => {
                            for(let i = 0; i< state.messages.length; i++) {
                                if(statement.messageId == state.messages[i].messageId) {
                                    statement.reliability = Math.floor(state.messages[i].reliability * 100);
                                }
                            }
                        })
                    });
                })
                
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