import {
    SERVER_START,
    SERVER_STOP,
} from '../actions/types';

const INITIAL_STATE = {
    running: false,
    server: undefined,
    port: 1337,
    path: '',
}

const serverReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case SERVER_START:
            return { running: true, ...action.payload };
        case SERVER_STOP:
            return { ...state, running: false, path: '', server: undefined, };
        default:
            return state;
    }
}

export default serverReducer;