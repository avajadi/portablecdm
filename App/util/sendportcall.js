import {objectToXml} from './xmlUtils';
import { PortCDMConfig } from '../config/portcdmconfig';

/**
 * Sends a PortCallMessage to portCDM, with the username, password
 * and host in PortCDMConfig
 * 
 * @param {*} pcm 
 *   The PortCallMessage we want to send to portCDM
 */
export function sendPortCall(pcm) {
  console.log(objectToXml(pcm));
  if(pcm.vesselImo) {
    return sendThroughAmss(pcm);
  } else {
    return sendThroughMss(pcm);
  }
}

function sendThroughAmss(pcm) {
  return send(pcm, PortCDMConfig.endpoints.AMSS.state_update);
}

function sendThroughMss(pcm) {
  return send(pcm, PortCDMConfig.endpoints.MSS.mss);
}

function send(pcm, endpoint) {
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/xml',
      'X-PortCDM-UserId': PortCDMConfig.user.name,
      'X-PortCDM-Password': PortCDMConfig.user.password,
      'X-PortCDM-APIKey': 'eeee'
    },
    body: objectToXml(pcm)
  });
}