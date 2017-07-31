import {
  FETCH_VESSEL_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
  vessel: null,
};

const vesselReducer = (state=INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_VESSEL_SUCCESS:
      return { ...state, vessel: action.payload }
    default:
      return state;
  }
}

export default vesselReducer;