import {objectToXml} from '../util/xmlUtils';
import { PortCDMConfig } from '../config/portcdmconfig';


const portCDM = {
  /**
   * Testing, testing
   */
  sendPortCall: function (pcm) {
    if(pcm.vesselImo) {
      return sendThroughAmss(pcm);
    } else {
      return sendThroughMss(pcm);
    }
  },
  getPortCallOperations: function (portCallId) {
  return fetch(PortCDMConfig.endpoints.PCBS.port_call.operations(portCallId),
        {
          headers: {
            'Content-Type': 'application/xml',
            'X-PortCDM-UserId': PortCDMConfig.user.name,
            'X-PortCDM-Password': PortCDMConfig.user.password,
            'X-PortCDM-APIKey': 'eeee'
          },
        });
  },
  getLocation: function (locationId) {
    return fetch(PortCDMConfig.endpoints.LR.location(locationId),
      {
        headers: {
          'Content-Type': 'application/json',
          'X-PortCDM-UserId': PortCDMConfig.user.name,
          'X-PortCDM-Password': PortCDMConfig.user.password,
          'X-PortCDM-APIKey': 'eeee'
        }
      });
  },
  /**
   * Fetches all Port Calls matching the filters
   */
  getPortCalls: async function (filters) {
    return fetch(PortCDMConfig.endpoints.PCBS.port_call.list(filters),
      {
        headers: {
          'Content-Type': 'application/json',
          'X-PortCDM-UserId': PortCDMConfig.user.name,
          'X-PortCDM-Password': PortCDMConfig.user.password,
          'X-PortCDM-APIKey': 'eeee'
        }
      });
  },
  /**
   * Fetches the vessel info for vesselId
   */
  getVessel: async function (vesselId) {
    return fetch(PortCDMConfig.endpoints.VR.vessel(vesselId),
      {
          headers: {
            'Content-Type': 'application/json',
            'X-PortCDM-UserId': PortCDMConfig.user.name,
            'X-PortCDM-Password': PortCDMConfig.user.password,
            'X-PortCDM-APIKey': 'eeee'
          }
        });
  },
  
};

// Helper functions
function sendThroughAmss(pcm) {
  return send(pcm, PortCDMConfig.endpoints.AMSS.state_update());
}

function sendThroughMss(pcm) {
  return send(pcm, PortCDMConfig.endpoints.MSS.mss());
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

export default portCDM;