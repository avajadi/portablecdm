import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert
} from 'react-native';

import { sendPortCall } from '../../util/sendportcall'

export default class SendPortcall extends Component {
  static defaultProps = {
    portCall: {
      vesselImo: 9440605,
      payload: {
        type: 'ServiceState',
        serviceObject: 'ANCHORING',
        timeSequence: 'COMMENCED',
        time: '2017-06-25T03:04:05Z',
        timeType: 'ESTIMATED',
        at: 'urn:mrn:stm:location:segot:BERTH:majnabbe46'
      }
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      host: 'http://dev.portcdm.eu:8080',
      username: 'viktoria',
      password: 'vik123'
    };
  }


  _sendPortCall() {
    //Anchoring_Commenced
    // let anchoringCommenced = {
    //   vesselImo: 9440605,
    //   payload: {
    //     type: 'ServiceState',
    //     serviceObject: 'ANCHORING',
    //     timeSequence: 'COMMENCED',
    //     time: '2017-06-25T03:04:05Z',
    //     timeType: 'ESTIMATED',
    //     at: 'urn:mrn:stm:location:segot:BERTH:majnabbe46'
    //   }
    // };

    // //Arrival_Vessel_Berth
    // let arrivalVesselBerth = {
    //   vesselImo: 9440605,
    //   payload: {
    //     type: 'LocationState',
    //     referenceObject: 'VESSEL',
    //     time: '2017-06-27T03:10:05Z',
    //     timeType: 'ESTIMATED',
    //     arrivalLocation: {
    //       to: 'segot:BERTH:majnabbe46'
    //     } 
    //   }
    // }

    sendPortCall(this.props.portCall)
      .then((result) => {console.log(result)})
      .catch((error) => {console.log(error)});


  }

  render() {
    return(
      <View style={styles.container}>
        <Button title='Send portcall' onPress={() => this._sendPortCall(this.props.portCall)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});