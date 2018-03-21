import * as types from './types';
import constants from '../config/constants';
import { Alert, Platform } from 'react-native';
import { isStaging } from '../config/instances';

export const loginKeycloak = (code) => {
    return (dispatch, getState) => { 
        let consts = constants(isStaging.some(x => getState().settings.connection.host.includes(x)));
        console.log('Authenticating...');

        let params = {
            code: code,
            grant_type: 'authorization_code',
            client_id: consts.ClientID,
            redirect_uri: consts.RedirectURI
        };

        var formBody = []

        for(var property in params) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(params[property]);
            formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');

        console.log(JSON.stringify(formBody));
        console.log(consts.MaritimeTokenURI);

        return fetch(consts.MaritimeTokenURI, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'bearer',
                'Content-type': 'application/x-www-form-urlencoded',
            },
            body: formBody,
            credentials: 'include'
        }).then((response) => response.json()
        ).then((result) => {
            if(!!result.error) {
                dispatch({
                    type: types.SETTINGS_CHANGE_TOKEN,
                    payload: {
                        accessToken: '',
                        idToken: '',
                        refreshExpiresIn: 0,
                        refreshToken: '',
                        tokenType: 'bearer',
                    }
                });
                console.log('Unable to login: ' + result.error_description);
                Alert.alert(
                    'Unable to login',
                    result.error_description
                );
                return false;
            }
            dispatch({
            type: types.SETTINGS_CHANGE_TOKEN,
            payload: {
                accessToken: result['access_token'],
                idToken: result['id_token'],
                refreshExpiresIn: result['reshresh_expires_in'],
                refreshToken: result['refresh_token'],
                tokenType: result['token_type'],
            }
            });
            console.log('Authentication successful');
            return true;                        
        }).catch((error) => {
            console.error(error);
        });
    }
    return false;
}

export const logoutKeycloak = () => {
    return (dispatch, getState) => {
        let consts = constants(isStaging.some(x => getState().settings.connection.host.includes(x)));
        return fetch(consts.MaritimeLogoutURI, {
            method: 'GET',
        }).then((result) => {
            if(!result.ok) {
                console.log('Cannot logout!');
            }
        }).then(() => {
            dispatch({
                type: types.SETTINGS_CHANGE_TOKEN,
                payload: {
                    accessToken: '',
                    idToken: '',
                    refreshExpiresIn: 0,
                    refreshToken: '',
                    tokenType: 'bearer',
                }
            });
        }).catch((error) => {
            console.log('Woops! Could not logout: ' + error.message);
        });
    }
}