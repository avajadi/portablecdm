export function getDefaultStates(actor) {
  result = [];
  switch(actor.key) {
    case 'vessel':
      result = [states['Arrival_Vessel_Berth'], states['Departure_Vessel_Berth']];
      break;
  }

  return result;
}

const states = {
  Arrival_Vessel_Berth: {
    name: 'Arrival Vessel Berth',
    payload: {
      type: 'LocationState',
      referenceObject: 'VESSEL',
      arrivalLocation: {
        to: 'BERTH'
      }
    }
  },
  Departure_Vessel_Berth: {
    name: 'Departure Vessel Berth',
    payload: {
      type: 'LocationState',
      referenceObject: 'VESSEL',
      departureLocation: {
        from: 'BERTH'
      }
    }
  }
}