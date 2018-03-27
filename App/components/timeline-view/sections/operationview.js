import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
} from 'react-native';

import {
  List,
  ListItem,
  Icon,
  Badge
} from 'react-native-elements';

import WarningView from './warning-view';
import RelevantStatementView from './relevantstatementview';

import Collapsible from 'react-native-collapsible';


import { getTimeString, getDateString } from '../../../util/timeservices'
import { cleanURN } from '../../../util/stringUtils';
import colorScheme from '../../../config/colors';

function getWarningText(warning) {
    let result;
    if(warning.warningType) { // New version
        let noUnderscore = warning.warningType.replace(/_/g, ' ');
        result = noUnderscore.charAt(0).toUpperCase() + noUnderscore.slice(1).toLowerCase();
    } else {
        result = warning.message;
    }

    return result;
}

class OperationView extends Component {

  constructor(props) {
    super(props);

    const { operation } = this.props;
    const { reportedStates, syncStates } = operation;

    this.state = {
      operation: operation,
      reportedStates: reportedStates,
      syncStates: syncStates,
      isCollapsed: operation.endTimeType === 'ACTUAL',
      dimensions: {
          operation: undefined,
          timeContainer: undefined,
      },
      selectedWarning: undefined,
    }

    this._toggleCollapsed = this._toggleCollapsed.bind(this);
    this.renderStateRow = this.renderStateRow.bind(this);
    this.addStatement = this.addStatement.bind(this);
  }
  
  _toggleCollapsed() {
    this.setState({isCollapsed: !this.state.isCollapsed})
  }

  render() {
    const { operation, reportedStates, syncStates, isCollapsed } = this.state;
    const { rowNumber, navigation, getStateDefinition } = this.props;

    // Decide what dot to display
    let dotStyle = [styles.innerDot, styles.innerFutureDot];
    if(operation.endTimeType === 'ACTUAL') dotStyle = [styles.innerDot, styles.innerCompleteDot];

    let startTimeDisplayStyle;
    if (operation.startTimeType === 'ACTUAL'){
      startTimeDisplayStyle = styles.timeDisplayActual;
    }
    else if (operation.startTimeType === 'ESTIMATED'){
      startTimeDisplayStyle = styles.timeDisplayEstimate;
    }
    // This is not working as it should... Can make 13.00 become orange
    else if (!operation.startTimeType) {
      startTimeDisplayStyle = styles.timeDisplayWarning;
    }
    else {
      startTimeDisplayStyle = styles.timeDisplay;
    }

    let endTimeDisplayStyle;
    if (operation.endTimeType === 'ACTUAL'){
      endTimeDisplayStyle = styles.timeDisplayActual;
    }
    else if (operation.endTimeType === 'ESTIMATED'){
      endTimeDisplayStyle = styles.timeDisplayEstimate;
    }
    else if (!operation.endTimeType) {
      endTimeDisplayStyle = styles.timeDisplayWarning;
    }
    else {
      endTimeDisplayStyle = styles.timeDisplay;
    }

    /* THIS IS A DEVIATION FROM BACKEND */
    let firstStatement = Object.keys(reportedStates)
        .map(stateDef => this.findMostRelevantStatement(reportedStates[stateDef]))
        .sort((a,b) => a.time < b.time ? -1 : 1)[0];

    let lastStatement = Object.keys(reportedStates)
        .map(stateDef => this.findMostRelevantStatement(reportedStates[stateDef]))
        .sort((a, b) => a.time > b.time ? -1 : 1)[0];
    
                                                        // Not sure what to do here, but doesn't
    let startTime = new Date(!!operation.startTime && !!firstStatement ? firstStatement.time : null);
    let endTime = new Date(!!operation.endTime && !!lastStatement ? lastStatement.time : null);
    
    let currentTime = new Date();
    let renderRedLine = startTime > 0 && currentTime >= startTime && currentTime <= endTime;
    let redlineStyle = this._calculateRedline(startTime, endTime);

    console.log('hofsdofsd');
    console.log(Object.keys(syncStates));

    return (
      
      <View style={styles.container} onLayout={(event) => {
            if(renderRedLine) {
                this.setState({dimensions: {...this.state.dimensions, operation: event.nativeEvent.layout}});
            }
          }}>
    
        {/* Time Display */}
        <View style={styles.timeContainer}>
          {/*Start Time*/}
          <View style={styles.timeDisplayContainer} onLayout={(event) => {
            if(renderRedLine)
                this.setState({dimensions: {...this.state.dimensions, timeContainer: event.nativeEvent.layout}});
        }}>
            <Text style={styles.dateDisplay}>{getDateString(startTime)}</Text>
            <Text style={startTimeDisplayStyle}>{getTimeString(startTime).slice(0,5)}</Text>
          </View>
          {/*End Time*/}
          <View style={[styles.timeDisplayContainer, {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colorScheme.tertiaryColor}]}>
            <Text style={styles.dateDisplay}>{getDateString(endTime)}</Text>
            <Text style={endTimeDisplayStyle }>{getTimeString(endTime).slice(0,5)}</Text>
          </View>
        </View>

        {/* Red line indicating current time */}
        {(!!this.state.dimensions && renderRedLine) && <View style={this._calculateRedline(startTime, endTime)}/>}

        {/* Line and dots */}
        <View style={styles.timeline}>
          <View style={styles.line}>
            <View style={styles.bottomLine} />
          </View>
          <View style={styles.outerDot}>
            <View style={dotStyle} />
          </View>
          
        </View>

        {/*Everything to the right of the line*/}
        <View
          style={{flex: 1, flexDirection: 'column', marginTop: 0, paddingTop: 0, paddingLeft: 15}}>          
          
          {/*Clickable header to expand information*/}
          <TouchableWithoutFeedback
            onPress={this._toggleCollapsed}>
            <View>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.operationHeader}>{operation.definitionId.replace(/_/g, ' ')}</Text>
                {operation.warnings.length > 0 && 
                <Icon name='warning' color={colorScheme.warningColor}/>
                }
              </View>
              {operation.reliability >= 0 && <Text style={styles.operationInfo}><Text style={{fontWeight: 'bold'}}>RELIABILITY </Text>{operation.reliability}%</Text>}
              {operation.fromLocation && <Text style={styles.operationInfo}><Text style={{fontWeight: 'bold'}}>FROM </Text>{operation.fromLocation.name}</Text>}
              {operation.toLocation && <Text style={styles.operationInfo}><Text style={{fontWeight: 'bold'}}>TO </Text>{operation.toLocation.name}</Text>}
              {operation.atLocation && <Text style={styles.operationInfo}><Text style={{fontWeight: 'bold'}}>AT </Text>{operation.atLocation.name}</Text>}
              {operation.status && <Text style={styles.operationInfo}><Text style={{fontWeight: 'bold'}}>STATUS </Text>{this.renderStatus(operation.status)}</Text>}
            </View>
          </TouchableWithoutFeedback>

          {/*The information, displayed in a list*/}
          <Collapsible
            collapsed = {isCollapsed}
          >
            {/* Render warnings */}
            {operation.warnings.map((warning, index) => {
              return (
                <TouchableWithoutFeedback
                onPress={() => this.setState({selectedWarning: warning})}
                key={index}
                >
                    <View  
                        style={{flexDirection: 'row', alignItems: 'center', paddingTop: 10,}} 
                        >
                        <Icon name='warning' color={colorScheme.warningColor} size={14} paddingRight={10} />
                        <Text style={{fontSize: 8, paddingLeft: 0, maxWidth: Dimensions.get('window').width/1.4 }}>{getWarningText(warning)}</Text>
                    </View>
                </TouchableWithoutFeedback>
              );
            })}          
            <List style={{borderTopWidth: 0}}>
              {
                Object.keys(reportedStates)
                  .map((stateDef) => this.findMostRelevantStatement(reportedStates[stateDef]))
                  .sort((a, b) => a.time < b.time ? -1 : 1) 
                  .map((mostRelevantStatement) => this.renderStateRow(operation, 
                                                        mostRelevantStatement, 
                                                        reportedStates[mostRelevantStatement.stateDefinition],
                                                        this.props.navigation.navigate,
                                                        getStateDefinition(mostRelevantStatement.stateDefinition)
                                                      ))
              }
              {/* Need this, so that sync states are shown even if there are no estimate/actual statement reported */}
              { !!syncStates &&
                Object.keys(syncStates)
                    .map((stateDef) => this.findMostRelevantStatement(syncStates[stateDef]))
                    .sort((a, b) => a.time < b.time ? -1 : 1) 
                    .map((mostRelevantStatement) => {
                        if(reportedStates[mostRelevantStatement.stateDefinition]) {
                            return null; // to keep order correct, sync states that share state definition with a reportedState are rendered in renderStateRow
                        }

                        console.log('1');

                        return this.renderStateRow(operation, 
                                            mostRelevantStatement, 
                                            syncStates[mostRelevantStatement.stateDefinition],
                                            this.props.navigation.navigate,
                                            getStateDefinition(mostRelevantStatement.stateDefinition),
                                            true,
                                        )
                        }
                    )
              }
            </List>

          </Collapsible>
        </View>
        <WarningView 
            operation={operation}
            warning={this.state.selectedWarning}
            onClose={() => this.setState({selectedWarning: undefined})}
            addStatement={(stateId, mostRelevantStatement) => this.addStatement(stateId, mostRelevantStatement)}
        />
      </View>
    );
  }

  _calculateRedline(startTime, endTime) {
        if(!this.state.dimensions.operation || !this.state.dimensions.timeContainer) return null;
        
        //console.log(JSON.stringify(this.state.dimensions));
        let { operation, timeContainer } = this.state.dimensions;
        let currentTime = new Date();    
        let top = 100;
        if(this.state.isCollapsed) {
            top = operation.height / 2;
        } else {
            let passedTime = currentTime - startTime;
            let totalTime = endTime - startTime;
            let allowedOpHeight = operation.height - timeContainer.height * 2;
            top = (passedTime/totalTime) * allowedOpHeight + timeContainer.height;
            // TODO: Adjustments according to user input
        }
        return {
            position: 'absolute',
            top: top,
            left: 0,
            width: 85,
            borderBottomColor: 'red',
            borderBottomWidth: 3,
        }
  }

  renderStateRow(operation, mostRelevantStatement, allOfTheseStatements, navigate, stateDef, isSyncStateCatchUp) {

    const { displayOnTimeProbabilityTreshold } = this.props;
    const syncStates = this.state.syncStates[stateDef.StateId];

    let showSyncState = !isSyncStateCatchUp && !!syncStates;
    
    return (
        <View
            key={mostRelevantStatement.messageId}
        >
            {/* Stack of "normal" statements */}
            <RelevantStatementView
                plusFunction={(stateDef, state) => this.addStatement(stateDef, state)}
                mostRelevantStatement={mostRelevantStatement}
                allOfTheseStatements={allOfTheseStatements}
                displayOnTimeProbabilityTreshold={displayOnTimeProbabilityTreshold}
                stateDef={stateDef}
                operation={operation}
                navigate={this.props.navigation.navigate}
            />

            {/* Stack with TTA/RTA statements */}
            { showSyncState &&
                <RelevantStatementView
                    plusFunction={(stateDef, state) => this.addStatement(stateDef, state, true)}
                    mostRelevantStatement={syncStates[0]}
                    allOfTheseStatements={syncStates}
                    displayOnTimeProbabilityTreshold={displayOnTimeProbabilityTreshold}
                    stateDef={stateDef}
                    operation={operation}
                    navigate={this.props.navigation.navigate}
                />
            }
           
      </View>
    ); 
  }

  renderStatus(status) {
      const formattedStatus = status.charAt(0) + status.substring(1).toLowerCase();
      return (
          <Text style={{color: (status === 'OK' ? 'green' : 'red')}}>{formattedStatus}</Text>
      )
  }

  addStatement(stateDef, mostRelevantStatement, isSyncState) {
    const { operation } = this.state;
    this.props.navigation.navigate('SendPortCall', {
        stateId: stateDef, 
        fromLocation: operation.fromLocation, 
        toLocation: operation.toLocation, 
        atLocation: operation.atLocation,
        isSyncStatement: isSyncState ? true : false,
        mostRelevantStatement: mostRelevantStatement
    });
  }

  /**
   * Finds the most relevant statement, i.e the latest Estimate or the latest Actual. 
   * Actuals always overwrites estimates
   * 
   * @param {[Statement]} statements 
   *   an array of statements, all with the same statedefinition
   */
  findMostRelevantStatement(statements) {

      if(!statements) {
          return statements;
      }

      // sort statements based on reportedAt, latest reported first
      statements.sort((a, b) => {
          let aTime = new Date(a.reportedAt);
          let bTime = new Date(b.reportedAt);

          if(aTime > bTime) return -1;
          if(aTime < bTime) return 1;
          else return 0;
      });
      
      // find the first actual
      for(let i = 0; i < statements.length; i++) {
          if(statements[i].timeType === 'ACTUAL') {
              return statements[i];
          }
      }

      let statementsCopy = [...statements]
      // if no actuals exist, sort again, this time for reliability
      statementsCopy.sort((a, b) => a.reliability - b.reliability);
      for(let j = 0; j < statementsCopy.length; j++) {
        if(statements[j].timeType !== 'ACTUAL') {
          return statements[j];
        }
      }

      return statements[0];
  }
}

function mapStateToProps(state) {
  return {
    getStateDefinition: state.states.stateById,
    displayOnTimeProbabilityTreshold: state.settings.displayOnTimeProbabilityTreshold
  }
}

export default connect(mapStateToProps)(OperationView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colorScheme.primaryContainerColor,
    paddingTop: 5,
  },
  timeContainer: {
    width: 70,
    paddingRight: 5,
    justifyContent: 'space-between',
  },
  timeDisplayContainer: {
    // backgroundColor: colorScheme.secondaryContainerColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  operationHeader: {
    fontWeight: 'bold', 
    fontSize: 18,
    color: colorScheme.quaternaryTextColor, // Snyggare med EmeraldBlue(queaternaryColor)
  },
  operationInfo: {
    fontSize: 10,
    color: colorScheme.quaternaryTextColor
  },
  timeline: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 60,
    width: 16,
    alignItems: 'center',
  },
  line: {
    position: 'absolute',
    top: 0,
    left: 6,
    width: 4,
    bottom: 0,
  },
  topLine: {
    flex: 1,
    width: 4,
    backgroundColor: colorScheme.primaryColor,
  },
  bottomLine: {
    flex: 1,
    width: 4,
    backgroundColor: colorScheme.primaryColor,
  },
  hiddenLine: {
    width: 0,
  },
  outerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colorScheme.primaryColor,
    marginTop: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerDot: {
    width: 10,
    height: 10,
    borderRadius: 6,
  },
  innerCompleteDot: {
    backgroundColor: colorScheme.primaryColor,
  },
  innerActiveDot: {
    backgroundColor: colorScheme.secondaryColor,
  },
  innerFutureDot: {
    backgroundColor: colorScheme.primaryContainerColor,
  },
  dateDisplay: {
    fontSize: Platform.OS === 'ios' ? 8 : 9,
    color: colorScheme.quaternaryTextColor
  },
  timeDisplay: {
    color: colorScheme.tertiaryColor,
  //  fontSize: 12,
  },
  timeDisplayActual: {
    color: colorScheme.actualColor,
  //  fontSize: 12,
  },
  timeDisplayEstimate: {
    color: colorScheme.estimateColor,
  //  fontSize: 12,
  },
  timeDisplayWarning: {
    color: colorScheme.warningColor,
    fontSize: 9,
  }, 
});
