import { 
  SETTINGS_CHANGE_HOST, 
  SETTINGS_CHANGE_PORT,
  SETTINGS_ADD_VESSEL_LIST,
  SETTINGS_ADD_VESSEL_TO_LIST,
  SETTINGS_REMOVE_VESSEL_FROM_LIST,
  SETTINGS_REMOVE_VESSEL_LIST
} from '../actions/types';

const INITIAL_STATE = {
  connection: {
    host: 'http://dev.portcdm.eu',
    port: "8080",
    username: 'viktoria',
    password: 'vik123'
  },
  maxPortCallsFetched: 1000,
  maxHoursTimeDifference: 72,
  vesselLists: {}
}


const settingsReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case SETTINGS_CHANGE_HOST:
      return { ...state, connection: { ...state.connection, host: action.payload} }
    case SETTINGS_CHANGE_PORT:
      return { ...state, connection: { ...state.connection, port: action.payload} }
    case SETTINGS_ADD_VESSEL_LIST:
      return { ...state, vesselLists: {...state.vesselLists, [action.payload]: [] }}
    case SETTINGS_REMOVE_VESSEL_LIST:
      const vesselListsCopy = {...state.vesselLists};
      delete vesselListsCopy[action.payload];
      return { ...state, vesselLists: vesselListsCopy };
    case SETTINGS_ADD_VESSEL_TO_LIST:
      const newVesselList = [...state.vesselLists[action.payload.listName]];
      newVesselList.push(action.payload.vessel);
      return { ...state, vesselLists: { ...state.vesselLists, [action.payload.listName]: newVesselList} }
    case SETTINGS_REMOVE_VESSEL_FROM_LIST:
      return { ...state, vesselLists: state.vesselLists[action.payload.listName].filter(vesselUrn => vesselUrn !== action.payload.vesselUrn)}
    default:
      return state;
  }
}

export default settingsReducer;