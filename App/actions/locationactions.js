import * as types from './types';
import { checkResponse, catchError } from '../util/httpResultUtils';
import { createTokenHeaders, createLegacyHeaders } from '../util/portcdmUtils';

export const fetchLocations = (locationType) => {
    return (dispatch, getState) => {
        dispatch({type: types.FETCH_LOCATIONS});
        const connection = getState().settings.connection;
        const token = getState().settings.token;
        return fetch(`${connection.host}:${connection.port}/location-registry/locations`,
            {
                headers: !!connection.username ? createLegacyHeaders(connection) : createTokenHeaders(token)
            })
            .then(result => {
                let err = checkResponse(result);
                if(!err)
                    return result.json();
                
                dispatch({type: types.SET_ERROR, payload: err});
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
                catchError(err);
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
        URN: `urn:mrn:stm:location:${unlocode}:${locationType}`
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


// Helper functions