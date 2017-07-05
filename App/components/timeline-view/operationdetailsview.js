import React, { Component } from 'react';
import {
    View,
    StyleSheet,
} from 'react-native'

import TimeLine from 'react-native-timeline-listview';
import { 
    List, 
    ListItem, 
    Icon,
    Text
} from 'react-native-elements';

import portCDM from '../../services/backendservices';
import { getTimeDifferenceString } from '../../util/timeservices';
import colorScheme from '../../config/colors';
import TopHeader from '../top-header-view';

export default class OperationDetails extends Component {
    state = {
        at: null,
        to: null,
        from: null
    }

    render() {
        const { reportedStates, stateDef } = this.props;

        const allOfTheseStatements = reportedStates[stateDef];
        const state = this.findMostRelevantStatement(allOfTheseStatements); // this is the most relevant message for this state

        const reportedTimeAgo = getTimeDifferenceString(new Date(state.reportedAt));

        if(state.at) {
            portCDM.getLocation(state.at)
                .then(result => result.json())
                .then(location => this.setState({at: location}));
        }
        if(state.from) {
            portCDM.getLocation(state.from)
                .then(result => result.json())
                .then(location => this.setState({from: location}));
        }
        if(state.to) {
            portCDM.getLocation(state.to)
                .then(result => result.json())
                .then(location => this.setState({to: location}));
        }
        // state.timeType = ESTIMATED || ACTUAL
        // state.time = tiden som man estimerade 2014-12-32T03:00:00Z
        // state.stateDefinition = id't på detta state (ex: Anchoring_Completed)
        // state.to
        // state.from
        // state.at  Dessa tre är locations, kolla på specification.portcdm.eu location registry för att se vad de innehåller
        // state.reportedBy : användaren som rapporterade saken
        // state.reportedAt : när denna sak rapporterades in


        return (
            <ListItem
                key={state.messageId}
                title = {
                    <View style={{flexDirection:'row'}}>
                        <Text>{new Date(state.time).toTimeString().slice(0, 5)} </Text>
                        {state.timeType === 'ACTUAL' && <Icon name='directions-boat' />}
                        {state.timeType === 'ESTIMATED' && <Icon name='rowing'/>}
                        <Text>{state.stateDefinition}</Text>
                    </View>
                }
                subtitle = {
                    <View>
                        {this.state.at && <Text style={{fontSize: 9}}>AT {this.state.at.name}</Text>}
                        {this.state.from && <Text style={{fontSize: 9}}>FROM {this.state.from.name} </Text>}
                        {this.state.to && <Text style={{fontSize: 9}}>TO {this.state.to.name} </Text>}
                        <Text style={{fontSize: 9}}>Reported by: {state.reportedBy} {reportedTimeAgo} ago</Text>
                    </View>
                }
            />
        )                          
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

