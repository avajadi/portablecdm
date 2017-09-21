import {
  FETCH_VESSEL_SUCCESS,
  FETCH_VESSEL_CLEAR,
} from '../actions/types';

const INITIAL_STATE = {
  vessel: null,
};

const vesselReducer = (state=INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_VESSEL_SUCCESS:
      return { ...state, vessel: action.payload }
    case FETCH_VESSEL_CLEAR:
      return { ...INITIAL_STATE }
    default:
      return state;
  }
}

export default vesselReducer;