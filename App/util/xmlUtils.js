const uuid = require('uuid/v4');

const preVesselImo = 'urn:mrn:stm:vessel:IMO:';
const preMessageId = 'urn:mrn:stm:portcdm:message:';  
const preLocationMRN  = 'urn:mrn:stm:location:SEGOT:';
const prePortCallId = 'urn:mrn:stm:portcdm:port_call:SEGOT:';

// ALLT I DENNA FILEN BEHÖVER TESTAS RIKTGIT ORDENTLIGT!!!

/**
 * @param {PortCallMessage} pcm 
 *   A plain javascript object, containing information for a PortCallMessage
 * @return {string}
 *  The argument js object as an xml string in the PortCallMessage format
 */
export function objectToXml (pcm) {
  let asXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  asXml += `<portCallMessage xmlns="urn:mrn:stm:schema:port-call-message:0.6"
                             xmlns:payload="urn:mrn:stm:schema:port-call-message:0.6:payload"
                             xmlns:entity="urn:mrn:stm:schema:port-call-message:0.6:entity">\n`;
  
  if(pcm.localPortCallId) {
    asXml += parseLocalPortCallId(pcm.localPortCallId, asXml);
  }
  
  if(pcm.portCallId) {
    asXml += parsePortCallId(pcm.portCallId);
  }

  if(pcm.vesselImo) {
    asXml += parseVesselId(pcm.vesselImo, asXml);
  }

  asXml += generateMessageId(asXml);

  if(pcm.payload) {
    asXml += parsePayload(pcm.payload, asXml);
  }

  asXml += `</portCallMessage>\n`;  
  return asXml;
}

function parsePayload(payload) {
  if(payload.type === 'LocationState') {
    return parseLocationState(payload);
  } else if(payload.type === 'ServiceState') {
    return parseServiceState(payload);
  }
  // TODO: Add AdministrationState
  return 'NO PAYLOAD PARSED';
}

function generateMessageId() {
  return `\t<messageId>${preMessageId}${uuid()}</messageId>\n`;
}

function parseLocalPortCallId(localPortCallId) {
  return `\t<localPortCallId>${localPortCallId}</localPortCallId>\n`;
}

function parseVesselId(vesselImo) {
  return `\t<vesselId>${preVesselImo}${vesselImo}</vesselId>\n`;
}

function parsePortCallId(portCallId) {
  return `\t<portCallId>urn:mrn:stm:portcdm:port_call:SEGOT:${portCallId}</portCallId>\n`;
}

// Untested
function parseServiceState(payload) {
  let asXml = `<payload xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="payload:ServiceState">\n`;
  if(payload.serviceObject) {
    asXml += `<payload:serviceObject>${payload.serviceObject}</payload:serviceObject>`;
  }

  if(payload.performingActor) {  // NOT SURE ABOUT THIS, SPEC AND EXAMPLE SHOWS DIFFERENT THINGS
    asXml += `<payload:performingActor>${payload.performingActor}</payload:performingActor>\n`;
  }

  if(payload.timeSequence) {
    asXml += `<payload:timeSequence>${payload.timeSequence}</payload:timeSequence>\n`;
  }

  if(payload.time) {
    asXml += `<payload:time>${payload.time}</payload:time>\n`;    
  }

  if(payload.timeType) {
    asXml += parseTimeType(payload.timeType);
  }

  // Untested
  if(payload.windowBefore) {
    asXml += parseWindowBefore(payload.windowBefore);
  }

  // Untested
  if(payload.windowAfter) {
    asXml += parseWindowAfter(payload.windowAfter);
  }

  if(payload.at) {
    asXml += parseAt(payload.at);
  }

  if(payload.between) {
    asXml += parseBetween(payload.between);
  }

  asXml += `</payload>\n`;
  return asXml;
}

function parseBetween(between) {
  let asXml = `<payload:between>`;
  if(between.to) {
    asXml += parseTo(between.to);
  }
  if(between.from) {
    asXml += parseFrom(between.from);
  }
  asXml += `</payload:between>`;
  return asXml;
}

function parseAt(at) {
  let asXml = `<payload:at><entity:locationMRN>${at}</entity:locationMRN></payload:at>\n`;
  return asXml;
}

// Untested
function parseWindowBefore(windowBefore) {
  return `<payload:windowBefore>${windowBefore}</payload:windowBefore>`;
}

// Untested
function parseWindowAfter(windowAfter) {
  return `<payload:windowBefore>${windowAfter}</payload:windowBefore>`;
}

function parseTimeType(timeType) {
  return `<payload:timeType>${timeType}</payload:timeType>\n`;
}

function parseLocationState(payload) {
    let asXml = `<payload xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="payload:LocationState">\n`;
    if(payload.referenceObject) {
      asXml += `<payload:referenceObject>${payload.referenceObject}</payload:referenceObject>\n`
    }
    if(payload.time) {
      asXml += `<payload:time>${payload.time}</payload:time>\n`;
    }
    
    // Untested
    if(payload.windowBefore) {
      asXml += parseWindowBefore(payload.windowBefore);
    }

    // Untested
    if(payload.windowAfter) {
      asXml += parseWindowAfter(payload.windowAfter);
    }

    if(payload.timeType) {
      asXml += parseTimeType(payload.timeType);
    }

    if(payload.arrivalLocation) {
      asXml += parseArrivalLocation(payload.arrivalLocation);
    }

    if(payload.departureLocation) {
      asXml += parseDepartureLocation(payload.departureLocation);
    }

    asXml += `</payload>\n`;
    return asXml;    
}

function parseDepartureLocation(departureLocation) {
  let asXml = `<payload:departureLocation>\n`;
  if(departureLocation.to) {
    asXml += parseTo(departureLocation.to);
  }
  if(departureLocation.from) {
    asXml += parseFrom(departureLocation.from);
  }
  asXml += `</payload:departureLocation>\n`;
  return asXml;
}

function parseTo(to) {
  let asXml = `<payload:to>\n`;
  asXml += `<entity:locationMRN>${preLocationMRN}${to}</entity:locationMRN>\n`; 
  asXml += `</payload:to>\n`;
  return asXml;
}

function parseFrom(from) {
  let asXml = `<payload:from>\n`;  
  asXml += `<entity:locationMRN>${preLocationMRN}${from}</entity:locationMRN>\n`; 
  asXml += `</payload:from>\n`;
  return asXml;
}

function parseArrivalLocation(arrivalLocation) {
  let asXml = `<payload:arrivalLocation>\n`;
      if(arrivalLocation.to) {
        asXml += parseTo(arrivalLocation.to);
      }
      if(arrivalLocation.from) {
        asXml += parseFrom(arrivalLocation.from);
      }
      asXml += `</payload:arrivalLocation>\n`;
      return asXml;
}