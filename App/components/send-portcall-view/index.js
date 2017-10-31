import React, {Component} from 'react';
import { connect } from 'react-redux';
import { 
  sendPortCall, 
  clearReportResult,
  selectLocation,

} from '../../actions';

import {
  View,
  TextInput,
  StyleSheet,
  Picker,
  ActivityIndicator,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';

import {
  Button,
  Text,
  Icon,
} from 'react-native-elements';

import DateTimePicker from 'react-native-modal-datetime-picker';

import TopHeader from '../top-header-view';
import LocationSelection from './sections/locationselection';

import colorScheme from '../../config/colors';
import { createPortCallMessageAsObject, objectToXml } from '../../util/xmlUtils';
import { getDateTimeString } from '../../util/timeservices';

class SendPortcall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTimeType: 'ACTUAL',
      selectedDate: new Date(),
      showDateTimePicker: false,
      showLocationSelectionModal: false,
      selectLocationFor: '',
    };
  }

  // These handle the DateTime picker
  _showDateTimePicker = () => this.setState({showDateTimePicker: true});
  _hideDateTimePicker = () => this.setState({showDateTimePicker: false});
  _handleDateTimePicked = (date) => {
    this.setState({selectedDate: date});
    this._hideDateTimePicker();
  }

  // Handle modal for selection locations
  // selectionFor = atLocation, toLocation, fromLocation
  _showLocationSelectionModal = (selectLocationFor) => this.setState({showLocationSelectionModal: true, selectLocationFor: selectLocationFor});
  _hideLocationSelectionModal = () => this.setState({showLocationSelectionModal: false})
   
  _sendPortCall() {
    const { stateId } = this.props.navigation.state.params;
    const { selectedDate, selectedTimeType } = this.state;
    const { vesselId, portCallId, getState, sendPortCall, sendingState, vessel, navigation } = this.props;
    const { atLocation, fromLocation, toLocation, } = sendingState;
    const state = getState(stateId);

    if(!atLocation) {
        Alert.alert('Invalid location', 'At-location is missing!');
        return;
    }

    Alert.alert(
        'Confirmation',
        'Would you like to report a new ' + selectedTimeType.toLowerCase() + ' ' + stateId.replace(/_/g, ' ') + ' for ' + vessel.name + '?',
        [
            {text: 'No'},
            {text: 'Yes', onPress: () => {
                const {type, pcm} = createPortCallMessageAsObject({atLocation, fromLocation, toLocation, vesselId, portCallId, selectedDate, selectedTimeType}, state);
                
                sendPortCall(pcm, type).then(() => {
                    if(!!this.props.sendingState.error) {
                        Alert.alert(
                            'Error',
                            'Unable to send message!'
                        );
                    } 
                });          
            }}
        ]
    );
  }

  componentWillMount() {
    const { atLocation, fromLocation, toLocation } = this.props.navigation.state.params;
    const { selectLocation } = this.props;
    if(atLocation) {
      selectLocation('atLocation', atLocation);
    }
    if(fromLocation) {
      selectLocation('fromLocation', fromLocation);
    }
    if(toLocation) {
      selectLocation('toLocation', toLocation);
    }

  }

  componentWillUnmount() {
    this.props.clearReportResult();
  }

  render() {
    const { vesselId, portCallId, getState, sendingState, navigation, vessel } = this.props;
    const { atLocation, fromLocation, toLocation } = sendingState;
    const { stateId, mostRelevantStatement } = this.props.navigation.state.params;
    const state = getState(stateId);
 
    return(
      <View style={styles.container}>
        <TopHeader title = 'Report' navigation={this.props.navigation}/>
        {/* Information header */}
        <View style={styles.headerContainer} >
          <Text style={styles.headerTitleText}>{vessel.name}</Text>
          <Text style={styles.headerSubText}>{state.Name}</Text>
          <Text style={styles.headerSubInfoText}>
            {!!atLocation && <Text>AT: {atLocation.name}</Text>}
            {!!fromLocation && <Text>FROM: {fromLocation.name}{'\n'}</Text>}    
            {!!toLocation && <Text>TO: {toLocation.name}</Text>}          
          </Text>
        </View>

        <ScrollView>
          {/* Data that must be picked! */}
          <View style={styles.pickerTextContainer}><Text style={styles.pickerTextStyle}>Pick Time Type</Text></View>
          <Picker
            selectedValue={this.state.selectedTimeType}
            onValueChange={(itemValue, itemIndex) => this.setState({selectedTimeType: itemValue})}
            style={styles.pickerContainer}
          >
            <Picker.Item label="Actual" value="ACTUAL" />
            <Picker.Item label="Estimated" value="ESTIMATED" />
          </Picker>

          <View style={styles.pickerContainer}> 
            <Text style={styles.selectedDateText}>{getDateTimeString(this.state.selectedDate)}</Text>
            <Button 
              title="Select Time" 
              buttonStyle={styles.buttonStyle}
              textStyle={{color: 'white'}}
              onPress={this._showDateTimePicker}/>
          </View>

          {/* Location display */}
          {/* if ServiceType of this state is nautical, we need "from" and "to" locations  */}
          { (state.ServiceType === 'NAUTICAL') &&
            <View>
              <View style={styles.locationSelectionContainer}>
                <Text style={styles.locationStaticText}>From: </Text>
                {fromLocation && <Text style={styles.locationDynamicText}>{fromLocation.name}</Text>}
                <Icon
                  name='edit-location'
                  size= {50}
                  color={colorScheme.primaryColor}
                  onPress={() => this._showLocationSelectionModal('fromLocation')}
                />
              </View>
              <View style={styles.locationSelectionContainer}>
                <Text style={styles.locationStaticText}>To: </Text>
                {toLocation && <Text style={styles.locationDynamicText}>{toLocation.name}</Text>}
                <Icon
                  name='edit-location'
                  size= {50}
                  color={colorScheme.primaryColor}
                  onPress={() => this._showLocationSelectionModal('toLocation')}
                />
              </View>
            </View>
          }
          {/* if servicetype isnt nautical, then we know we need an "at" location  */}
          { !(state.ServiceType === 'NAUTICAL') &&
            <View style={styles.locationSelectionContainer}>
              <Text style={styles.locationStaticText}>At: </Text>
              {atLocation && <Text style={styles.locationDynamicText}>{atLocation.name}</Text>}
              <Icon
                name='edit-location'
                size= {50}
                color={colorScheme.primaryColor}
                onPress={() => this._showLocationSelectionModal('atLocation')}
              />
            </View>
          }

          <Modal
            visible={this.state.showLocationSelectionModal}
            onRequestClose={this._hideLocationSelectionModal}
          >
            <LocationSelection
              selectLocationFor={this.state.selectLocationFor}
              locationType={state.LocationType}
              navigation={navigation}
              onBackPress={this._hideLocationSelectionModal.bind(this)}
            />
          </Modal>


          <Button 
            title="Send TimeStamp" 
            buttonStyle={styles.sendButtonStyle}
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
            <Text h4 style={{alignSelf: 'center', color: 'green'}}>Timestamp was successfully sent!</Text>
          }
          { (sendingState.successCode === 202) &&
            <Text h4 style={{alignSelf: 'center', color: 'green'}}>Timestamp was successfully sent, but couldn't be matched to an existing Port Call!</Text>
          }
          { (!!sendingState.error) && // ERROR SENDING
            <Text h4 style={{alignSelf: 'center', color: 'red', fontSize: 12}}>{sendingState.error}</Text>
          }
        
        {mostRelevantStatement && 
          <View style={styles.bottomInfo}>
            <Text style={styles.bottomInfoText}>
              <Text style={styles.bottomInfoTitleText}>Most Relevant Statement: </Text>{'\n'}
            <Text>{mostRelevantStatement.timeType}{' '}
              {getDateTimeString(new Date(mostRelevantStatement.time))}{'\n'}</Text>
              <Text style={{fontWeight: 'bold'}}>Reported by: </Text>{mostRelevantStatement.reportedBy}{'\n'}
              <Text style={{fontWeight: 'bold'}}>At: </Text>{getDateTimeString(new Date(mostRelevantStatement.reportedAt))}  
            </Text>
          </View>
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
    flexDirection: 'column',
    },
  headerTitleText: {
    textAlign: 'center',
    color: colorScheme.secondaryContainerColor,
    fontSize: 12,
   },
  headerSubText: {
    textAlign: 'center',
    color: colorScheme.primaryTextColor,
    fontSize: 18,
    fontWeight: 'bold',
 },
  headerSubInfoText: {
    textAlign: 'center',
    color: colorScheme.secondaryContainerColor,
    fontSize: 12,
    flexDirection: 'column',
    paddingBottom: 10,
 },
  pickerTextContainer: {
    backgroundColor: colorScheme.primaryContainerColor, 
    borderColor: colorScheme.tertiaryTextColor, 
    borderWidth: 1,
    borderRadius: 5, 
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  pickerTextStyle: {
    color: colorScheme.quaternaryTextColor,
    fontSize: 14,
    paddingBottom: 10,
    paddingTop: 10,
    textAlign: 'center',
    borderRadius: 5, 
    overflow: 'hidden',
    fontWeight: 'bold',
  },
  pickerContainer: {
    backgroundColor: colorScheme.primaryContainerColor, 
    borderColor: colorScheme.tertiaryTextColor, 
    borderWidth: 1,
    borderRadius: 5, 
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  buttonStyle: { 
    backgroundColor: colorScheme.primaryColor,
    marginBottom: 10,
    marginTop: 10,
    borderColor: colorScheme.primaryColor, 
    borderWidth: 1,
    borderRadius: 5, 
  },
  sendButtonStyle: { 
    backgroundColor: colorScheme.actualColor,
    borderColor: colorScheme.actualColor, 
    borderWidth: 1,
    borderRadius: 5, 
    flex: 1,
    
  },
  selectedDateText: {
    alignSelf: 'center',
    paddingTop: 10,
    color: colorScheme.quaternaryTextColor,
    fontWeight: 'bold',
    fontSize: 16,
    },
  locationSelectionContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colorScheme.primaryContainerColor, 
    borderColor: colorScheme.tertiaryTextColor, 
    borderWidth: 1,
    borderRadius: 5, 
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  locationStaticText:{
    color: colorScheme.quaternaryTextColor,
    fontSize: 14,
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft: 10,
    borderRadius: 5, 
    overflow: 'hidden',
    fontWeight: 'bold',  
  },
  locationDynamicText:{
    color: colorScheme.quaternaryTextColor,
    fontSize: 14,
    paddingBottom: 10,
    paddingTop: 10,
    borderRadius: 5, 
    overflow: 'hidden', 
  },
  bottomInfo: {
    backgroundColor: colorScheme.secondaryContainerColor, 
    borderColor: colorScheme.tertiaryTextColor, 
    borderWidth: 1,
    borderRadius: 5, 
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  bottomInfoTitleText: {
    fontWeight: 'bold', 
    fontSize: 14, 
  },
  bottomInfoText: {
    fontSize: 10,
    color: colorScheme.sidebarColor,
    paddingLeft: 10,
    paddingTop:10,
    paddingBottom:10,
    }
});

function mapStateToProps(state) {
  return {
    vessel: state.portCalls.vessel,
    vesselId: state.portCalls.vessel.imo,
    portCallId: state.portCalls.selectedPortCall.portCallId,
    getState: state.states.stateById,
    sendingState: state.sending,
  }
}

export default connect(mapStateToProps, {sendPortCall, clearReportResult, selectLocation})(SendPortcall);