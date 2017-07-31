import {
  FILTER_CHANGE_LIMIT,
  FILTER_CHANGE_SORTBY,
  FILTER_CHANGE_ORDER,

} from '../actions/types';

const INITIAL_STATE = {
  limit: 100,       // interger > 0
  sort_by: 'LAST_UPDATE',    // LAST_UPDATE | ARRIVAL_DATE
  order: 'DESCENDING',       // DESCENDING | ASCENDING
};

const filterReducer = (state=INITIAL_STATE, action) => {
  switch(action.type) {
    case FILTER_CHANGE_LIMIT:
      return { ... state, limit: action.payload };
    case FILTER_CHANGE_SORTBY:
      return { ... state, sort_by: action.payload };
    case FILTER_CHANGE_ORDER:
      return { ... state, order: action.payload }  
    default:
      return state;
  }
}

export default filterReducer;