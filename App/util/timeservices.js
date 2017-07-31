import userConfig, { timeDisplayModes } from '../config/userconfig';


  // TODO: tiderna blir fel!, den antar UTC eller nåt!

/**
 * 
 * @param {Date} date 
 *  Date object, representing the DateTime in UTC
 */
export function getDateString(date) {
  if(date.getTime() === new Date(null).getTime()) return '';
  if(userConfig.timeDisplayMode === timeDisplayModes.local) {
    let onlyYear = date.getFullYear();
    let onlyDay = date.getDate();
    let onlyMonth = date.getMonth() +1 ; 
    return `${('0' + onlyMonth).slice(-2)}/${('0' + onlyDay).slice(-2)}/${onlyYear}`;
  } 
}

/**
 * 
 * @param {Date} date 
 *  Date object, representing the DateTime in UTC
 */
export function getTimeString(date) {

  if(userConfig.timeDisplayMode === timeDisplayModes.local) {
    return date.getTime() === new Date(null).getTime() ? 'N/A' : `${date.toLocaleTimeString().slice(0, 5)}`;
  }
}

/**
 * 
 * @param {Date} date 
 *  Date object, representing the DateTime in UTC
 */
export function getDateTimeString(date) {
  if(userConfig.timeDisplayMode === timeDisplayModes.local) {
    let onlyYear = date.getFullYear();
    let onlyDay = date.getDate();
    let onlyMonth = date.getMonth() +1 ;
    let onlyHour = date.getHours();
    let onlyMin = date.getMinutes();
    return `${('0' + onlyMonth).slice(-2)}/${('0' + onlyDay).slice(-2)}/${onlyYear} ${('0' + onlyHour).slice(-2)}:${('0' + onlyMin).slice(-2)}`;
  } else if (userConfig.timeDisplayMode === timeDisplayModes.local) {
    return date.toUTCString();
  }
}

/** Gets a string that says how many seconds, minutes or hours ago
 *  a date was
 * 
 * @param {Date} time 
 *  A time in the past, to compare with the time now
 */
export function getTimeDifferenceString(time) {
  let timeDif = new Date() - time;
  timeDif = timeDif / 1000; // seconds
 
  if(timeDif < 60) {
    return `${Math.floor(timeDif)} sec`;
  }
  
  timeDif = timeDif / 60; // minutes
  if(timeDif < 60) {
    return `${Math.floor(timeDif)} min`;
  }

  timeDif = timeDif / 60; // hours
  return `${Math.floor(timeDif)}h`;
}