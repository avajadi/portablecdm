const uuid = require('uuid/v4');

const serviceTimeSequences = ['COMMENCED', 'COMPLETED'];
const administrationTimeSequences = ['CANCELLED', 'CONFIRMED', 'DENIED', 'REQUESTED', 'REQUEST_RECEIVED'];
// if neither of above, assume LocationState

const initialPortCallXml =  `<?xml version="1.0" encoding="UFT-8"?>\n
                             <portCallMessage xmlns="urn:mrn:stm:schema:port-call-message:0.6.1"
                                              xmlns:ns2="urn:mrn:stm:schema:port-call-message:0.6.1:payload"
                                              xmlns:ns3="urn:mrn:stm:schema:port-call-message:0.6.1:entity">\n`;
let pcmAsXml =
pcmAsXml += ``;

export function createPortCallMessageAsObject(params, stateDefinition) {
  const { vesselId, portCallId, atLocation, fromLocation, toLocation, selectedDate, selectedTimeType, comment } = params;

  let pcm = {
    vesselId: vesselId,
    portCallId: portCallId,    
    comment: comment,
    payload: {

    }
  };
  
  type = '';

  if(serviceTimeSequences.indexOf(stateDefinition.TimeSequence) >= 0) {
    // We know it's a ServiceState
    pcm.payload['serviceObject'] = stateDefinition.ServiceObject;
    pcm.payload['timeSequence'] = stateDefinition.TimeSequence;

    // at or between
    if(stateDefinition.ServiceType == 'STATIONARY') {
      pcm.payload['at'] = {
        locationMRN: atLocation ? atLocation.URN : null
      };
    } else if (stateDefinition.ServiceType == 'NAUTICAL') {
      pcm.payload['between'] = {
        from: {
          locationMRN: fromLocation ? fromLocation.URN : null,
        },
        to: {
          locationMRN: toLocation ? toLocation.URN : null
        } 
      };
    }

    type = 'ServiceState';
  } else if(administrationTimeSequences.indexOf(stateDefinition.TimeSequence) >= 0) {
    // We know it's an Administration State
    pcm.payload['serviceObject'] = stateDefinition.ServiceObject;
    pcm.payload['timeSequence'] = stateDefinition.TimeSequence;

    // at or between
    if(stateDefinition.ServiceType == 'STATIONARY') {
      pcm.payload['at'] = {
        locationMRN: atLocation ? atLocation.URN : null
      };
    } else if (stateDefinition.ServiceType == 'NAUTICAL') {
      pcm.payload['between'] = {
        from: {
          locationMRN: fromLocation ? fromLocation.URN : null,
        },
        to: {
          locationMRN: toLocation ? toLocation.URN : null
        } 
      };
    }

    type = 'AdministrationState';
  } else {
    // We can assume it's a LocationState
    pcm.payload['referenceObject'] = stateDefinition.ReferenceObject;
    if(stateDefinition.TimeSequence === 'DEPARTURE_FROM') {
      pcm.payload['departureLocation'] = {
        from: {
          locationMRN: atLocation ? atLocation.URN : null,
        },
      };
    } else if( stateDefinition.TimeSequence === 'ARRIVAL_TO') {
      pcm.payload['arrivalLocation'] = {
        to: {
          locationMRN: atLocation ? atLocation.URN : null,
        }
      };
    }

    type = 'LocationState';
  }

  pcm.payload['time']     = selectedDate.toISOString();
  pcm.payload['timeType'] = selectedTimeType;
  
  return {type: type, pcm: pcm};
}


export function objectToXml(pcm, stateType) {
  const preMessageId = 'urn:mrn:stm:portcdm:message:';  
  let pcmAsXml = initialPortCallXml;
  
  // portCallId, vesselId, messageId, have to be in that order in the xml for some reason
  pcmAsXml += pcm.portCallId ? `\t<portCallId>${pcm.portCallId}</portCallId>\n` : '';
  pcmAsXml += pcm.vesselId ? `\t<vesselId>${pcm.vesselId}</vesselId>\n` : '';
  pcmAsXml += `\t<messageId>${preMessageId}${uuid()}</messageId>\n`;
  pcmAsXml += `\t<comment>${pcm.comment}</comment>\n`;

  if(pcm.payload) {
    pcmAsXml += `\t<payload xsi:type="ns2:${stateType}" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n`;
    
    pcmAsXml += parsePayload(pcm.payload, stateType);
    
    pcmAsXml += `\t</payload>\n`;
  }   

  pcmAsXml += `</portCallMessage>`
  //console.log(pcmAsXml);
  return pcmAsXml;
}

const parsePayload = (payload, stateType) => {
  let asXml = '';
  // asXml += payload.time ? `\t\t<ns2:time>${payload.time}</ns2:time>\n` : '';
  
  switch(stateType) {
    case "LocationState":
      asXml += payload.referenceObject ? `\t\t<ns2:referenceObject>${payload.referenceObject}</ns2:referenceObject>\n` : '';
      asXml += payload.time ? `\t\t<ns2:time>${payload.time}</ns2:time>\n` : ''; 
      asXml += payload.timeType ? `\t\t<ns2:timeType>${payload.timeType}</ns2:timeType>\n` : '';

      // Arrival Location
      if(payload.arrivalLocation) {
        asXml += `\t\t<ns2:arrivalLocation>\n`;
        if(payload.arrivalLocation.to) {
          asXml += payload.arrivalLocation.to.locationMRN ? `\t\t\t<ns2:to>\n\t\t\t\t<ns3:locationMRN>${payload.arrivalLocation.to.locationMRN}</ns3:locationMRN>\n\t\t\t</ns2:to>` : '';
        }
        asXml += `</ns2:arrivalLocation>\n`;
      }

      // Departure Location
      if(payload.departureLocation) {
        asXml += `\t\t<ns2:departureLocation>\n`;
        if(payload.departureLocation.from) {
          asXml += payload.departureLocation.from.locationMRN ? `\t\t\t<ns2:from>\t\t\t\t<ns3:locationMRN>${payload.departureLocation.from.locationMRN}</ns3:locationMRN>\n\t\t\t</ns2:from>` : '';
        }
        asXml += `\t\t</ns2:departureLocation>\n`;        
      }

      break;
    case "AdministrationState":
      // Fall-through, since administrationstate and service state are the same except for no timetype in adminState
    case "ServiceState":
      asXml += payload.serviceObject ? `\t\t<ns2:serviceObject>${payload.serviceObject}</ns2:serviceObject>\n` : '';    
      asXml += payload.timeSequence ? `\t\t<ns2:timeSequence>${payload.timeSequence}</ns2:timeSequence>\n` : '';
      asXml += payload.time ? `\t\t<ns2:time>${payload.time}</ns2:time>\n` : '';
      asXml += payload.timeType && stateType == 'ServiceState' ? `\t\t<ns2:timeType>${payload.timeType}</ns2:timeType>\n` : '';

      // at or between      
      if(payload.at) {
        asXml += payload.at.locationMRN ?  `\t\t<ns2:at>\n\t\t\t<ns3:locationMRN>${payload.at.locationMRN}</ns3:locationMRN>\n\t\t</ns2:at>\n` : '';
      } else if(payload.between) {
        asXml += `\t\t<ns2:between>\n`;
        asXml += payload.between.to ? `\t\t\t<ns2:to><ns3:locationMRN>${payload.between.to.locationMRN}</ns3:locationMRN></ns2:to>\n` : '';
        asXml += payload.between.from ? `\t\t\t<ns2:from><ns3:locationMRN>${payload.between.from.locationMRN}</ns3:locationMRN></ns2:from>\n` : '';
        asXml += `\t\t</ns2:between>\n`;
      }
      break;

  }

  return asXml;
}

export function createWithdrawXml(messageIdToWithdraw, portCallId, vesselId) {
    let pcmAsXml = initialPortCallXml;

    pcmAsXml += `<portCallId>${portCallId}</portCallId>\n`;
    pcmAsXml += `\t<vesselId>${vesselId}</vesselId>\n`;
    pcmAsXml += `\t<messageId>urn:mrn:stm:portcdm:message:${uuid()}</messageId>\n`;
    pcmAsXml += `\t<payload xsi:type="ns2:MessageOperation" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n`;
    pcmAsXml += `\t\t<ns2:operation>WITHDRAW</ns2:operation>\n`;
    pcmAsXml += `\t\t<ns2:messageId>${messageIdToWithdraw}</ns2:messageId>\n`
    pcmAsXml += `\t</payload>\n`;
    pcmAsXml += `</portCallMessage>`;

    return pcmAsXml;
}
