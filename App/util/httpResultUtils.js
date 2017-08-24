import {Alert} from 'react-native';

function checkRole(result) {
    if(result.status === 403) {
        Alert.alert(
            'Error',
            'User does not have required role'
        );
        return false;
    }

    return true;
}

function checkServerLive(result) {
    if(result.status === 500){
        Alert.alert(
            'Error',
            'Something went wrong with the server. (500)'
        );
        return false;
    }

    return true;
}

function checkBadRequest(result) {
    if(result.status === 400) {
        Alert.alert(
            'Something went wrong',
            'Bad request to the server.'
        )
        return false;
    }

    return true;
}

function checkAuthorized(result) {
    if(result.status === 401) {
        Alert.alert(
            'Unauthorized',
            'Access denied.'
        );

        return false;
    }

    return true;
}

export function catchError(error) {
    Alert.alert(
        'Something went wrong',
        'Unable to connect to the server!'
    );
}

export function checkResponse(result) {
    if(!checkRole(result)) {
        return false;
    }

    if(!checkServerLive(result)) {
        return false;
    }

    if(!checkBadRequest(result))
        return false;

    if(!checkAuthorized(result))
        return false;

    return true;
}