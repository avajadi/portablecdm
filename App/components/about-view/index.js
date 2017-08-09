import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView
} from 'react-native';

import {
  Text,
} from 'react-native-elements';
import TopHeader from '../top-header-view';
import colorScheme from '../../config/colors';


export default class AboutView extends Component {
  render() {
    return(
      <View style={styles.container}>
        <TopHeader
          title="About"
          firstPage
        />
        <ScrollView>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginRight: 10, marginLeft: 10, marginTop: 15}}>
            <Image
              source={require('../../assets/stmLogo.jpg')} 
              style={{height: 50, width: 92}}
            /> 
            <View style={{flexDirection: 'column'}}>
              <Text h4><Text style={{fontWeight: 'bold'}}>Port</Text><Text style={{fontWeight: 'normal'}}>able</Text>CDM</Text>
              <Text style={{fontSize: 9}}>Version 1.0</Text>
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
  infoText: {
    marginLeft: 10, 
    marginRight: 10, 
    color: colorScheme.quaternaryTextColor, 
    marginTop: 4
  }
});