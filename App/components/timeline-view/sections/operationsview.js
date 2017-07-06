import React, { Component } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import {
  List,
  ListItem,
  Text,
  Icon
} from 'react-native-elements';

import Accordion from 'react-native-accordion';

import {getTimeDifferenceString} from '../../../util/timeservices'
import colorScheme from '../../../config/colors';

export default class OperationView extends Component {

  constructor(props) {
    super(props);

    const { operation } = this.props;
    const { reportedStates } = operation;

    this.state = {
      operation: operation,
      reportedStates: reportedStates,

    }

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

  render() {
    const { operation, reportedStates } = this.state;
    const { rowNumber } = this.props;

    const topLineStyle = rowNumber == 0 ? [styles.topLine, styles.hiddenLine] : styles.topLine;
    
    let header = (
      <View>
        <Text h3>{operation.definitionId}</Text>
      </View>
    );

    let content = (
      <View>
        <List
          containerStyle = {{borderTopWidth: 0, borderBottomWidth: 0, marginTop: 0}}>
          {
            Object.keys(reportedStates).map((stateDef) => this.renderStateRow(operation, reportedStates[stateDef]))
          }
        </List>
      </View>
    );

    return (
      <View style={styles.container}>
        <View style={{width: 70}}>
          {/* TIME HERE! */}
        </View>
        <View style={styles.timeline}>
          <View style={styles.line}>
            {rowNumber != 0 && <View style={topLineStyle} />}
            <View style={styles.bottomLine} />
          </View>
          <View style={styles.completeDot} />
        </View>
        <View
          style={{flex: 1, flexDirection: 'column', marginTop: 0, paddingTop: 0}}>
          <Accordion
            style={{alignSelf: 'stretch', paddingLeft: 10}}
            header={header}
            content={content}
          />
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
    backgroundColor: 'black',
  },
  bottomLine: {
    flex: 1,
    width: 4,
    backgroundColor: 'black',
  },
  hiddenLine: {
    width: 0,
  },
  completeDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'black',
    marginTop: 15,
  },
  activedot: {

  },
  futureDot: {

  }
});