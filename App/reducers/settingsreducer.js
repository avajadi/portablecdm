import { 
  SETTINGS_CHANGE_HOST, 
  SETTINGS_CHANGE_PORT 
} from '../actions/types';

const INITIAL_STATE = {
  connection: {
    host: 'http://dev.portcdm.eu',
    port: "8080",
    username: 'viktoria',
    password: 'vik123'
  },
  maxPortCallsFetched: 1000
}


const settingsReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case SETTINGS_CHANGE_HOST:
      return { ...state, connection: { ...state.connection, host: action.payload} }
    case SETTINGS_CHANGE_PORT:
      return { ...state, connection: { ...state.connection, port: action.payload} }
    default:
      return state;
  }
}

export default settingsReducer;