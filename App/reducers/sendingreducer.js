import { SEND_PORTCALL_CLEAR_RESULT, SEND_PORTCALL, SEND_PORTCALL_FAILURE, SEND_PORTCALL_SUCCESS } from '../actions/types';

const INITIAL_STATE = {
  error: undefined,
  successCode: 'none',
  sending: false
}

const sendingReducer = (state=INITIAL_STATE, action) => {
  switch(action.type) {
    case SEND_PORTCALL:
      return { ...INITIAL_STATE, sending: true };
    case SEND_PORTCALL_SUCCESS:
      console.log("successfully sent portcall");
      console.log(action.payload);
      return { ...INITIAL_STATE, sending: false, successCode: action.payload.status };
    case SEND_PORTCALL_FAILURE:
      console.log("failed send portcall");
      console.log(action.payload.status);
      return { ...INITIAL_STATE, sending: false, error: action.payload};
    case SEND_PORTCALL_CLEAR_RESULT:
      return { ...INITIAL_STATE };
    default:
      return state;
  }
};

export default sendingReducer;