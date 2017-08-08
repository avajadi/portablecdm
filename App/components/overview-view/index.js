import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Text,
} from 'react-native-elements';

import TopHeader from '../top-header-view';
import colorScheme from '../../config/colors';

import { 
  fetchPortCallOperations,
  selectPortCall,
 } from '../../actions';
import { getDateTimeString } from '../../util/timeservices';

class OverView extends Component {
  constructor(props) {
    super(props);

  }

  componentWillMount() {
    // console.log(this.props.selectedPortCall.portCallId);
    if(this.props.selectedPortCall) {
      this.props.fetchPortCallOperations(this.props.selectedPortCall.portCallId);
    } else {
      this.props.selectPortCall("urn:mrn:stm:portcdm:port_call:SEGOT:ab518c85-cd40-4fea-a19e-cfe0b2111253");
      this.props.fetchPortCallOperations("urn:mrn:stm:portcdm:port_call:SEGOT:ab518c85-cd40-4fea-a19e-cfe0b2111253");
    }

  }

  calculateTimeDifference(earlierDate, laterDate) {
    return Math.floor((laterDate - earlierDate) / 1000 / 60); // timedifference in minutes
  }

  operationLength(operation) {
    if(!operation.startTime || !operation.endTime) return 5;
    const startDate = new Date(operation.startTime);
    const endDate = new Date(operation.endTime);

    return this.calculateTimeDifference(startDate, endDate);
  }

  latestEndTime(operations) {
    let latestEndTime = new Date(null); // 1/1/1970

    for(operation of operations) {
      let endTime = new Date(operation.endTime);
      if(endTime > latestEndTime) {
        latestEndTime = endTime;
      }
    }

    return latestEndTime;
  }

  render() {
    const { operations } = this.props;

    if(!operations || operations.length <= 0) {
      return <ActivityIndicator animating={structureIsLoading} color={colorScheme.primaryColor} size='large' />;
    }

    const earliestStartTime = new Date(operations[0].startTime);
    const latestEndTime = this.latestEndTime(operations);
    return(
      <View style={styles.container}>
        <TopHeader
          title="Overview"
          firstPage
          navigation = {this.props.navigation}
        />
        
        <ScrollView horizontal>
          {/* Left side  */}
          <View style={styles.timeContainer}>


          </View>
          <ScrollView>
            <View style={styles.headerContainer}>
              {operations.map((operation, index) => {

                return(
                  <Text key={index} style={styles.operationText}>{operation.definitionId.replace(/_/g, ' ')}</Text>
                );
              })}
            </View>

            {/* Right side */}
            <View style={styles.contentContainer}>
              {operations.map((operation, index) => {
                console.log(operation.definitionId);

                let startTime = null;
                if(!operation.startTime) {
                  startTime = new Date(operation.endTime);
                } else {
                  startTime = new Date(operation.startTime)
                }

                let endTime = null;
                if(!operation.endTime) {
                  endTime = new Date(operation.startTime);
                } else {
                  endTime = new Date(operation.endTime);
                }

                const start = this.calculateTimeDifference(earliestStartTime, startTime);
                console.log("start: " + start);

                const duration = this.operationLength(operation);

                return(
                  <TouchableWithoutFeedback
                    key={index}
                    onPress={() => console.log(operation.definitionId)}
                  >
                    <View
                      style={{
                        width: 30,
                        height: duration,
                        backgroundColor: colorScheme.primaryColor,
                        borderWidth: 1,
                        borderColor: 'black',
                        marginTop: start
                      }}
                    >
                      <Text style={styles.operationText}>{operation.definitionId.replace(/_/g, ' ')}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                );
              })}
            </View>
      
          </ScrollView>
        </ScrollView>
      </View>
    );
  }  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorScheme.backgroundColor,
  },
  timeContainer: {
    backgroundColor: 'red',     
    width: 70,
    paddingRight: 5,   
  },
  headerContainer: {
    flexDirection: 'row'
  },
  contentContainer: {
    flexDirection: 'row',
    marginRight: 3,
    justifyContent: 'space-between',
    backgroundColor: colorScheme.backgroundColor,
  },
  operationText: {
    color: colorScheme.primaryTextColor,
    fontSize: 10,
    marginTop: 4,
    transform: [
      {rotate: '90deg'}
    ]
  },


})

function mapStateToProps(state) {
    return {
        selectedPortCall: state.portCalls.selectedPortCall,
        vessel: state.portCalls.vessel,
        structureIsLoading: state.portCalls.portCallStructureIsLoading,
        portCallStructure: state.portCalls.portCallStructure,
        operations: state.portCalls.selectedPortCallOperations,
    }
}

export default connect(mapStateToProps, {fetchPortCallOperations, selectPortCall})(OverView);
