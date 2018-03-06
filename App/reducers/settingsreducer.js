import { 
  SETTINGS_CHANGE_HOST, 
  SETTINGS_CHANGE_PORT,
  SETTINGS_ADD_VESSEL_LIST,
  SETTINGS_ADD_VESSEL_TO_LIST,
  SETTINGS_REMOVE_VESSEL_FROM_LIST,
  SETTINGS_REMOVE_VESSEL_LIST,
  SETTINGS_ADD_PORTCALL_LIST,
  SETTINGS_ADD_PORTCALL_TO_LIST,
  SETTINGS_REMOVE_PORTCALL_FROM_LIST,
  SETTINGS_REMOVE_PORTCALL_LIST,
  SETTINGS_CHANGE_USER,
  SETTINGS_CHANGE_SCHEME,
  SETTINGS_CHANGE_FETCH_RELIABILITY,
  SETTINGS_CHANGE_PORT_UNLOCODE,
  SETTINGS_CHANGE_TOKEN,
  SETTINGS_CHANGE_CACHE_LIMIT,
  SETTINGS_UPDATE_VERSION,
  SETTINGS_FETCH_INSTANCE,
  SETTINGS_CLEAR,
  CACHE_CHANGE_LIMIT,
} from '../actions/types';

import{ APP_VERSION } from '../config/version';

const INITIAL_STATE = {
  connection: {
    host: '',
    port: '8080',
    username: '',
    password: '',
    unlocode: '',
    cacheLimit: 100,
    scheme: 'http://',
  },
  hosts: [],
  rememberLogin: false,
  maxHoursTimeDifference: 72,
  displayOnTimeProbabilityTreshold: 50,
  /*
    vesselLists: {
      name_of_list: [vesselObject],
      name_of_other_list: [vesselObject, vesselObject]
    }
  */
  vesselLists: {},
  fetchReliability: false,
  token: {
    accessToken: '',
    idToken: '',
    refreshExpiresIn: 0,
    refreshToken: '',
    tokenType: 'bearer',
  },
  appVersion: APP_VERSION,  
  instance: undefined
}

const settingsReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case SETTINGS_CHANGE_PORT_UNLOCODE: { //... = shallow copy, : = append/replace
      return { ...state, connection: { ...state.connection, unlocode: action.payload}}
    }
    case SETTINGS_CHANGE_FETCH_RELIABILITY:
      return { ...state, fetchReliability: action.payload }
    case SETTINGS_CHANGE_USER: {
      return { 
          ...state, 
          connection: { 
              ...state.connection, 
              username: action.payload.username, 
              password: action.payload.password 
            },
          rememberLogin: action.payload.remember,
        };
    }
    case SETTINGS_CHANGE_HOST:
      let hosts = state.hosts;
      if (!hosts.includes(action.payload)) {
          hosts.push(action.payload);
      }
      return { ...state, connection: { ...state.connection, host: action.payload}, hosts }
    case SETTINGS_CHANGE_PORT:
      return { ...state, connection: { ...state.connection, port: action.payload} }
    case SETTINGS_CHANGE_SCHEME:
      return { ...state, connection: { ...state.connection, scheme: action.payload }};
    case SETTINGS_CHANGE_TOKEN:
      return {...state, token: action.payload}
    case SETTINGS_ADD_VESSEL_LIST:
      if(state.vesselLists[action.payload] !== undefined) return state;
      return { ...state, vesselLists: {...state.vesselLists, [action.payload]: [] }}
    case SETTINGS_REMOVE_VESSEL_LIST:
      const vesselListsCopy = {...state.vesselLists};
      delete vesselListsCopy[action.payload];
      return { ...state, vesselLists: vesselListsCopy };
    case SETTINGS_ADD_VESSEL_TO_LIST:
      const newAddVesselList = [...state.vesselLists[action.payload.listName]];
      // We dont want duplicates
      if(newAddVesselList.findIndex(vessel => vessel.imo === action.payload.vessel.imo) < 0)
        newAddVesselList.push(action.payload.vessel);
      return { ...state, vesselLists: { ...state.vesselLists, [action.payload.listName]: newAddVesselList} }
    case SETTINGS_REMOVE_VESSEL_FROM_LIST:
      const vesselRemoved = [...state.vesselLists[action.payload.listName]].filter(vessel => vessel.imo !== action.payload.vessel.imo)
      return { ...state, vesselLists: {...state.vesselLists, [action.payload.listName]: vesselRemoved}}
    case SETTINGS_UPDATE_VERSION:
      return { ...state, appVersion: action.payload };
    case SETTINGS_FETCH_INSTANCE: 
      return { ...state, instance: action.payload };
    case SETTINGS_CLEAR:
      return INITIAL_STATE;
    case CACHE_CHANGE_LIMIT:
      return { ...state, cacheLimit: action.payload };
    default:
      return state;
  }
}

export default settingsReducer;