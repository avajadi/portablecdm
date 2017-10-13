import * as types from './types';
import constants from '../config/constants';
import { Alert } from 'react-native';

export const loginKeycloak = (urlPayload, isStaging) => {
    return (dispatch, getState) => { 
        let consts = constants(isStaging);
        console.log('Authenticating...');
        const [, queryString] = urlPayload.split('#');
        const responseObj = queryString.split('&').reduce((map, pair) => {
            const [key, value] = pair.split('=');
            map[key] = value;
            return map;
        }, {});

        console.log(responseObj.code);

        let params = {
            code: responseObj.code,
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

        console.log(formBody);
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