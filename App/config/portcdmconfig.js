import filterToQueryString from '../util/filtertoquerystring';

/**
 * Stores everything that is related to the specific portcdm instance
 * we want to use
 */
export const PortCDMConfig = {
  host: `http://dev.portcdm.eu:8080`,
  user : {
    name: 'viktoria',
    password: 'vik123'
  }
};

PortCDMConfig.endpoints = {
  AMSS: { // Assisted Message Submission Service
    state_update:() =>  `${PortCDMConfig.host}/amss/state_update/`
  },
  MSS: { // Message Submission Service
    mss: () => `${PortCDMConfig.host}/mb/mss`
  },
  PCBS: { // PortCall Builder Service
    port_call: {
      list: (filters) => `${PortCDMConfig.host}/pcb/port_call${filterToQueryString(filters)}`, // TODO(johan): add filters!
      operations: (portCallId) =>  `${PortCDMConfig.host}/pcb/port_call/${portCallId}/operations`    
    },
    definition: {
      process: (processId) => `${PortCDMConfig.host}/pcb/definition/${processId}`
    } 
  },
  LR: { // Location Registry
    location: (locationId) => `${PortCDMConfig.host}/location-registry/location/${locationId}`
  },
  VR: { // Vessel Registry
    vessel: (vesselId) => `${PortCDMConfig.host}/vr/vessel/${vesselId}`
  },
}


//vr/vessel För vessel-info