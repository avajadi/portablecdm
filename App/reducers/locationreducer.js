import {
    FETCH_LOCATIONS,
    FETCH_LOCATIONS_SUCCESS,
    FETCH_LOCATIONS_FAILURE
} from '../actions/types';

const INITIAL_STATE = {
    locations: [],
    loading: false,
}

const locationReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_LOCATIONS:
            return { ...state, loading: true }
        case FETCH_LOCATIONS_SUCCESS:
            return { ...state, loading: false, locations: action.payload }
        case FETCH_LOCATIONS_FAILURE:
            return state;
        default:
            return state;
    }
};

const locationsByStateDef = (state, stateDef) => {
    if(stateDef.LocationType) {
        return state.location.locations.filter(l => l.locationType === stateDef.LocationType);
    }

    return state.location.locations;
};

const locationsByLocationType = (state, locationType) => {
    return state.location.locations.filter(l => l.locationType === locationType);
};

export default locationReducer;
export { locationsByStateDef, locationsByLocationType };