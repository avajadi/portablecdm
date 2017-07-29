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
  Modal
} from 'react-native';

import {
  Button,
  Text
} from 'react-native-elements';

import DateTimePicker from 'react-native-modal-datetime-picker';

import TopHeader from '../top-header-view';
import LocationSelection from './sections/locationselection';

import colorScheme from '../../config/colors';
import { createPortCallMessageAsObject, objectToXml } from '../../util/xmlUtils';
import { getDateTimeString } from '../../util/timeservices';
import portCDM from '../../services/backendservices';

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
  _showLocationSelectionModal = (selectLocationFor) => this.setState({showLocationSelectionModal: true, selectLocationFor: selectLocationFor});
  _hideLocationSelectionModal = () => this.setState({showLocationSelectionModal: false})
   


  _sendPortCall() {
    const { stateId } = this.props.navigation.state.params;
    const { selectedDate, selectedTimeType } = this.state;
    const { vesselId, portCallId, getState, sendPortCall, sendingState } = this.props;
    const { atLocation, fromLocation, toLocation } = sendingState;
    const state = getState(stateId);

    const {type, pcm} = createPortCallMessageAsObject({atLocation, fromLocation, toLocation, vesselId, portCallId, selectedDate, selectedTimeType}, state);

    sendPortCall(pcm, type);
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
    const { vesselId, portCallId, getState, sendingState, navigation } = this.props;
    const { atLocation, fromLocation, toLocation } = sendingState;
    const { stateId, mostRelevantStatement } = this.props.navigation.state.params;
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
                <Text style={{fontWeight: 'bold'}}>From: </Text>
                {fromLocation && <Text>{fromLocation.name}</Text>}
                <Button
                  title="Change"
                  backgroundColor={colorScheme.primaryColor}
                  onPress={() => this._showLocationSelectionModal('fromLocation')}
                />
              </View>
              <View style={styles.locationSelectionContainer}>
                <Text style={{fontWeight: 'bold'}}>To: </Text>
                {toLocation &&   <Text>{toLocation.name}</Text>}
                <Button
                  title="Change"
                  backgroundColor={colorScheme.primaryColor}
                  onPress={() => this._showLocationSelectionModal('toLocation')}
                />
              </View>
            </View>
          }
          {/* if servicetype isnt nautical, then we know we need an "at" location  */}
          { !(state.ServiceType === 'NAUTICAL') &&
            <View style={styles.locationSelectionContainer}>
              <Text style={{fontWeight: 'bold'}}>At: </Text>
              {atLocation && <Text>{atLocation.name}</Text>}
              <Button
                backgroundColor={colorScheme.primaryColor}
                title="Change"
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

        {mostRelevantStatement && 
          <View style={styles.bottomInfo}>
            <Text style={styles.bottomInfoText}>
              {state.Name}{' '}  
              {mostRelevantStatement.timeType}  {' '}
              {getDateTimeString(new Date(mostRelevantStatement.time))}  {' '}
              <Text style={{fontWeight: 'bold'}}>reported by </Text>{mostRelevantStatement.reportedBy}  {' '}
              <Text style={{fontWeight: 'bold'}}>at </Text>{getDateTimeString(new Date(mostRelevantStatement.reportedAt))}  
            </Text>
          </View>
        }

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

    },
    bottomInfo: {
      backgroundColor: colorScheme.primaryColor,
    },
    bottomInfoText: {
      fontSize: 12,
      color: colorScheme.primaryTextColor,
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

export default connect(mapStateToProps, {sendPortCall, clearReportResult, selectLocation})(SendPortcall);