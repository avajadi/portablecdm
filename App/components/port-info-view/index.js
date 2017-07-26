import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  View,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';

import {
  Text
} from 'react-native-elements';
import TopHeader from '../top-header-view';
import colorScheme from '../../config/colors';

class PortInfo extends Component {
  render() {
    return(
      <View style={styles.container}>
        <TopHeader title = 'Port Info' firstPage navigation={this.props.navigation} rightIconFunction={this.goToStateList}/>


        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Port Location</Text>
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Port Name</Text>
        </View>


        <View style={styles.infoContainer}>
          <Text style={styles.infoText}><Text style={{fontWeight: 'bold'}}>Port Specifics: </Text> Port Specifics</Text> 
          <Text style={styles.infoText}><Text style={{fontWeight: 'bold'}}>Port Specifics: </Text> Port Specifics</Text> 
          <Text style={styles.infoText}><Text style={{fontWeight: 'bold'}}>Port Specifics: </Text> Port Specifics</Text> 
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorScheme.backgroundColor,
  },
  headerContainer: {
    backgroundColor: colorScheme.primaryContainerColor,
    marginTop: 10,
    marginBottom: 0,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  headerText: {
    textAlign: 'center',
    color: colorScheme.quaternaryTextColor,
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: colorScheme.primaryContainerColor,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    flexDirection: 'column',
    borderRadius: 5,
  },
  infoText: {
    fontSize: 14,
    color: colorScheme.quaternaryTextColor,
  },


});

export default connect(null)(PortInfo);