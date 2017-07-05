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

class OperationDetails extends Component {
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
                        {this.state.at && <Text style={{fontSize: 9}}>
                            <Text style = {{fontWeight: 'bold'}}>AT:</Text> {this.state.at.name}</Text>}
                        {this.state.from && <Text style={{fontSize: 9}}>
                            <Text style = {{fontWeight: 'bold'}} >FROM:</Text> {this.state.from.name} </Text>}
                        {this.state.to && <Text style={{fontSize: 9}}>
                            <Text style = {{fontWeight: 'bold'}}>TO</Text> {this.state.to.name} </Text>}
                        <Text style={{fontSize: 9}}>
                            <Text style= {{fontWeight: 'bold'}}>REPORTED BY:</Text> {state.reportedBy} 
                            <Text style= {{color: colorScheme.tertiaryColor}} > {reportedTimeAgo} ago</Text> </Text>
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

export default class TimeLineView extends Component {
    static navigationOptions = {
        header: <TopHeader title = 'Timeline' />
    }
    state = {
        operations: [],
    }

    constructor(props) {
        super(props);

        this.renderOperation = this.renderOperation.bind(this);
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        const { portCallId } = params;
        // const portCallId = 'urn:mrn:stm:portcdm:port_call:SEGOT:f8701ecf-5710-4c57-93a8-09aaf7eb953e';

        this.fetchData(portCallId)
            .then(this.sortOperations)
            .then(this.filterStatements)
            .then(sortedOperations => this.setState({operations: sortedOperations}))
            .catch(error => console.log(error));

    }

    renderOperation = (data, sectionID, rowId) => {
        const { operation } = data;
        const { reportedStates } = operation;

        return(
            <View>
                {/*Header*/}
                <Text h4>{operation.definitionId}</Text>
                {/*List of statements*/}
                <List>
                    {
                        Object.keys(reportedStates).map((stateDef, index) => <OperationDetails 
                                                                                    stateDef={stateDef} 
                                                                                    reportedStates={reportedStates} 
                                                                              />)
                    }
                </List>
            </View>
        );
    }

    operationToTimeLineData(operation) {
        return {
                    time: new Date(operation.startTime).toLocaleTimeString().slice(0, 5),
                    operation: operation
               }
    }

    render() {
        const { operations } = this.state;

        return(
            <TimeLine
                data={operations.map(this.operationToTimeLineData)}
                renderDetail={this.renderOperation}
            />
        );
    }

    fetchData(portCallId) {
        return portCDM.getPortCallOperations(portCallId)
            .then(result => result.json());
    }

    filterStatements(operations) {
        return Promise.all(operations.map(operation =>{
            let reportedStates = {};

            operation.statements.forEach(statement => {
                let stateDef = statement.stateDefinition;
                if(!reportedStates[stateDef]) {
                    reportedStates[stateDef] = [statement];
                 } else {
                    reportedStates[stateDef].push(statement);
                }
            });

            operation.reportedStates = reportedStates;
            return operation;
        }));
    }

    sortOperations(operations) {
        return operations.sort((a, b) => {
            let aTime = new Date(a.startTime);
            let bTime = new Date(b.startTime);

            if(aTime < bTime) return -1;
            if(aTime > bTime) return 1;
            else return 0;
        });
    }

}



// import React, {Component} from 'react';
// import {
//     View ,
//     Text,
//     StyleSheet,
//     ScrollView,
//     FlatList
// } from 'react-native';

// import TimeLine from 'react-native-timeline-listview';
// import portCDM from '../../services/backendservices';
// import colorScheme from '../../config/colors';


// export default class TimeLineView extends Component {
//     state = {
//         operations: []
//     }

//     constructor() {
//         super();
//         this.renderDetail = this.renderDetail.bind(this);
//     }

//     fromOperationToTimeLine(operation) {
//         return {
//             time: new Date(operation.startTime).toLocaleTimeString().slice(0, 5),
//             operation: operation
//         }
//     }

//     renderDetail(data, sectionId, rowIndex) {
//         const { operation } = data;
        
//         return (
//             <Operation operation = {operation}/> 
//         );
//     }

//     componentWillMount() {
//         const { params } = this.props.navigation.state;
        
//         portCDM.getPortCallOperations(params.portCallId)
//             .then(result => (result.json()) )
//             .then(result => (this.setState({operations: result})) )  
//             .catch(error => console.log(`ERROR in fetching portcall operations!!, ERRORMESSAGE: ${error}`))
//     }

//     render() {
//         const {operations} = this.state;
//         return(
//             <View style={styles.container}>
//                 <TimeLine
//                     data={operations.map(this.fromOperationToTimeLine)}
//                     circleSize={20}
//                     circleColor = {colorScheme.primaryColor}
//                     lineColor = {colorScheme.primaryColor}
//                     timeContainerStyle ={{minWidth: 52, marginTop: -5}}
//                     renderDetail={this.renderDetail}
//                     timeStyle = {{textAlign: 'center', 
//                         backgroundColor: colorScheme.primaryColor, 
//                         color: colorScheme.primaryTextColor, 
//                         fontWeight: 'bold',
//                         padding: 5, 
//                         borderRadius: 13, 
//                         minWidth: 60
//                     }}
//                     detailContainerStyle = {{
//                         paddingTop: 0
//                     }}
//                 />
//             </View>
//         );
//     }
// }

// class Operation extends Component {
    
//     state = {
//         at: {}
//     }

//     componentWillMount() {
//         portCDM.getLocation(this.props.operation.at)
//             .then(result => result.json())
//             .then(result => this.setState({at: result}))
//             .catch(error => console.log(error));
//     }

//     render() {
//         const {operation} = this.props;
//         const {statements} = operation;
//         const {at} = this.state;

//         // let arrivals = [{}, {}];
//         // let departure = [{}] 
//         let a = {};
//         // {
//         //     ArrivalVesselBerth: [{}, {}],
//         //     DepartureVesselBerth: [{}]

//         // }
//         // for(let i = 0; i < statements.length; i++) {
//         //     const statement = statements[i];
//         //     console.log(statement.stateDefinition);
//         //     console.log(!statement.stateDefinition);
//         //     console.log(a.stateDefinition);
//         //     if(!a[statement.stateDefinition]) {
//         //         const statementAsArray = new Array();
//         //         statementAsArray.push(statement)
//         //         a = {...a, [statement.stateDefinition] : statementAsArray };
//         //     } else {
//         //         // a[statements[i]].push(statements[0]);
//         //     }            
//         // }      

//         return( 
//             <View style = {styles.operationContainer}>
//                 <Text style = {styles.operationHeader}>{operation.definitionId} at {at.shortName} </Text>
//                 <FlatList
//                     data={operation.statements}
//                     renderItem={({item}) => <StatementRow statement={item} />}
//                     keyExtractor = {(item, index) => item.messageId}
//                 />
            
//             </View>
//         );
//     }
// }

// class StatementRow extends Component {
//     render() {
//         const {statement} = this.props; 
//         return(
//             <View style={styles.statementContainer}>
//                 <Text>{statement.stateDefinition}</Text>  
                

//                 <View style = {styles.timeRow}>
//                     <Text> { new Date(statement.time).toLocaleTimeString().slice(0,5)  } </Text>
//                     {statement.timeType === 'ACTUAL' && <Text>A</Text>}
//                     {statement.timeType === 'ESTIMATED' && <Text>E</Text>}
//                 </View>
//             </View>
//         );
//     }
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         marginTop: 40,
//         backgroundColor: colorScheme.backgroundColor 
//     },
//     operationContainer: {
//         paddingTop: 0,
//         backgroundColor: colorScheme.secondaryContainerColor 
//     },
//     statementContainer:{
//         flex: 1,
//         backgroundColor: colorScheme.secondaryContainerColor, 
//         borderWidth: 1,
//         borderColor: colorScheme.primaryColor, 
//         marginBottom: 10,
//         height: 60
//     },
//     operationHeader: {
//         fontWeight: 'bold'
//     },
//         operationDescription: {
//         fontStyle: 'italic'
//     },
//     statement: {
//         borderWidth: 1,
//         marginBottom: 10
//     },
//     timeRow: {
//         flex: 1,
//         flexDirection: 'row',
//         backgroundColor: colorScheme.primaryContainerColor,
//         alignItems: 'center'
//     }

// });


// // Colors: 
// // #c9c9c9 Dark grey
// // #e3e3e3 Light grey
// // #9ad3de Light blue
// // #89bdd3 Dark blue

// // NEW
// // Dark blue: #3a6ea5
// // Darkdark grey: #3e4552