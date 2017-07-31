import { 
  FETCH_LOCATIONS, 
  FETCH_LOCATIONS_SUCCESS, 
  FETCH_LOCATIONS_FAILURE 
} from '../actions/types';

const INITIAL_STATE = {
  locations: [],
  locationsByType: function(locationType) {
    return this.locations.filter(location => location.locationType === locationType)
  },
  locationByUrn: function(urn) {
    return this.locations.find(location => location.URN === urn);
  },
  loading: false,
}

const locationReducer = (state=INITIAL_STATE, action) => {
  switch(action.type) {
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

export default locationReducer;