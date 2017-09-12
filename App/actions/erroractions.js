import * as types from './types';

export const setError = (error) => {
    return {
        type: types.SET_ERROR,
        payload: {
            title: error.title,
            description: error.description,
        }
    }
};

export const removeError = (errorTitle) => {
    return {
        type: types.REMOVE_ERROR,
        payload: errorTitle
    }
}