import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import {
  Text,
} from 'react-native-elements';
import TopHeader from '../top-header-view';
import colorScheme from '../../config/colors';

class OverView extends Component {
  render() {
    const { navigate, state } = this.props.navigation;
    const { selectedPortCall, vessel, activeItemKey } = this.props;

    return(
      <View style={styles.container}>
        <TopHeader title = 'Overview' firstPage navigation={this.props.navigation} rightIconFunction={this.goToStateList}/>
        <View style={styles.headerContainer} >
          <Text style={styles.headerText}>{vessel.name}</Text>
        </View>
        <ScrollView style={styles.overviewContainer}>
           
          <View style={styles.portCallContainer}>
            <Text style={styles.portCallText}> Port Call </Text>
            
            <View style={styles.portVisitContainer}>
              <Text style={styles.portVisitText}> Port Visit </Text>
              
              <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1}}>
                <View style={styles.operationContainer}>
                  <Text style={styles.operationText}> Berth Visit</Text>

                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <View style={styles.berthVisitContainer}>
                    <Text style={styles.berthVisitText}> Cargo1</Text>
                  </View>
                  <View style={styles.berthVisitContainer}>
                    <Text style={styles.berthVisitText}> Mooring2</Text>
                  </View>
                  </View>

                </View>
                <View style={styles.operationContainer}>
                  <Text style={styles.operationText}> Operation 2</Text>
                </View>
              </View>

            </View>
          </View>
  
        </ScrollView>
      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: colorScheme.primaryColor,
    alignItems: 'center',
  },
  headerText: {
    textAlign: 'center',
    fontSize: 20,
    color: colorScheme.primaryTextColor,
  },
  overviewContainer: {
    backgroundColor: colorScheme.backgroundColor,
  //  flex: 1,
  },
  portCallContainer: {
    backgroundColor: colorScheme.estimateColor,
    flex: 3,
  //  flexDirection: 'row',
  //  height: Dimensions.get('window').height/2,
    paddingBottom: 10,
  },
  portVisitContainer: {
    backgroundColor: colorScheme.primaryColor,
    flex: 2,
  },
  operationContainer: {
    backgroundColor: colorScheme.primaryContainerColor,
    flex: 1,
    width: Dimensions.get('window').width/6,
    height: Dimensions.get('window').height/6,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  berthVisitContainer: {
    backgroundColor: colorScheme.secondaryContainerColor,
    flex: 1,
    width: Dimensions.get('window').width/8,
    height: Dimensions.get('window').height/8,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  portCallText:{
    textAlign: 'left',
    fontSize: 12,
    color: 'black'
  },
  portVisitText: {
    textAlign: 'left',
    fontSize: 12,
    color: 'white'
  },
  operationText: {
    textAlign: 'left',
    fontSize: 12,
    color: 'black',
  },
  berthVisitText: {
    textAlign: 'left',
    fontSize: 12,
    color: 'black',
  },
});

function mapStateToProps(state) {
    return {
        selectedPortCall: state.portCalls.selectedPortCall,
        vessel: state.portCalls.vessel,
    }
}

export default connect(mapStateToProps)(OverView);