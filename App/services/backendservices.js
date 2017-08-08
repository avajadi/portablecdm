import {objectToXml} from '../util/xmlUtils';
import { PortCDMConfig, ReliabilityConfig } from '../config/portcdmconfig';


const portCDM = {
  /**
   * Testing, testing
   */
  sendPortCall: function (pcm, type) {
    if(pcm.portCallid) {
      return sendThroughMss(pcm, type);
    } else if(pcm.vesselId) {
      return sendThroughAmss(pcm, type);
    }
  },
}; // END portCDM

// export const reliability = {
//   getPortCallReliability: function (portCallId) {
//     return fetch(ReliabilityConfig.endpoints.PORT_CALL(portCallId),
//     {
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });
//   }
// }

// Helper functions
function sendThroughAmss(pcm, type) {
  return send(pcm, PortCDMConfig.endpoints.AMSS.state_update(), type);
}

function sendThroughMss(pcm, type) {
  return send(pcm, PortCDMConfig.endpoints.MSS.mss(), type);
}

function send(pcm, endpoint, stateType) {
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/xml',
      'X-PortCDM-UserId': PortCDMConfig.user.name,
      'X-PortCDM-Password': PortCDMConfig.user.password,
      'X-PortCDM-APIKey': 'eeee'
    },
    body: objectToXml(pcm, stateType)
  });
}

export default portCDM;