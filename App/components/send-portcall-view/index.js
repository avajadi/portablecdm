import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Picker,
  ActivityIndicator
} from 'react-native';

import DateTimePicker from 'react-native-modal-datetime-picker';

import { sendPortCall } from '../../util/sendportcall';
import { objectToXml  } from '../../util/xmlUtils';

export default class SendPortcall extends Component {
  // params:
  // selectedState

  constructor(props) {
    super(props);
    this.state = {
      vesselImo: '',
      portCallId: '',
      showDateTimePicker: false,
      timeType: 'ACTUAL',
      date: new Date(),
      showActivityIndicator: false
    }
  }

  // These handle the DateTime picker
  _showDateTimePicker = () => this.setState({showDateTimePicker: true});
  _hideDateTimePicker = () => this.setState({showDateTimePicker: false});
  _handleDateTimePicked = (date) => {
    this.setState({date: date});
    this._hideDateTimePicker();
  }

  // Activity Indicator shows while submitting
  _showActivityIndicator = () => this.setState({showActivityIndicator: true});
  _hideActivityIndicator = () => this.setState({showActivityIndicator: false});

  _sendPortCall(state, preDefinedPcm) {
    let pcm = {
      vesselImo: state.vesselImo,
      portCallId: state.portCallId,
      payload: {... preDefinedPcm.payload,
        timeType: state.timeType,
        time: state.date.toISOString()    
      }
    }

    this._showActivityIndicator();
    sendPortCall(pcm)
      .then(result => {console.log(result)})
      .then(result => {this._hideActivityIndicator()})
      .catch(error => {console.log(error)})
  }

  render() {
    const { params } = this.props.navigation.state;

    return(
      <View style={styles.container}>
        
        <Text style={styles.formHeader}>Vessel IMO</Text>
        <TextInput
          style={styles.formTextInput}
          onChangeText={(text) => this.setState({vesselImo: text})}      
          placeholder='Enter Vessel IMO'
          />

        <Text style={styles.formHeader}>PortCall Id</Text>
        <TextInput
          style={styles.formTextInput}      
          placeholder='Enter PortCall Id'
          onChangeText={(text) => this.setState({portCallId: text})}                
          />

        <View style={styles.timeContainer}>
          <Button
            title='Pick time'
            onPress={this._showDateTimePicker}
          />  
          <Text style={styles.infoText}>{this.state.date.toUTCString()}</Text>
        </View>
        
        <Picker
          style={styles.timeTypePicker}
          selectedValue={this.state.timeType}
          onValueChange={(itemValue, itemIndex) => this.setState({timeType: itemValue})}>
          <Picker.Item label="Actual" value='ACTUAL' />
          <Picker.Item label="Estimated" value='ESTIMATED' />
        </Picker>     

        <DateTimePicker
          isVisible={this.state.showDateTimePicker}
          onConfirm={this._handleDateTimePicked}
          onCancel= {this._hideDateTimePicker}
          mode='datetime'
        />

        <Button
          title="Send PortCall"
          disabled={!(this.state.portCallId || this.state.vesselImo)}
          onPress={() => this._sendPortCall(this.state, params.selectedState)} />
        
        <ActivityIndicator 
          animating={this.state.showActivityIndicator}
          size='large'/>
      </View>

      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10
  },
  formHeader: {
    marginTop: 15,
    fontSize: 20
  },
  formTextInput: {
    marginLeft: 10,
    marginRight: 10,
    height: 40,
    alignSelf: 'stretch'
  },
  timeContainer: {
    marginTop: 15,
    flexDirection: 'row',
  },
  infoText: {
    marginLeft: 10,
    fontSize: 10,
    color: 'grey',
    alignSelf: 'center'
  },
  timeTypePicker: {
    marginTop: 15,
    width: 150
  }
});