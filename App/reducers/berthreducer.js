import {
    BERTH_SELECT_BERTH,
    BERTH_FETCHING_EVENTS,
    BERTH_FETCHING_EVENTS_FAILURE,
    BERTH_FETCHING_EVENTS_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
    selectedLocation: undefined, // Location object
    fetchingEvents: false,
    viewingTime: undefined, // DateTime for when in the timeline we are wieving
    fetchForDate: new Date(), // default to center the searching around NOW
    events: []
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
        default:
            return state;
    }
};

export default berthReducer;