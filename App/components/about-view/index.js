import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';

import {
  Text,
  Button,
  Icon,
} from 'react-native-elements';
import TopHeader from '../top-header-view';
import { APP_VERSION } from '../../config/version';
import colorScheme from '../../config/colors';

export default class AboutView extends Component {
  constructor(props) {
      super(props);
      this.state = {showChangeLog: false}
  }

  render() {
    const BULLET = '\u2022';
    return(
      <View style={styles.container}>
        <Modal
            animationType={'slide'}
            transparent={false}
            style={{backgroundColor: colorScheme.backgroundColor}}
            visible={this.state.showChangeLog}
            onRequestClose={() => this.setState({showChangeLog: false})}
        >
            <TopHeader modal title="Change log" backArrowFunction={() => this.setState({showChangeLog: false})}/>
            <ScrollView style={{padding: 10}}>
                <Text h4>Version 1.5</Text>
                <View style={{padding: 5}}>
                    <Text>{BULLET} Added a Berth View from side menu </Text>
                    <Text>{BULLET} Complete revisit of login view </Text>
                    <Text>{BULLET} Allows for remembering user settings in legacy login </Text>
                    <Text>{BULLET} Tapping a warning from the Timeline now shows details </Text>
                    <Text>{BULLET} Added setting for using SSL rather than specifying scheme and port </Text>
                    <Text>{BULLET} Big performance update </Text>
                    <Text>{BULLET} Added ability to pinch zoom in some views for iOS users</Text>
                    <Text>{BULLET} Added feature to withdraw own messages (with Legacy Login) </Text>
                    <Text>{BULLET} Added filter on stage (for supporting instances)</Text>
                    <Text>{BULLET} Added port call stage in port call list </Text>
                    <Text>{BULLET} Added visualization for withdrawn messages </Text>
                    <Text>{BULLET} Added more vessel info </Text>
                </View>
                <Text h4>Version 1.4</Text>
                <View style={{padding: 5}}>
                    <Text>{BULLET} Users can now filter on locations from the filter menu </Text>
                    <Text>{BULLET} Now suggest ending timestamps when a commenced/arrival to timestamp is reported </Text>
                    <Text>{BULLET} For timestamps that has a location type, it is only possible to select a location of that type when reporting timestamps</Text>
                    <Text>{BULLET} Redirecting when sending in a timestamp or created a new port call </Text>
                    <Text>{BULLET} Now display the device's current timezone in settings</Text>
                    <Text>{BULLET} A few visual improvements </Text>
                </View>
                <Text style={{fontWeight: 'bold', paddingTop: 10, paddingBottom: 5}}>Version 1.3.2</Text>
                <View style={{padding: 5}}>
                    <Text>{BULLET} Matched start and end time of operations to last reported statement </Text>
                    <Text>{BULLET} Improved searching for port calls </Text>
                    <Text>{BULLET} Changed all time and date occurences to be language dependent </Text>
                    <Text>{BULLET} Automatic navigation back to TimeLine after submitted timestamp</Text>
                    <Text>{BULLET} Improved searching for states (searching for "berth" now shows berths) </Text>
                    <Text>{BULLET} Fixed an issue with cache not being persistent between sessions</Text>
                    <Text>{BULLET} Back arrows shows in top menu on Android as well as iOS</Text>
                    <Text>{BULLET} Added Top Header in Legacy Login View and Change Log View</Text>
                </View>
                <Text style={{fontWeight: 'bold', paddingTop: 10, paddingBottom: 5}}>Version 1.3.1</Text>
                <View style={{padding: 5}}>
                    <Text>{BULLET} Added button to show/hide expired events. </Text>
                    <Text>{BULLET} Added background caching of port calls for better searching </Text>
                    <Text>{BULLET} Added setting to change maximum background caching of port calls </Text>
                    <Text>{BULLET} Added location types to all locations </Text>
                    <Text>{BULLET} Small visual changes in filters menu </Text>
                    <Text>{BULLET} Fixed some issues with SeaSWIM login not working for Android and staging environment </Text>
                    <Text>{BULLET} Updated username/password error message. </Text>
                    <Text>{BULLET} Updated error message for code 404 </Text>
                </View>
                <Text h4>Version 1.3</Text>
                <View style={{padding: 5}}>
                    <Text>{BULLET} Added feature to create port calls from scratch </Text>
                    <Text>{BULLET} Send message button now disabled if not everything is filled in </Text>
                    <Text>{BULLET} Fixed a bug for instance ESVLC </Text>
                    <Text>{BULLET} Changed style of successfully sent message </Text>
                    <Text>{BULLET} Fixed a typo in the state catalogue </Text>
                </View>
                <Text style={{fontWeight: 'bold', paddingTop: 10, paddingBottom: 5}}>Version 1.2.4</Text>
                <View style={{padding: 5}}>
                    <Text>{BULLET} Changed the default time type from ACTUAL to ESTIMATED </Text>
                    <Text>{BULLET} Updated SEGOT to new version </Text>
                </View>
                <Text style={{fontWeight: 'bold', paddingTop: 10, paddingBottom: 5}}>Version 1.2.3</Text>
                <View style={{padding: 5}}>
                    <Text>{BULLET} Fixed a bug where it was not possible to send messages with nautical states </Text>
                    <Text>{BULLET} Fixed a bug with locations not being shown correctly in some instances </Text>
                </View>
                <Text style={{fontWeight: 'bold', paddingTop: 10, paddingBottom: 5}}>Version 1.2.2</Text>
                <View style={{padding: 5}}>
                    <Text>{BULLET} Added feature to add comment to a port call message (currently only on selected instances)</Text>
                    <Text>{BULLET} Added comment field in statement details view for supporting instances </Text>
                    <Text>{BULLET} The list of favorite states is now in alphabetic order </Text>
                </View>
                <Text style={{fontWeight: 'bold', paddingTop: 10, paddingBottom: 5}}>Version 1.2.1.1</Text>
                <View style={{padding: 5}}>
                <Text>{BULLET} Fixed a bug with wrong end points on some QA updates</Text>
                </View>
                <Text style={{fontWeight: 'bold', paddingTop: 10, paddingBottom: 5}}>Version 1.2.1</Text>
                <View style={{padding: 5}}>
                    <Text>{BULLET} Fixed a bug in sorting favorites</Text>
                    <Text>{BULLET} Fixed a bug in adding favorites to some older instances</Text>
                    <Text>{BULLET} Added alert for new version updates</Text>
                    <Text>{BULLET} Now flushing cache on version update</Text>
                </View>
                <Text h4>Version 1.2</Text>
                <View style={{padding: 5}}>
                    <Text>{BULLET} Added new favorite system. The favorite port call or vessel will be at the top of the port call list </Text>
                    <Text>{BULLET} Added feature to edit favorite by tap and hold on port call in port call list </Text>
                    <Text>{BULLET} Added feature to edit favorite vessel or port call from timeline view </Text>
                    <Text>{BULLET} Removed old vessel list system </Text>
                    <Text>{BULLET} Added port call caching for faster loading times </Text>
                    <Text>{BULLET} Added dynamic fetching of port calls (like Facebook feed) </Text>
                    <Text>{BULLET} Added dynamic rendering for port calls to greatly improve performance </Text>
                    <Text>{BULLET} Added this change log modal </Text>
                    <Text>{BULLET} Fixed a bug with https for all QA instances </Text>
                    <Text>{BULLET} Fixed a bug where it was not possible to navigate from About view </Text>
                </View>
                <Text style={{fontWeight: 'bold', paddingTop: 10, paddingBottom: 5}}>Version 1.1.1</Text>
                <View style={{padding: 5}}>
                    <Text>{BULLET} Added red line on operations for visualizing current time</Text>
                    <Text>{BULLET} Locations are now sorted on locations already mentioned by the port call</Text>
                    <Text>{BULLET} Lots of code improvement</Text>
                </View>
                <Text h4>Version 1.1</Text>
                <View style={{padding: 5}}>
                    <Text>{BULLET} Added icons for TARGET and RECOMMENDED time types</Text>
                    <Text>{BULLET} Added feature to search by IMO and MMSI number</Text>
                    <Text>{BULLET} Added feature to search by name in Favorite Vessels list</Text>
                    <Text>{BULLET} Added IMO to search results in Favorite Vessel list</Text>
                    <Text>{BULLET} Removed the RELIABILITY: % text from state details when no reliabilities are available</Text>
                </View>
                <Text style={{fontWeight: 'bold', paddingTop: 10, paddingBottom: 5}}>Version 1.0.4</Text>
                <View style={{padding: 5}}>
                    <Text>{BULLET} Fixed a bug where reliabilities would not be fetched when using keycloak</Text>
                    <Text>{BULLET} Removed autocorrect for the search bar in state selection</Text>
                    <Text>{BULLET} Added confirmation when sending messages</Text>
                    <Text>{BULLET} Added support for sending through HTTPS</Text>
                    <Text>{BULLET} Added confirmation for sent message success and failure</Text>
                    <Text>{BULLET} Updated error handling for missing "at"-location</Text>
                </View>
                <Text style={{fontWeight: 'bold', paddingTop: 10, paddingBottom: 5}}>Version 1.0.3</Text>
                <View style={{padding: 5}}>
                    <Text>{BULLET} Fixed SeaSWIM login for at least QA, SEGOT and DEV servers</Text>
                    <Text>{BULLET} Improved return from error view</Text>
                    <Text>{BULLET} Revisited the Legacy Login modal</Text>
                    <Text>{BULLET} Added back arrow for iOS users</Text>
                    <Text>{BULLET} Many other improvements for future updates</Text>
                </View>
            </ScrollView>
        </Modal>
        <TopHeader
          title="About"
          firstPage
          navigation={this.props.navigation}
        />
        <ScrollView>
          {/* Top section, with logos and app name */}
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginRight: 10, marginLeft: 10, marginTop: 15}}>
            <Image
              source={require('../../assets/stmLogo.jpg')}
              style={{height: 50, width: 92}}
            />
            <View style={{flexDirection: 'column'}}>
              <Text h4><Text style={{fontWeight: 'bold'}}>Port</Text><Text style={{fontWeight: 'normal'}}>able</Text>CDM</Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 12}}>Version {APP_VERSION}</Text>
                <Text
                    style={{color: 'blue', textDecorationLine: 'underline', paddingLeft: 7, fontSize: 12}}
                    onPress={() => this.setState({showChangeLog: true})}
                >
                Change log
                </Text>
              </View>
            </View>
            <Image
              source={require('../../assets/riseLogo.png')}
              style={{height: 50, width: 50}}
            />
          </View>
          <Text style={styles.infoText}>
            PortableCDM, a mobile App is to be used on smartphones and tablets for port coordination, developed for Port Collaborative Decision Making (PortCDM) - a concept within the STM Validation Project (2015-2018 - an EU project Co-financed by the European Union).
          </Text>
          <Text style={styles.infoText}>
            PortableCDM gives the users an easy access to monitor and update forthcoming and present port calls in a port. By selecting a port call the users can report new timestamps (Estimates and Actuals) to selected port calls.
          </Text>
          <Text style={styles.infoText}>
            To enhance the possibility to coordinate, the users of PortableCDM are presented with a common situational awareness of the port calls, displayed as a detailed timeline that also presents reliability of different time stamps, warnings, and on-time probability for different time stamps.
          </Text>
          <Text style={styles.infoText}>
            PortableCDM require connectivity to PortCDM infrastructure implemented in the port.
          </Text>
          <Image
            source={require('../../assets/euCoFinance.png')}
            style={{height: 50,width: 358, marginTop: 10}}
          />
{false &&          <Button
            buttonStyle={styles.button}
            title="Change log"
            />}
        </ScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorScheme.backgroundColor,
    backgroundColor: colorScheme.primaryTextColor
  },
  button: {
    //backgroundColor: colorScheme.primaryColor,
    marginBottom: 10,
    marginTop: 50,
    borderColor: colorScheme.primaryColor,
    borderWidth: 1,
    borderRadius: 5,
  },
  infoText: {
    marginLeft: 10,
    marginRight: 10,
    color: colorScheme.quaternaryTextColor,
    marginTop: 4
  }
});
