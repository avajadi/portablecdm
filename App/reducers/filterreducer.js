import {
  FILTER_CHANGE_LIMIT,
  FILTER_CHANGE_SORTBY,
  FILTER_CHANGE_ORDER,
  FILTER_CHANGE_VESSEL_LIST,
} from '../actions/types';

const INITIAL_STATE = {
  limit: 100,       // interger > 0
  sort_by: 'LAST_UPDATE',    // LAST_UPDATE | ARRIVAL_DATE
  order: 'DESCENDING',       // DESCENDING | ASCENDING
  vesselList: 'all'             // name of a vessel list in settingsreducer, or "all" to not use filter
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
      console.log("in filter_change_vessel_list");
      console.log(action.payload);
      return { ...state, vesselList: action.payload }
    default:
      return state;
  }
}

export default filterReducer;