import {
    CACHE_PORTCALLS,
    CACHE_UPDATE,
    CACHE_CLEAR,
} from '../actions/types';

const INITIAL_STATE = {
    portCalls: [],
    lastUpdated: 0,
}

const cacheReducer = (state=INITIAL_STATE, action) => {
    switch(action.type) {
        case CACHE_PORTCALLS:
            return {...state, portCalls: action.payload};
        case CACHE_UPDATE:
            return { ...state, lastUpdated: action.payload };
        case CACHE_CLEAR:
            return INITIAL_STATE;
        default:
            return state;
    }
}

export default cacheReducer;