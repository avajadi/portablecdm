import React, {Component} from 'react';
import { connect } from 'react-redux';
import { 
  sendPortCall, 
  initPortCall,
  clearReportResult,
  clearVesselResult,
  selectLocation,
  fetchVessel,
  fetchVesselByName,
  removeError,
  clearLocations,
  fetchPortCall,
  selectPortCall,
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
  FormInput,
  FormLabel,
  SearchBar,
} from 'react-native-elements';

import DateTimePicker from 'react-native-modal-datetime-picker';

import TopHeader from '../top-header-view';
import LocationSelection from './sections/locationselection';

import colorScheme from '../../config/colors';
import { createPortCallMessageAsObject, objectToXml } from '../../util/xmlUtils';
import { cleanURN } from '../../util/stringUtils';
import { getDateTimeString } from '../../util/timeservices';
import { hasComment, promptOpposite } from '../../config/instances';


let navBackTimer      = null;
let initRedirectTimer = null;

class SendPortcall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTimeType: 'ESTIMATED',
      selectedDate: new Date(),
      showDateTimePicker: false,
      showLocationSelectionModal: false,
      selectLocationFor: '',
      comment: '',
      selectedVessel: {
        name: '',
      },
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
    const { selectedDate, selectedTimeType, comment } = this.state;
    const { vessel, portCall, getState, sendPortCall, sendingState, navigation } = this.props;
    const { navigate } = navigation;
    const vesselId = vessel.imo;
    const { portCallId } = portCall;
    const { atLocation, fromLocation, toLocation, } = sendingState;
    const state = getState(stateId);

    if (!atLocation && state.ServiceType !== 'NAUTICAL') {
        Alert.alert('Invalid location', 'At-location is missing!');
        return;
    }

    if (state.ServiceType === 'NAUTICAL' && (!fromLocation || !toLocation)) {
        Alert.alert('Invalid location(s)', 'From- or To-location is missing!');
        return;
    } 

    Alert.alert(
        'Confirmation',
        'Would you like to report a new ' + selectedTimeType.toLowerCase() + ' ' + state.Name + ' for ' + vessel.name + '?',
        [
            {text: 'No'},
            {text: 'Yes', onPress: () => {
                const {type, pcm} = createPortCallMessageAsObject({atLocation, fromLocation, toLocation, vesselId, portCallId, selectedDate, selectedTimeType, comment}, state);
                
                sendPortCall(pcm, type).then(() => {
                    if(!!this.props.sendingState.error) {
                        Alert.alert(
                            'Error',
                            'Unable to send message!'
                        );
                    } else { // Success
                        // If the timestamp has reported the start of something, we want to suggest also reporting the end of it
                        if(state.TimeSequence === 'COMMENCED' || state.TimeSequence == 'ARRIVAL_TO') {
                            let oppositeStateId;
                            if(state.TimeSequence === 'COMMENCED') {
                                oppositeStateId = state.StateId.replace('Commenced', 'Completed');
                            } else {
                                oppositeStateId = state.StateId.replace('Arrival', 'Departure')
                            }
                            const oppositeState = getState(oppositeStateId);
                            Alert.alert(
                                'Send completed?',
                                `Timestamp was successfully sent!\nWould you like to also report ${oppositeState.Name}?`,
                                [
                                    {text: 'No', onPress: () => { // No button, just navigate back to TimeLine
                                        this.props.clearReportResult();
                                        navigate('TimeLineDetails');
                                    }},
                                    {text: 'Yes', onPress: () => {
                                        this.props.clearReportResult();
                                        navigate('SendPortCall', {
                                            stateId: oppositeState.StateId, 
                                            newVessel: false,
                                            fromLocation: fromLocation, 
                                            toLocation: toLocation, 
                                            atLocation: atLocation,
                                        });
                                    }}
                                ],
                                {
                                    cancelable: false
                                }
                            );
                        } else {
                            this.refs._scrollView.scrollToEnd();
                            navBackTimer = setTimeout(() => {
                                this.props.clearReportResult();
                                navigate('TimeLineDetails');
                            }, 1000);
                        } 
                    }
                });          
            }}
        ]
    );
  }

  _initPortCall() {
    const { stateId } = this.props.navigation.state.params;
    const { selectedDate, selectedTimeType, comment } = this.state;
    const { portCall, getState, initPortCall, sendingState, navigation, clearVesselResult } = this.props;
    const { navigate } = navigation;
    const { selectedVessel } = this.state;
    const vesselId = selectedVessel.imo;
    const { atLocation, fromLocation, toLocation, } = sendingState;
    const state = getState(stateId);

    console.log('Selected vessel: ' + JSON.stringify(selectedVessel));

    if (!atLocation && state.ServiceType !== 'NAUTICAL') {
        Alert.alert('Invalid location', 'At-location is missing!');
        return;
    }

    if (state.ServiceType === 'NAUTICAL' && (!fromLocation || !toLocation)) {
        Alert.alert('Invalid location(s)', 'From- or To-location is missing!');
        return;
    } 

    Alert.alert(
        'Confirmation',
        'Would you like to create a new port call with ' + selectedTimeType.toLowerCase() + ' ' + state.Name + ' for vessel ' + selectedVessel.name + '?',
        [
            {text: 'No'},
            {text: 'Yes', onPress: () => {
                const {type, pcm} = createPortCallMessageAsObject({atLocation, fromLocation, toLocation, vesselId, portCallId: null, selectedDate, selectedTimeType, comment}, state);
                
                initPortCall(pcm, type).then((portCallId) => {
                    if(!!this.props.sendingState.error) {
                        Alert.alert(
                            'Error',
                            'Unable to send message!'
                        );
                    } else {
                        this.refs._scrollView.scrollToEnd();

                        let fetching = false;
                        // Fetch the portCall so that we can navigate to timeline, need to be on a delay so that the backend have time to create the port call
                        initRedirectTimer = setInterval(() => {
                            if(!fetching) {
                                fetching = true;
                                this.props.fetchPortCall(portCallId)
                                    .then(portCall => {
                                        if(!!portCall) {
                                            this.props.selectPortCall(portCall);
                                            clearInterval(initRedirectTimer);
                                            navigate('TimeLineDetails');
                                        }

                                        fetching = false;
                                    })
                            }
                        }, 2000);

                    }
                    clearVesselResult();
                });       
            }}
        ]
    );
  }

  componentWillMount() {
    const { atLocation, fromLocation, toLocation } = this.props.navigation.state.params;
    const { selectLocation, clearLocations } = this.props;

    clearLocations();

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
    
    clearTimeout(navBackTimer);
    clearInterval(initRedirectTimer);
  }

  getSendButtonEnabled() {
      const { atLocation, fromLocation, toLocation, } = this.props.sendingState;
      const { stateId, newVessel } = this.props.navigation.state.params;
      const state = this.props.getState(stateId);
      return (!(state.ServiceType === 'NAUTICAL' && (!fromLocation || !toLocation) ||
                (state.ServiceType !== 'NAUTICAL' && (!atLocation))) &&
                !((!this.state.selectedVessel && newVessel) ||
                 (!this.props.vessel && !newVessel)));
  }

  render() {
    const { portCallId, getState, sendingState, navigation, vessel, host } = this.props;
    const { atLocation, fromLocation, toLocation } = sendingState;
    const { stateId, mostRelevantStatement, newVessel } = this.props.navigation.state.params; 
    const state = getState(stateId);
    const enableComment = this.props.instanceInfo.hasComment;
    const initializeNew = !!newVessel;
 
    return(
      <View style={styles.container}>
        <TopHeader 
            title = {(initializeNew ? 'Create port call' : 'Report')} 
            navigation={this.props.navigation}
            />
        {/* Information header */}
        <View style={styles.headerContainer} >
          <Text style={styles.headerTitleText}>{(!newVessel ? vessel.name : this.state.selectedVessel.name)}</Text>
          <Text style={styles.headerSubText}>{state.Name}</Text>
          <Text style={styles.headerSubInfoText}>
            {!!atLocation && <Text>AT: {atLocation.name}</Text>}
            {!!fromLocation && <Text>FROM: {fromLocation.name}{'\n'}</Text>}    
            {!!toLocation && <Text>TO: {toLocation.name}</Text>}          
          </Text>
        </View>

        <ScrollView ref="_scrollView">
          {/* PART OF INITIALIZATION */}
        {initializeNew &&
        <View>
            <View style={styles.pickerTextContainer}>
                <Text style={styles.pickerTextStyle}>Select vessel</Text>
            </View>
            <View style={styles.pickerContainer}>
                <View style={styles.rowContainer}>
                <SearchBar
                autoCorrect={false} 
                containerStyle = {styles.searchBarContainer}
                clearIcon
                inputStyle = {{backgroundColor: colorScheme.primaryContainerColor}}
                lightTheme  
                placeholder='Search by name or IMO number'
                placeholderTextColor = {colorScheme.tertiaryTextColor}
                onChangeText={text => this.setState({newVessel: text, selectedVessel: ''})}
                textInputRef='textInput'
                />
                <Button
                containerViewStyle={styles.buttonContainer}
                small
                title="Search"
                disabled={this.state.newVessel <= 0}
                color={this.state.newVessel <= 0 ? colorScheme.tertiaryTextColor : colorScheme.primaryTextColor}
                disabledStyle={{
                    backgroundColor: colorScheme.primaryColor
                }}
                backgroundColor = {colorScheme.primaryColor}
                onPress={() => {
                        const { error, fetchVessel, fetchVesselByName } = this.props;
                        //Search by either name or IMO
                        if(isNaN(this.state.newVessel))
                            fetchVesselByName(this.state.newVessel).then(() => {
                                if(this.props.error.hasError) {
                                    Alert.alert(
                                        this.props.error.error.title,
                                        this.props.error.error.description,
                                    );
                                    this.setState({selectedVessel: '', newVessel: ''});
                                    this.props.removeError(this.props.error.error.title);
                                }
                            });
                        else
                            fetchVessel('urn:mrn:stm:vessel:IMO:' + this.state.newVessel).then(() => {
                                if(this.props.error.hasError) {
                                    Alert.alert(
                                        this.props.error.error.title,
                                        this.props.error.error.description,
                                    );
                                    this.setState({selectedVessel: '',});
                                }
                                this.props.removeError(this.props.error.error.title);
                            });
                        }
                    }
                />
                </View>
            </View>
        </View>
        }
            {!!this.state.newVessel && !!this.props.newVessel && !this.state.selectedVessel && 
            <View
                style={styles.addToListContainer}
            >
              <View>
                <Text>IMO: {this.props.newVessel.imo.split('IMO:')[1]}</Text>
                <Text>Name: {this.props.newVessel.name}</Text>
                <Text>Type: {this.props.newVessel.vesselType}</Text>
                <Text>Call sign: {this.props.newVessel.callSign}</Text>
              </View>
              <View
                style={{alignSelf: 'center'}}
              >
                <Button
                  title="Select"
                  textStyle={{color: colorScheme.primaryTextColor, fontSize: 9}}
                  buttonStyle={styles.buttonStyle}
                  onPress={() => this.setState({selectedVessel: this.props.newVessel})}                
                />
              </View>

            </View>
          }


          {/* Data that must be picked! */}
          <View style={styles.pickerTextContainer}><Text style={styles.pickerTextStyle}>Pick Time Type</Text></View>
          <Picker
            selectedValue={this.state.selectedTimeType}
            onValueChange={(itemValue, itemIndex) => this.setState({selectedTimeType: itemValue})}
            style={styles.pickerContainer}
          >
            <Picker.Item label="Estimated" value="ESTIMATED" />
            <Picker.Item label="Actual" value="ACTUAL" />
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
                {fromLocation && <Text style={styles.locationDynamicText}>{fromLocation.name}{'\n'}<Text style={styles.loocationStaticSubtitle}>{fromLocation.locationType.replace(/_/g, ' ')}</Text></Text>}
                <Icon
                  name='edit-location'
                  size= {50}
                  color={colorScheme.primaryColor}
                  onPress={() => this._showLocationSelectionModal('fromLocation')}
                />
              </View>
              <View style={styles.locationSelectionContainer}>
                <Text style={styles.locationStaticText}>To: </Text>
                {toLocation && <Text style={styles.locationDynamicText}>{toLocation.name}{'\n'}<Text style={styles.loocationStaticSubtitle}>{toLocation.locationType.replace(/_/g, ' ')}</Text></Text>}
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
              {atLocation && <Text style={styles.locationDynamicText}>{atLocation.name}{'\n'}<Text style={styles.loocationStaticSubtitle}>{atLocation.locationType.replace(/_/g, ' ')}</Text></Text>}
              <Icon
                name='edit-location'
                size= {50}
                color={colorScheme.primaryColor}
                onPress={() => this._showLocationSelectionModal('atLocation')}
              />
            </View>
          }

          {enableComment && <View style={styles.commentContainer}>
            <FormLabel>Comment</FormLabel>
            <FormInput 
                inputStyle={{width: window.width * 0.8, height: 50}}
                multiline
                numberOfLines={5}
                maxLength={200}
                autoCorrect={false}
                underlineColorAndroid="transparent"
                placeholder="Tap to add comment"
                value={this.state.comment}
                onChangeText={(text) => this.setState({comment: text})}
                />
          </View>
          }
          <Modal
            visible={this.state.showLocationSelectionModal}
            onRequestClose={this._hideLocationSelectionModal}
          >
            <LocationSelection
              selectLocationFor={this.state.selectLocationFor}
              selectForState={state}
              navigation={navigation}
              onBackPress={this._hideLocationSelectionModal.bind(this)}
            />
          </Modal>

          <Button 
            title="Send TimeStamp" 
            buttonStyle={this.getSendButtonEnabled() ? styles.sendButtonStyle : styles.sendButtonStyleGray}
            disabled={!this.getSendButtonEnabled()}
            onPress={!this.props.navigation.state.params.newVessel ? this._sendPortCall.bind(this) : this._initPortCall.bind(this)}
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
            <View>
                <Text h4 style={styles.success}>{initializeNew ? 
                    'Creating port call...':
                    'Timestamp was successfully sent!'}</Text>
                <ActivityIndicator size="large" color={colorScheme.primaryColor} />
            </View>
          }
          { (sendingState.successCode === 202) &&
            <Text h4 style={styles.success}>Timestamp was successfully sent, but couldn't be matched to an existing Port Call!</Text>
          }
          { (!!sendingState.error) && // ERROR SENDING
            <Text h4 style={styles.error}>{sendingState.error}</Text>
          }
        
        {mostRelevantStatement && 
          <View style={styles.bottomInfo}>
            <Text style={styles.bottomInfoText}>
              <Text style={styles.bottomInfoTitleText}>Most Relevant Statement: </Text>{'\n'}
            <Text>{mostRelevantStatement.timeType}{' '}
              {getDateTimeString(new Date(mostRelevantStatement.time))}{'\n'}</Text>
              <Text style={{fontWeight: 'bold'}}>Reported by: </Text>{cleanURN(mostRelevantStatement.reportedBy)}{'\n'}
              <Text style={{fontWeight: 'bold'}}>At: </Text>{getDateTimeString(new Date(mostRelevantStatement.reportedAt))}  
            </Text>
          </View>
        }
        
        <View style={{height: 200}}/>
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
  vesselSelectContainer: {
    backgroundColor: colorScheme.primaryContainerColor, 
    borderColor: colorScheme.tertiaryTextColor, 
    borderWidth: 1,
    borderRadius: 5, 
    marginLeft: 10,
    marginRight: 10,
  },
  commentContainer: {
    backgroundColor: colorScheme.primaryContainerColor, 
    borderColor: colorScheme.tertiaryTextColor, 
    borderWidth: 1,
    borderRadius: 5, 
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    height: 100,
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
  sendButtonStyleGray: {
    backgroundColor: colorScheme.secondaryContainerColor, // Gray
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
  locationStaticText:{ // To / From / At
    color: colorScheme.quaternaryTextColor,
    fontSize: 14,
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft: 10,
    borderRadius: 5, 
    overflow: 'hidden',
    fontWeight: 'bold',  
    width: 60,
  },
  loocationStaticSubtitle: { // Location type
    color: colorScheme.tertiaryTextColor,
    fontWeight: 'bold',
    fontSize: 12,
  },
  locationDynamicText:{ // ACtual location
    color: colorScheme.quaternaryTextColor,
    fontSize: 14,
    paddingBottom: 10,
    paddingTop: 10,
    borderRadius: 5, 
    overflow: 'hidden', 
    flex: 1,
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
    },
    rowContainer: {
        flexDirection: 'row',
        backgroundColor: colorScheme.primaryColor,
      //  marginBottom: 5,
      },
      searchBarContainer: {
        backgroundColor: colorScheme.primaryColor,
        flex: 3,
        marginRight: 0,
        borderBottomWidth: 0,
        borderTopWidth: 0,      
      },
      buttonContainer: {
        flex: 1,
        marginRight: 0,
        marginLeft: 0,
        alignSelf: 'center',
      },
      addToListContainer: {
        backgroundColor: colorScheme.primaryContainerColor,
        alignSelf: 'center', 
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        marginLeft: 10,
        marginRight: 10,
        borderColor: colorScheme.tertiaryTextColor, 
        borderWidth: 1,
        borderRadius: 5, 
      },
      success: {
          alignSelf: 'center', 
          color: colorScheme.primaryColor,
          margin: 20,
          fontSize: 18,
        },
      error: {
          alignSelf: 'center',
          color: 'red',
          fontSize: 12,
          marginLeft: 20,
      },
});

function mapStateToProps(state) {
  return {
    vessel: state.portCalls.vessel,
    portCall: state.portCalls.selectedPortCall,
    host: state.settings.connection.host,
    getState: state.states.stateById,
    sendingState: state.sending,
    newVessel: state.vessel.vessel,
    error: state.error,
    instanceInfo: state.settings.instance,
  }
}

export default connect(
    mapStateToProps, 
    {
        fetchVessel, 
        fetchVesselByName, 
        removeError, 
        sendPortCall, 
        initPortCall,
        clearReportResult, 
        selectLocation,
        clearVesselResult,
        clearLocations,
        fetchPortCall,
        selectPortCall,
    })(SendPortcall);