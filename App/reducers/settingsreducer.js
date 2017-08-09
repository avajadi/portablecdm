import { 
  SETTINGS_CHANGE_HOST, 
  SETTINGS_CHANGE_PORT,
  SETTINGS_ADD_VESSEL_LIST,
  SETTINGS_ADD_VESSEL_TO_LIST,
  SETTINGS_REMOVE_VESSEL_FROM_LIST,
  SETTINGS_REMOVE_VESSEL_LIST,
  SETTINGS_CHANGE_USER,
  SETTINGS_CHANGE_FETCH_RELIABILITY,
  SETTINGS_CHANGE_PORT_UNLOCODE,
} from '../actions/types';

const INITIAL_STATE = {
  connection: {
    host: '',
    port: '',
    username: '',
    password: '',
    unlocode: ''
  },
  maxPortCallsFetched: 5000,
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
}

const settingsReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case SETTINGS_CHANGE_PORT_UNLOCODE: {
      return { ...state, connection: { ...state.connection, unlocode: action.payload}}
    }
    case SETTINGS_CHANGE_FETCH_RELIABILITY:
      return { ...state, fetchReliability: action.payload }
    case SETTINGS_CHANGE_USER: {
      return { ...state, connection: { ...state.connection, username: action.payload.username, password: action.payload.password } }
    }
    case SETTINGS_CHANGE_HOST:
      return { ...state, connection: { ...state.connection, host: action.payload} }
    case SETTINGS_CHANGE_PORT:
      return { ...state, connection: { ...state.connection, port: action.payload} }
    case SETTINGS_ADD_VESSEL_LIST:
      if(state.vesselLists[action.payload] !== undefined) return state;
      return { ...state, vesselLists: {...state.vesselLists, [action.payload]: [] }}
    case SETTINGS_REMOVE_VESSEL_LIST:
      const vesselListsCopy = {...state.vesselLists};
      delete vesselListsCopy[action.payload];
      return { ...state, vesselLists: vesselListsCopy };
    case SETTINGS_ADD_VESSEL_TO_LIST:
      const newAddVesselList = [...state.vesselLists[action.payload.listName]];
      // We dont want duplicate's
      if(newAddVesselList.findIndex(vessel => vessel.imo === action.payload.vessel.imo) < 0)
        newAddVesselList.push(action.payload.vessel);
      return { ...state, vesselLists: { ...state.vesselLists, [action.payload.listName]: newAddVesselList} }
    case SETTINGS_REMOVE_VESSEL_FROM_LIST:
      const vesselRemoved = [...state.vesselLists[action.payload.listName]].filter(vessel => vessel.imo !== action.payload.vessel.imo)
      return { ...state, vesselLists: {...state.vesselLists, [action.payload.listName]: vesselRemoved}}
    default:
      return state;
  }
}

export default settingsReducer;