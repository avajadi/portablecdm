import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import {
  Text,
} from 'react-native-elements';

import TopHeader from '../top-header-view';
import colorScheme from '../../config/colors';

import { fetchPortCallStructure } from '../../actions';
import { getDateTimeString } from '../../util/timeservices';

class OverView extends Component {

  componentWillMount() {
    // console.log(this.props.selectedPortCall.portCallId);
    // this.props.fetchPortCallStructure(this.props.selectedPortCall.portCallId);

    this.props.fetchPortCallStructure("urn:mrn:stm:portcdm:port_call:SEGOT:ab518c85-cd40-4fea-a19e-cfe0b2111253");
  }

  eventColor = {
    BERTH_VISIT: "green",
    // WATER: 'blue',
    // CARGO: 'GREY',
    // BUNKERING: 'orange',
    // PBO_AT_VESSEL: ''
    // GARBAGE: 
    TOWAGE: 'purple',
    // ANCHORING: 
    // PBA_VISIT: 
    PORT_VISIT: 'red',
    // PILOT_ON_BOARD: 
    // ARRIVAL_MOORING: 
    // SLUDGE: 
    // TUG_AT_VESSEL: 
    PILOTAGE: 'grey',
    // READY_TO_SAIL:
    // ESCORT_TOWAGE: 
    // ETUG_AT_VESSEL: 
  }

  render() {
    const { structureIsLoading, portCallStructure } = this.props;

    if(structureIsLoading || !portCallStructure) {
      return <ActivityIndicator animating={structureIsLoading} color={colorScheme.primaryColor} size='large' />;
    }

    return(
      <View style={styles.container}>
        <TopHeader
          title="Overview"
          firstPage
          navigation = {this.props.navigation}
        />
        <ScrollView>
    
        </ScrollView>
      </View>
    );
  }  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})

function mapStateToProps(state) {
    return {
        selectedPortCall: state.portCalls.selectedPortCall,
        vessel: state.portCalls.vessel,
        structureIsLoading: state.portCalls.portCallStructureIsLoading,
        portCallStructure: state.portCalls.portCallStructure,
    }
}

export default connect(mapStateToProps, {fetchPortCallStructure})(OverView);
