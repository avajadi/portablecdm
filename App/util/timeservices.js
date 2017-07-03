import userConfig, { timeDisplayModes } from '../config/userconfig';

/**
 * 
 * @param {Date} date 
 *  Date object, representing the DateTime in UTC
 */
export function getDateString(date) {
  return "not yet implemented";
}

/**
 * 
 * @param {Date} date 
 *  Date object, representing the DateTime in UTC
 */
export function getTimeString(date) {
  return "not yet implemented";
}

/**
 * 
 * @param {Date} date 
 *  Date object, representing the DateTime in UTC
 */
export function getDateTimeString(date) {
  if(userConfig.timeDisplayMode === timeDisplayModes.local) {
    let onlyDate = date.toLocaleDateString();
    let onlyTime = date.toLocaleTimeString();
    return `${onlyDate} ${onlyTime}`;
  } else if (userConfig.timeDisplayMode === timeDisplayModes.local) {
    return date.toUTCString();
  }
}