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
        const url = `${connection.scheme + connection.host}:${connection.port}/pcb/event?${timeParameters}${locationParams}${filterString ? filterString : ''}`;

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
                throw new Error(types.ERR_DISPATCHED);
            }).then(result => Promise.all(result.map(element => element.portCallId)))
            .then(result => result.filter((elem, index) => result.indexOf(elem) === index))
            .catch(err => {
                if (!err.message != types.ERR_DISPATCHED) {
                    dispatch({
                        type: types.SET_ERROR,
                        payload: {
                            description: err.message,
                            title: 'Unable to fetch events for locations!',
                        }
                    });

                    dispatch({
                        type: types.ADD_FAVORITE_LOCATIONS,
                        payload: []
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
        from.setHours(from.getHours() - arrivingWithin);
        fromTime += from.toISOString();
    }

    let toTime = 'to_time=';
    if (departingWithin == 0) {
        let oneYearAhead = new Date();
        oneYearAhead.setFullYear(oneYearAhead.getFullYear() + 1);
        toTime += oneYearAhead.toISOString();
    } else {
        let to = new Date();
        to.setHours(to.getHours() + departingWithin);
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

/**
 * Fetches all operations for the port call with the specified id
 *
 * @param {string} portCallId
 */
export const fetchPortCallEvents = (portCallId) => {
    return (dispatch, getState) => {

        dispatch({ type: types.FETCH_PORTCALL_OPERATIONS });

        const connection = getState().settings.connection;
        const token = getState().settings.token;
        const contentType = getState().settings.instance.contentType;
        const headers = connection.username ? createLegacyHeaders(connection, contentType) : createTokenHeaders(token, contentType);

        console.log('Fetching events for port call ' + portCallId);

        return pinch.fetch(`${connection.scheme + connection.host}:${connection.port}/pcb/port_call/${portCallId}${getState().settings.instance.portCallEndPoint}`, {
                method: 'GET',
                headers,
                sslPinning: getCert(connection),
            }).then(result => {
                console.log('Response for operation in port call');
                let err = checkResponse(result);
                if (!err)
                    return JSON.parse(result.bodyString);

                dispatch({ type: types.SET_ERROR, payload: err });
                throw new Error(types.ERR_DISPATCHED);
            })
            // Sort the operations, port_visits first, then earliest arrival start first
            .then(sortOperations)
            .then(filterStatements)
            .then(operations => extendLocations(operations, getState().location.locations))
            .then((operations) => {
                if (!getState().settings.fetchReliability) {
                    return operations;
                } 

                return fetchReliability(operations, headers, connection, portCallId);
            })
            .then(maybeOperations => {
                if (maybeOperations) {
                    dispatch({ type: types.FETCH_PORTCALL_OPERATIONS_SUCCESS, payload: maybeOperations })
                }
                else if (getState().settings.fetchReliability) {
                    dispatch({ type: types.SET_ERROR, payload: { title: "RELIABILITY_FAIL" } });
                }
            })
            .catch(err => {
                if (err.message !== types.ERR_DISPATCHED) {
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
    if (operations.length <= 0) {
        return operations;
    } 

    await pinch.fetch(`${connection.scheme + connection.host}:${connection.port}/dqa/reliability/${portCallId}`,
        {
            method: 'GET',
            headers: headers,
            sslPinning: getCert(connection),
        })
        .then(result => {
            console.log('Fetching reliabilities.... ' + result.status);
            if (result.status !== 200) {
                throw new Error(types.ERR_DISPATCHED);
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

function extendLocations(operations, locations) {
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
}

