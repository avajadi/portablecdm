import {
    CACHE_PORTCALLS,
} from '../actions/types';

const INITIAL_STATE = {
    portCalls: [],
}

const cacheReducer = (state=INITIAL_STATE, action) => {
    switch(action.type) {
        case CACHE_PORTCALLS:
            return {...state, portCalls: action.payload};
        default:
            return state;
    }
}

export default cacheReducer;