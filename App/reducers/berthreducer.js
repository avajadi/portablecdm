import {
    BERTH_SELECT_BERTH,
    BERTH_FETCHING_EVENTS,
    BERTH_FETCHING_EVENTS_FAILURE,
    BERTH_FETCHING_EVENTS_SUCCESS,
    BERTH_CHANGE_INSPECTION_DATE,
    BERTH_CHANGE_LOOKAHEAD_DAYS,
    BERTH_CHANGE_LOOKBEHIND_DAYS,
} from '../actions/types';

const INITIAL_STATE = {
    selectedLocation: undefined, // Location object
    fetchingEvents: true,
    fetchForDate: new Date(new Date().setHours(0, 0, 0, 0)), // default to center the searching around today (at midnight),
    lookBehindDays: 4,
    lookAheadDays: 7,
    events: [],
    displayRatio: 1/(1000 * 60 * 5)
};

const berthReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case BERTH_SELECT_BERTH:
            return { ...state, selectedLocation: action.payload };
        case BERTH_FETCHING_EVENTS:
            return { ...state, fetchingEvents: true };
        case BERTH_FETCHING_EVENTS_SUCCESS:
            return { ...state, fetchingEvents: false, events: action.payload };
        case BERTH_FETCHING_EVENTS_FAILURE:
            return { ...state, fetchingEvents: false, events: [] };
        case BERTH_CHANGE_INSPECTION_DATE:
            return { ...state, fetchForDate: action.payload };
        case BERTH_CHANGE_LOOKAHEAD_DAYS:
            return { ...state, lookAheadDays: action.payload };
        case BERTH_CHANGE_LOOKBEHIND_DAYS:
            return { ...state, lookBehindDays: action.payload };
        default:
            return state;
    }
};

export default berthReducer;