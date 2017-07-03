import Filter, { statusLevels, sortBy, orderBy } from '../model/filter';

/**
 * @param {Filter} filter
 *  The filters that should be converted to a query string
 * 
 * @return {string}
 *  The query string representing the filter argument. This can be sent
 *  into the portCDM backend in the /pcb/port_call endpoint
 */
export default function filterToQueryString(filter) {
  if(!filter) return '';
  
  let afterString = '';
  let beforeString = '';
  let result = [];

  if(filter.after) {
    addToResult(result, `after=${new Date(filter.after).toISOString()}`);
  }
  
  if(filter.before) {
    addToResult(result, `before=${new Date(filter.before).toISOString()}`);
  }

  console.log(result.join(''));
  return result.join('');
}

function addToResult(result, newString) {
  if(result.length === 0) {
    result.push('?') 
  } else {
    result.push('&')
  }

  result.push(newString);
}