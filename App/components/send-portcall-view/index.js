import React, {Component} from 'react';
import { connect } from 'react-redux';
import { sendPortCall, clearReportResult } from '../../actions';

import {
  View,
  TextInput,
  StyleSheet,
  Picker,
  ActivityIndicator,
  ScrollView
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

  _sendPortCall() {
    const { stateId, atLocation, fromLocation, toLocation} = this.props.navigation.state.params;
    const { selectedDate, selectedTimeType } = this.state;
    const { vesselId, portCallId, getState, sendPortCall } = this.props;
    const state = getState(stateId);

    const {type, pcm} = createPortCallMessageAsObject({atLocation, fromLocation, toLocation, vesselId, portCallId, selectedDate, selectedTimeType}, state);
  
    sendPortCall(pcm, type);
  }

  componentWillMount() {

  }

  componentWillUnmount() {
    this.props.clearReportResult();
  }

  render() {
    const {vesselId, portCallId, getState, sendingState} = this.props;
    const { navigate } = this.props.navigation;
    const {stateId, atLocation, fromLocation, toLocation} = this.props.navigation.state.params;
    const state = getState(stateId);
 
    return(
      <View style={styles.container}>
        <TopHeader title = 'Report' navigation={this.props.navigation}/>
        {/* Information header */}
        <View style={styles.headerContainer} >
          <Text 
            style={styles.headerText}
            h4>
              {state.Name} 
              {!!atLocation && <Text> at {atLocation.name}</Text>}
              {!!fromLocation && <Text> from {fromLocation.name}</Text>}    
              {!!toLocation && <Text> to {toLocation.name}</Text>}          
          </Text>
        </View>
        <ScrollView>
          {/* Data that must be picked! */}
          <Picker
            selectedValue={this.state.selectedTimeType}
            onValueChange={(itemValue, itemIndex) => this.setState({selectedTimeType: itemValue})}
          >
            <Picker.Item label="Actual" value="ACTUAL" />
            <Picker.Item label="Estimated" value="ESTIMATED" />
          </Picker>
          <Text style={styles.selectedDateText}>{getDateTimeString(this.state.selectedDate)}</Text>
          <Button 
            title="Choose time" 
            onPress={this._showDateTimePicker}/>

          {/* Location selections! */}
          {/* if ServiceType of this state is nautical, we need "from" and "to" locations  */}
          { (state.ServiceType === 'NAUTICAL') &&
            <View>
              <View style={styles.locationSelectionContainer}>
                {fromLocation && <Text>{fromLocation.name}</Text>}
                <Button
                  title="Change"
                  backgroundColor={colorScheme.primaryColor}
                  onPress={() => navigate('SelectLocation', {selectFor: 'fromLocation', locationType: state.LocationType})}
                />
              </View>
              <View style={styles.locationSelectionContainer}>
                {toLocation &&   <Text>{toLocation.name}</Text>}
                <Button
                  title="Change"
                  backgroundColor={colorScheme.primaryColor}
                  onPress={() => navigate('SelectLocation', {selectFor: 'toLocation', locationType: state.LocationType})}
                />
              </View>
            </View>
          }
          {/* if servicetype isnt nautical, then we know we need an "at" location  */}
          { !(state.ServiceType === 'NAUTICAL') &&
            <View style={styles.locationSelectionContainer}>
              {atLocation && <Text>{atLocation.name}</Text>}
              <Button
                backgroundColor={colorScheme.primaryColor}
                title="Change"
                onPress={() => navigate('SelectLocation', {selectFor: 'atLocation', locationType: state.LocationType})}
              />
            </View>
          }


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

          <ActivityIndicator 
            animating={sendingState.sending} 
            size='large' 
            color={colorScheme.primaryColor} 
            style={{alignSelf: 'center'}} 
          />
          { (sendingState.successCode === 200) && 
            <Text h4 style={{alignSelf: 'center', color: 'green'}}>Timestamp sent successfully</Text>
          }
          { (sendingState.successCode === 202) &&
            <Text h4 style={{alignSelf: 'center', color: 'green'}}>Timestamp sent successfully, but couldn't be matched to an existing Port Call</Text>
          }
          { (!!sendingState.error) &&
            <Text h4 style={{alignSelf: 'center', color: 'red', fontSize: 12}}>{sendingState.error}</Text>
          }
        </ScrollView>
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
        fontSize: 12
        
    },
    selectedDateText: {
      alignSelf: 'center',
    },
    locationSelectionContainer: {
      flex: 1,
      flexDirection: 'row',

    }
});

function mapStateToProps(state) {
  return {
    vesselId: state.portCalls.vessel.imo,
    portCallId: state.portCalls.selectedPortCall.portCallId,
    getState: state.states.stateById,
    sendingState: state.sending,
  }
}

export default connect(mapStateToProps, {sendPortCall, clearReportResult})(SendPortcall);