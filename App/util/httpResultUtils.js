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
}

export function checkResponse(result) {
    if(!checkRole) {
        return false;
    }

    if(!checkServerLive) {
        return false;
    }

    return true;
}