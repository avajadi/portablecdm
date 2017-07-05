import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableWithoutFeedback,
    ListView
} from 'react-native'

// import TimeLine from 'react-native-timeline-listview';
import { 
    List, 
    ListItem, 
    Icon,
    Text
} from 'react-native-elements';

import renderIf from '../../util/renderif';
import portCDM from '../../services/backendservices';
import { getTimeDifferenceString } from '../../util/timeservices';
import colorScheme from '../../config/colors';
import TopHeader from '../top-header-view';
import OperationView from './sections/operationsview';


export default class TimeLineView extends Component {
    static navigationOptions = {
        header: <TopHeader title = 'Timeline' />
    }

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        
        this.state = {
            // operations: [],
            loading: true,
            dataSource: ds.cloneWithRows(['row 1, row 2'])
        }

        // this.state.dataSource = ds.cloneWithRows();

    }

    componentDidMount() {
        // const { params } = this.props.navigation.state;
        // const { portCallId } = params;
        const portCallId = 'urn:mrn:stm:portcdm:port_call:SEGOT:741e183d-fbf4-41bf-87b2-5146a4f4e978';

        const { dataSource } = this.state;

        this.fetchData(portCallId)
            .then(this.sortOperations)
            .then(this.filterStatements)
            .then(this.addLocationsToOperations)
            .then(operations => {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(operations), 
                    loading: false
                })
            })
            .catch(error => console.log(error));

    }

    render() {
        // const { operations } = this.state;

        return(
            <View>
                {!!this.state.loading && <Text>Loading!</Text>}
                {
                    !this.state.loading && <ListView
                                                enableEmptySections
                                                dataSource={this.state.dataSource} 
                                                renderRow={(data) => <OperationView operation={data}/>}                
                                            />
                }
            </View>
        );
    }

    fetchData(portCallId) {
        return portCDM.getPortCallOperations(portCallId)
            .then(result => result.json());
    }

    addLocationsToOperations(operations) {
        return Promise.all(operations.map(async operation => {
            try {
                if(operation.at) {
                    operation.atLocation = await portCDM.getLocation(operation.at)
                                                .then(result => result.json());
                    
                }

                if(operation.from) {
                    operation.fromLocation = await portCDM.getLocation(operation.from)
                                                    .then(result => result.json());
                }

                if(operation.to) {
                    operation.toLocation = await portCDM.getLocation(operation.to)
                                                    .then(result => result.json());
                }
            } catch(error) {
                console.log(error);
            }finally {
                // operation.key = operation.operationId;
                return operation;
            }
        }));
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