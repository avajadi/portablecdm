import {
  FILTER_CHANGE_LIMIT,
  FILTER_CHANGE_SORTBY,
  FILTER_CHANGE_ORDER,
  FILTER_CHANGE_VESSEL_LIST,
  FILTER_CHANGE_ARRIVING_WITHIN,
  FILTER_CHANGE_DEPARTING_WITHIN,
  FILTER_CLEAR_TIME
} from '../actions/types';

const INITIAL_STATE = {
  limit: 100,       // interger > 0
  sort_by: 'LAST_UPDATE',    // LAST_UPDATE | ARRIVAL_DATE
  order: 'DESCENDING',       // DESCENDING | ASCENDING
  vesselList: 'all',             // name of a vessel list in settingsreducer, or "all" to not use filter
  arrivingWithin: 0,
  departingWithin: 0,
};

const filterReducer = (state=INITIAL_STATE, action) => {
  switch(action.type) {
    case FILTER_CHANGE_LIMIT:
      return { ... state, limit: action.payload };
    case FILTER_CHANGE_SORTBY:
      return { ... state, sort_by: action.payload };
    case FILTER_CHANGE_ORDER:
      return { ... state, order: action.payload };
    case FILTER_CHANGE_VESSEL_LIST:
      return { ...state, vesselList: action.payload }
    case FILTER_CHANGE_ARRIVING_WITHIN:
      return { ...state, arrivingWithin: action.payload, departingWithin: 0 }
    case FILTER_CHANGE_DEPARTING_WITHIN:
      return { ...state, departingWithin: action.payload, arrivingWithin: 0 }
    case FILTER_CLEAR_TIME:
      return { ...state, departingWithin: 0, arrivingWithin: 0}
    default:
      return state;
  }
}

export default filterReducer;