import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  View,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';

import {
  Text,
} from 'react-native-elements';
import TopHeader from '../top-header-view';
import colorScheme from '../../config/colors';

class VesselInfo extends Component {
  render(){
    const { navigate, state } = this.props.navigation;
    const { selectedPortCall, vessel, activeItemKey } = this.props;

    return(
      <View style={styles.container}>  
        <TopHeader title = 'Vessel Info' firstPage navigation={this.props.navigation} rightIconFunction={this.goToStateList}/>

        <View style={styles.pictureContainer}>
          <Image
            style={{ 
            width: Dimensions.get('window').width-20,
            height: Dimensions.get('window').height/4,
            borderRadius: 5,
            }}
            source={{uri:vessel.photoURL }}  
            />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{vessel.name}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}><Text style={{fontWeight: 'bold'}}>Vessel Type:  </Text>{vessel.vesselType.replace(/_/g, ' ')}</Text> 
          <Text style={styles.infoText}><Text style={{fontWeight: 'bold'}}>IMO:  </Text>{vessel.imo.replace('urn:mrn:stm:vessel:IMO:', '')}</Text>
          <Text style={styles.infoText}><Text style={{fontWeight: 'bold'}}>MMSI:  </Text>{vessel.mmsi.replace('urn:mrn:stm:vessel:MMSI:', '')}</Text>
          <Text style={styles.infoText}><Text style={{fontWeight: 'bold'}}>Call Sign:  </Text>{vessel.callSign}</Text>
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
  pictureContainer: {
    backgroundColor: colorScheme.backgroundColor,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  headerContainer: {
    backgroundColor: colorScheme.primaryContainerColor,
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
})

function mapStateToProps(state) {
    return {
        selectedPortCall: state.portCalls.selectedPortCall,
        vessel: state.portCalls.vessel,
    }
}

export default connect(mapStateToProps)(VesselInfo);