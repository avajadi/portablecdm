import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
  View,
  TextInput,
  StyleSheet,
  Picker,
  ActivityIndicator
} from 'react-native';

import {
  Button,
  Text
} from 'react-native-elements';

import DateTimePicker from 'react-native-modal-datetime-picker';

import colorScheme from '../../config/colors';
import { createPortCallMessageAsObject, objectToXml } from '../../util/xmlUtils';
import { getDateTimeString } from '../../util/timeservices';
import portCDM from '../../services/backendservices';
import TopHeader from '../top-header-view';

class SendPortcall extends Component {
  static navigationOptions = {
        header: <TopHeader title = 'Report' />
    }

  state = {
    selectedTimeType: 'ACTUAL',
    selectedDate: new Date(),
    showDateTimePicker: false,
    showActivityIndicator: false,
  };

  // These handle the DateTime picker
  _showDateTimePicker = () => this.setState({showDateTimePicker: true});
  _hideDateTimePicker = () => this.setState({showDateTimePicker: false});
  _handleDateTimePicked = (date) => {
    this.setState({selectedDate: date});
    this._hideDateTimePicker();
  }

  // Activity Indicator shows while submitting
  _showActivityIndicator = () => this.setState({showActivityIndicator: true});
  _hideActivityIndicator = () => this.setState({showActivityIndicator: false});

  _sendPortCall() {
    // let pcm = {
    //   vesselImo: state.vesselImo,
    //   portCallId: state.portCallId,
    //   payload: {... preDefinedPcm.payload,
    //     timeType: state.timeType,
    //     time: state.date.toISOString()    
    //   }
    // }
    const { stateId, atLocation, fromLocation, toLocation} = this.props.navigation.state.params;
    const { selectedDate, selectedTimeType } = this.state;
    const { vesselId, portCallId, getState } = this.props;
    const state = getState(stateId);

    const {type, pcm} = createPortCallMessageAsObject({atLocation, fromLocation, toLocation, vesselId, portCallId, selectedDate, selectedTimeType}, state);
  

    portCDM.sendPortCall(pcm, type)
      .then(result => console.log(result))
      .catch(error => {console.log(error)})
  }

  render() {
    const {vesselId, portCallId, getState } = this.props;
    const {stateId, atLocation, fromLocation, toLocation} = this.props.navigation.state.params;
    const state = getState(stateId);
 
    return(
      <View style={styles.container}>
        {/* Information header */}
        <View style={styles.headerContainer} >
          <Text 
            style={styles.headerText}
            h4>
              {state.Name} 
              {atLocation && <Text> at {atLocation.name}</Text>}
              {fromLocation && <Text> from {fromLocation.name}</Text>}    
              {toLocation && <Text> to {toLocation.name}</Text>}          
          </Text>
        </View>

        {/* Data that must be picked! */}
        <Picker
          selectedValue={this.state.selectedTimeType}
          onValueChange={(itemValue, itemIndex) => this.setState({selectedTimeType: itemValue})}
        >
          <Picker.Item label="Actual" value="ACTUAL" />
          <Picker.Item label="Estimated" value="ESTIMATED" />
        </Picker>
        <Text>{getDateTimeString(this.state.selectedDate)}</Text>
        <Button 
          title="Choose time" 
          onPress={this._showDateTimePicker}/>
        <Button 
          title="Send TimeStamp" 
          buttonStyle={{backgroundColor: colorScheme.primaryColor}}
          onPress={this._sendPortCall.bind(this)}
        />

        <DateTimePicker
          isVisible={this.state.showDateTimePicker}
          onConfirm={this._handleDateTimePicked}
          onCancel={this._hideDateTimePicker}
          mode="datetime"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorScheme.backgroundColor
  },
  headerContainer: {
        backgroundColor: colorScheme.primaryColor,
        alignItems: 'center',

    },
    headerText: {
       // fontWeight: 'bold',
        textAlign: 'center',
        color: colorScheme.primaryTextColor,
        
    },
});

function mapStateToProps(state) {
  return {
    vesselId: state.portCalls.vessel.imo,
    portCallId: state.portCalls.selectedPortCall.portCallId,
    getState: state.states.stateById
  }
}

export default connect(mapStateToProps)(SendPortcall);