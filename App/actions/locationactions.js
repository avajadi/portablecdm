import * as types from './types';
import { checkResponse, } from '../util/httpResultUtils';
import { createTokenHeaders, createLegacyHeaders, getCert } from '../util/portcdmUtils';
import pinch from 'react-native-pinch';

export const fetchLocations = (locationType) => {
    return (dispatch, getState) => {
        dispatch({type: types.FETCH_LOCATIONS});
        let connection = getState().settings.connection;
        //console.log('Connection: ' + JSON.stringify(connection));
        const token = getState().settings.token;
        const contentType = getState().settings.instance.contentType;
        console.log('Requesting locations...');
        return pinch.fetch(`${connection.scheme + connection.host}:${connection.port}/location-registry/locations`,
            {
                method: 'GET',
                headers: !!connection.username ? createLegacyHeaders(connection, contentType) : createTokenHeaders(token, contentType),
                sslPinning: getCert(connection),
            })
            .then(result => {
                let err = checkResponse(result);
                if(!err)
                    return JSON.parse(result.bodyString);
                
                dispatch({type: types.SET_ERROR, payload: err});
                console.log('Response from locations: ');
                console.log(JSON.stringify(result));
            
                throw new Error(types.ERR_DISPATCHED);
            })
            .then(locations => {
                // Need to add locations for logical locations
                ['ANCHORING_AREA', 
                    'BERTH', 
                    'ETUG_ZONE', 
                    'LOC', 
                    'PILOT_BOARDING_AREA', 
                    'RENDEZV_AREA', 
                    'TRAFFIC_AREA', 
                    'VTS_AREA', 
                    'TUG_ZONE', 
                    'VESSEL', 
                    'PORT', 
                    'HOME_BASE', 
                    'BOUY'
                ].forEach(locationType => {
                    const name = locationType.replace(/_/g, ' ');
                    locations.push(createLocation(connection.unlocode, locationType, name, name ))
                })
                return locations;
            })
            .then(locations => {
                dispatch({type: types.FETCH_LOCATIONS_SUCCESS, payload: locations});
            }).catch(err => {
                console.log('********LOCATION FETCH ERROR********');
                console.log(JSON.stringify(err));
                if (err.message !== types.ERR_DISPATCHED) {
                    dispatch({type: types.SET_ERROR, payload: {
                        title: 'Unable to fetch locations!', 
                        description: 
                          !err.description ? (!err.message ? 'Please check your internet connection.' : err.message) 
                                            : err.description}});
                }
            });
    }
}

function createLocation(unlocode, locationType, name, shortName) {
    return {
        name: name,
        shortName: name,
        aliases: [],
        area: null,
        position: null,
        locationType: locationType,
        URN: `urn:mrn:stm:location:${(unlocode ? unlocode : 'aaaaa')}:${locationType}`
    }
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
