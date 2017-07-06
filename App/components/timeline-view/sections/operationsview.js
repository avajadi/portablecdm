import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';

import {
  List,
  ListItem,
  Icon
} from 'react-native-elements';

import Collapsible from 'react-native-collapsible';

import {getTimeDifferenceString, getTimeString} from '../../../util/timeservices'
import colorScheme from '../../../config/colors';

export default class OperationView extends Component {

  constructor(props) {
    super(props);

    const { operation } = this.props;
    const { reportedStates } = operation;

    this.state = {
      operation: operation,
      reportedStates: reportedStates,
      isCollapsed: true,

    }

    this._toggleCollapsed = this._toggleCollapsed.bind(this);

  }
  
  renderStateRow(operation, allOfTheseStatements) {
    const state = this.findMostRelevantStatement(allOfTheseStatements); // this is the most relevant message for this state
    const reportedTimeAgo = getTimeDifferenceString(new Date(state.reportedAt));

    return (
      <ListItem
        containerStyle = {{
          borderTopWidth: 0,
          borderBottomWidth: 0
        }}
        key={state.messageId}
        title = {
            <View style={{flexDirection:'column'}}>
                <Text style={{fontWeight: 'bold'}} >{state.stateDefinition}</Text>
                <View style= {{flexDirection: 'row'}} >
                    <Text style = {{color: colorScheme.tertiaryColor, fontWeight: 'bold'}} >{new Date(state.time).toTimeString().slice(0, 5)} </Text>
                    {state.timeType === 'ACTUAL' && <Icon 
                                                            name='font-download' 
                                                            color={colorScheme.tertiaryColor
                                                            } />}
                    {state.timeType === 'ESTIMATED' && <Icon 
                                                            name='access-time' 
                                                            color={colorScheme.tertiaryColor
                                                            } />}
                </View>
            </View>
        }
        subtitle = {
            <View style={{flexDirection: 'column'}} >
                {operation.atLocation && <Text style={{fontSize: 9}}>
                    <Text style = {{fontWeight: 'bold'}}>AT:</Text> {operation.atLocation.name}</Text>}
                {operation.fromLocation && <Text style={{fontSize: 9}}>
                    <Text style = {{fontWeight: 'bold'}} >FROM:</Text> {operation.fromLocation.name} </Text>}
                {operation.toLocation && <Text style={{fontSize: 9}}>
                    <Text style = {{fontWeight: 'bold'}}>TO</Text> {operation.toLocation.name} </Text>}
                <Text style={{fontSize: 9}}>
                    <Text style= {{fontWeight: 'bold'}}>REPORTED BY:</Text> {state.reportedBy} 
                    <Text style= {{color: colorScheme.tertiaryColor}} > {reportedTimeAgo} ago</Text> </Text>
            </View>
        }
      />
    );
  }

  _toggleCollapsed() {
    this.setState({isCollapsed: !this.state.isCollapsed})
  }

  render() {
    const { operation, reportedStates, isCollapsed } = this.state;
    const { rowNumber } = this.props;

    const topLineStyle = rowNumber == 0 ? [styles.topLine, styles.hiddenLine] : styles.topLine;

    return (
      <View style={styles.container}>
        <View style={styles.timeContainer}>
          <Text>{operation.startTime}</Text>
        </View>
        <View style={styles.timeline}>
          <View style={styles.line}>
            <View style={styles.bottomLine} />
          </View>
          <View style={styles.outerDot}>
            <View style={styles.innerCompleteDot} />
          </View>
          
        </View>
        <View
          style={{flex: 1, flexDirection: 'column', marginTop: 0, paddingTop: 0, paddingLeft: 15}}>
          <TouchableWithoutFeedback
            onPress={this._toggleCollapsed}>
            <View>
              <Text style={styles.operationHeader}>{operation.definitionId}</Text>
            </View>
          </TouchableWithoutFeedback>
          <Collapsible
            collapsed = {isCollapsed}
            renderHeader={() => header}
          >
            <List>    
              {
                Object.keys(reportedStates).map((stateDef) => this.renderStateRow(operation, reportedStates[stateDef]))
              }
            </List>
          </Collapsible>
        </View>
        
      </View>
    );
  }

  

  /**
   * Finds the most relevant statement, i.e the latest Estimate or the latest Actual. 
   * Actuals always overwrites estimates
   * 
   * @param {[Statement]} statements 
   *   an array of statements, all with the same statedefinition
   */
  findMostRelevantStatement(statements) {
      // sort statements based on reportedAt, latest reported first
      // TODO(johan) Kolla upp om listan av statements redan är sorterad efter reportedAt
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

      // if no actuals exist, take the first element
      return statements[0];
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colorScheme.primaryContainerColor,
    paddingTop: 5,
  },
  timeContainer: {
    width: 70,
    backgroundColor: colorScheme.secondaryContainerColor,
    borderRadius: 10,
    paddingRight: 5
  },
  operationHeader: {
    fontWeight: 'bold', 
    fontSize: 23
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
  }
});