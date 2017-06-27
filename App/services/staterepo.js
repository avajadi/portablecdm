export function getDefaultStates(actor) {
  result = [];
  switch(actor.key) {
    case 'vessel':
      result = ['Arrival_Vessel_Berth', 'Departure_Vessel_Berth'];
      break;
  }

  return result;
}

export function getState(id) {
  return states[id];
}


const states = {
  Arrival_Vessel_Berth: {
    id: 'Arrival_Vessel_Berth',
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
    id: 'Departure_Vessel_Berth',
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