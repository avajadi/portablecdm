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

    this.props.fetchPortCallStructure("urn:mrn:stm:portcdm:port_call:SEGOT:58baf9b8-35e4-456c-9e1c-87e1cdebeb82");
  }

  calculateTimeDifference(startTime, endTime) {
    let startTimeDate = new Date(startTime);
    let endTimeDate = new Date(endTime);

    return Math.abs((endTimeDate - startTimeDate) / 1000 / 60);
  }

  eventColor = {
    BERTH_VISIT: "green",
    // WATER: 'blue',
    // CARGO: 'GREY',
    // BUNKERING: 'orange',
    // PBO_AT_VESSEL: ''
    // GARBAGE: 
    // TOWAGE: 
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

    // console.log(portCallStructure.unchronological)

    // OBS, kan inte anta att det finns en port visit!!
    const portVisit = portCallStructure.unchronological[0];
   
    let startTime = portVisit.startTime;
    // console.log(portCallStructure)

    return(
      <View style={styles.container}>
        <TopHeader
          title="Overview"
        />
        <ScrollView>
          {/* assuming a portvisit  */}
          <View 
            style={{backgroundColor: this.eventColor.PORT_VISIT, marginBottom: 20, }}
          >
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Text>Port visit: {getDateTimeString(new Date(portVisit.startTime))} </Text>
            </View>
          {portCallStructure.timeSlots.map((timeSlot, timeSlotIndex) => {
            return(
              <View
                key={timeSlotIndex}
                style={{flex: 1, flexDirection: 'row', marginLeft: 10, marginRight: 10}}
              >
                {/* <Text>{timeSlot.type}</Text> */}
                {timeSlot.processes.map((process, processIndex) => {
                  return(
                    <View
                      key={processIndex}
                      style={{flex: 1,
                        backgroundColor: this.eventColor[process.id],
                        flexDirection: 'row', 
                        marginLeft: 10, 
                        marginRight: 10, 
                        height: this.calculateTimeDifference(process.startTime, process.endTime),
                        marginTop: this.calculateTimeDifference(process.startTime, startTime) 
                      }}
                    >
                      <Text>{process.id}: {getDateTimeString(new Date(process.startTime))}</Text>
                      <Text 
                        style={{
                          position: 'absolute',
                          bottom: 1,
                          right: 1
                        }}
                      >
                        {getDateTimeString(new Date(process.endTime))}
                      </Text>
                    </View>
                  );
                })}
              </View>
            );
          })}
          </View>          
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



// render() {
//     const { navigate, state } = this.props.navigation;
//     const { selectedPortCall, vessel, activeItemKey } = this.props;

//     return(
//       <View style={styles.container}>
//         <TopHeader title = 'Overview' firstPage navigation={this.props.navigation} rightIconFunction={this.goToStateList}/>
//         <View style={styles.headerContainer} >
//           <Text style={styles.headerText}>{vessel.name}</Text>
//         </View>
//         <ScrollView style={styles.overviewContainer}>
           
//           <View style={styles.portCallContainer}>
//             <Text style={styles.portCallText}> Port Call </Text>
            
//             <View style={styles.portVisitContainer}>
//               <Text style={styles.portVisitText}> Port Visit </Text>
              
//               <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1}}>
//                 <View style={styles.operationContainer}>
//                   <Text style={styles.operationText}> Berth Visit</Text>

//                   <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//                   <View style={styles.berthVisitContainer}>
//                     <Text style={styles.berthVisitText}> Cargo1</Text>
//                   </View>
//                   <View style={styles.berthVisitContainer}>
//                     <Text style={styles.berthVisitText}> Mooring2</Text>
//                   </View>
//                   </View>

//                 </View>
//                 <View style={styles.operationContainer}>
//                   <Text style={styles.operationText}> Operation 2</Text>
//                 </View>
//               </View>

//             </View>
//           </View>
  
//         </ScrollView>
//       </View>
//     );
//   }
// }



// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   headerContainer: {
//     backgroundColor: colorScheme.primaryColor,
//     alignItems: 'center',
//   },
//   headerText: {
//     textAlign: 'center',
//     fontSize: 20,
//     color: colorScheme.primaryTextColor,
//   },
//   overviewContainer: {
//     backgroundColor: colorScheme.backgroundColor,
//   //  flex: 1,
//   },
//   portCallContainer: {
//     backgroundColor: colorScheme.estimateColor,
//     flex: 3,
//   //  flexDirection: 'row',
//   //  height: Dimensions.get('window').height/2,
//     paddingBottom: 10,
//   },
//   portVisitContainer: {
//     backgroundColor: colorScheme.primaryColor,
//     flex: 2,
//   },
//   operationContainer: {
//     backgroundColor: colorScheme.primaryContainerColor,
//     flex: 1,
//     width: Dimensions.get('window').width/6,
//     height: Dimensions.get('window').height/6,
//     marginTop: 10,
//     marginBottom: 10,
//     marginLeft: 10,
//     marginRight: 10,
//   },
//   berthVisitContainer: {
//     backgroundColor: colorScheme.secondaryContainerColor,
//     flex: 1,
//     width: Dimensions.get('window').width/8,
//     height: Dimensions.get('window').height/8,
//     marginTop: 10,
//     marginBottom: 10,
//     marginLeft: 10,
//     marginRight: 10,
//   },
//   portCallText:{
//     textAlign: 'left',
//     fontSize: 12,
//     color: 'black'
//   },
//   portVisitText: {
//     textAlign: 'left',
//     fontSize: 12,
//     color: 'white'
//   },
//   operationText: {
//     textAlign: 'left',
//     fontSize: 12,
//     color: 'black',
//   },
//   berthVisitText: {
//     textAlign: 'left',
//     fontSize: 12,
//     color: 'black',
//   },
// });