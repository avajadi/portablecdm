import {
    CACHE_PORTCALLS,
    CACHE_UPDATE,
    CACHE_CLEAR,
    CACHE_APPENDING_PORTCALLS,
    CACHE_ENABLE_APPENDING_PORTCALLS,
} from '../actions/types';

const INITIAL_STATE = {
    portCalls: [],
    lastUpdated: 0,

    appendingPortCalls: false,
}

const cacheReducer = (state=INITIAL_STATE, action) => {
    switch(action.type) {
        case CACHE_PORTCALLS:
            return {...state, portCalls: action.payload };
        case CACHE_UPDATE:
            return { ...state, lastUpdated: action.payload };
        case CACHE_CLEAR:
            return INITIAL_STATE;
        case CACHE_APPENDING_PORTCALLS:
            return { ...state, appendingPortCalls: true};
        case CACHE_ENABLE_APPENDING_PORTCALLS:
            return { ...state, appendingPortCalls: false };
        default:
            return state;
    }
}

export default cacheReducer;