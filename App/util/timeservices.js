import { Util } from 'expo'

/**
 * 
 * @param {Date} date 
 *  Date object, representing the DateTime in UTC
 */
export function getDateString(date) {
    if (date.getTime() === new Date(null).getTime()) return '';

    
    let onlyYear = date.getFullYear();
    let onlyDay = date.getDate();
    let onlyMonth = date.getMonth() + 1;
    
    let reference = date.toLocaleDateString();

    if (reference.includes('-') || 
       (reference.split(/\//g)[0] === ('0' + onlyDay).slice(-2) &&
        reference.split(/\//g)[1] === ('0' + onlyMonth).slice(-2))) { // Swedish style!
        return `${('0' + onlyDay).slice(-2)}/${('0' + onlyMonth).slice(-2)}/${onlyYear}`;
    } 
    return `${('0' + onlyMonth).slice(-2)}/${('0' + onlyDay).slice(-2)}/${onlyYear}`;
}

/**
 * 
 * @param {Date} date 
 *  Date object, representing the DateTime in UTC
 */
export function getTimeString(date) {
    if (date.getTime() === new Date(null).getTime()) {
        return 'N/A';
    }

    let timeStringSplit = date.toLocaleTimeString().split(/:/g);
    let maybeAMPM = timeStringSplit[2].split(/ /g)[1];
    
    return `${timeStringSplit[0].length === 1 ? '0' : ''
            }${timeStringSplit[0]
            }:${timeStringSplit[1]
            } ${!!maybeAMPM ? maybeAMPM : ''}`
}

/**
 * 
 * @param {Date} date 
 *  Date object, representing the DateTime in UTC
 */
export function getDateTimeString(date) {
    let onlyHour = date.getHours();
    let onlyMin = date.getMinutes();

    return `${getDateString(date)} ${getTimeString(date)}`;
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

    if (timeDif < 60) {
        return `${Math.floor(timeDif)} sec`;
    }

    timeDif = timeDif / 60; // minutes
    if (timeDif < 60) {
        return `${Math.floor(timeDif)} min`;
    }

    timeDif = timeDif / 60; // hours
    return `${Math.floor(timeDif)}h`;
}