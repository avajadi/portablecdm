import {Alert} from 'react-native';

export function checkRole(result) {
    if(result.status === 403) {
        Alert.alert(
            'Error',
            'User does not have required role'
        );
        return false;
    }

    return true;
}