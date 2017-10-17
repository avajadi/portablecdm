import {
    SET_ERROR,
    REMOVE_ERROR,
} from '../actions/types';

const INITIAL_STATE = {
    hasError: false,
    error: {
        title: 'No error',
        description: 'Everything is fine :)'
    },
}

const errorReducer = (state=INITIAL_STATE, action) => {
    switch(action.type) {
        case SET_ERROR:
            return {...state, hasError: true, error: action.payload}
        case REMOVE_ERROR:
            return {...state, hasError: false};
        default:
            return state;
    }
}

export default errorReducer;