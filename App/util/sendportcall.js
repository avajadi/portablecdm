import {objectToXml} from './xmlUtils';
import { PortCDMConfig } from '../config/portcdmconfig';

export function sendPortCall(pcm) {
  console.log(objectToXml(pcm));
  return fetch(PortCDMConfig.endpoints.AMSS.state_update, {
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