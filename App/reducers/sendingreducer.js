import { 
  SEND_PORTCALL_CLEAR_RESULT, 
  SEND_PORTCALL, 
  SEND_PORTCALL_FAILURE, 
  SEND_PORTCALL_SUCCESS,
  SEND_PORTCALL_SELECT_LOCATION,
  SEND_PORTCALL_CLEAR_LOCATIONS,
  WITHDRAW_TIMESTAMP_BEGIN,
  WITHDRAW_TIMESTAMP_SUCCESS,
  WITHDRAW_TIMESTAMP_FAILURE,
} from '../actions/types';

const INITIAL_STATE = {
  error: undefined,
  successCode: 'none',
  sending: false,
  toLocation: null,
  fromLocation: null,
  atLocation: null,
  withdrawingStatement: false,
  withdrawingErrorCode: 'none'
}

const sendingReducer = (state=INITIAL_STATE, action) => {
  switch(action.type) {
    case SEND_PORTCALL:
      return { ...state, sending: true, error: undefined, successCode: 'none' };
    case SEND_PORTCALL_SUCCESS:
      return { ...state, sending: false, successCode: action.payload.status, error: undefined };
    case SEND_PORTCALL_FAILURE:
      return { ...state, sending: false, error: action.payload, successCode: 'none'};
    case SEND_PORTCALL_CLEAR_RESULT:
      return { ...INITIAL_STATE, toLocation: state.toLocation, fromLocation: state.fromLocation, atLocation: state.atLocation };
    case SEND_PORTCALL_SELECT_LOCATION:
      return { ...state, [action.payload.locationType]: action.payload.location};
    case SEND_PORTCALL_CLEAR_LOCATIONS:
      return { ...state, toLocation: null, fromLocation: null, atLocation: null };
    case WITHDRAW_TIMESTAMP_BEGIN:
        return { ...state, withdrawingStatement: true, withdrawingErrorCode: 'none' };
    case WITHDRAW_TIMESTAMP_SUCCESS:
        return { ...state, withdrawingStatement: false, withdrawingErrorCode: 'none' };
    case WITHDRAW_TIMESTAMP_FAILURE:
        return { ...state, withdrawingStatement: false, withdrawingErrorCode: action.payload };
    default:
      return state;
  }
};

export default sendingReducer;