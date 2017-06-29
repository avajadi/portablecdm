import React, {Component} from 'react';
import {
    View ,
    Text,
    StyleSheet,
    ScrollView,
    FlatList
} from 'react-native';
import TimeLine from 'react-native-timeline-listview';
import portCDM from '../../services/backendservices';


export default class TimeLineView extends Component {
    state = {
        operations: []
    }

    constructor() {
        super();
        this.renderDetail = this.renderDetail.bind(this);
    }

    fromOperationToTimeLine(operation) {
        return {
            time: new Date(operation.startTime).toLocaleTimeString().slice(0, 5),
            operation: operation
        }
    }

    renderDetail(data, sectionId, rowIndex) {
        const { operation } = data;
        
        return (
            <Operation operation = {operation}/> 
        );
    }

    componentWillMount() {
        const { params } = this.props.navigation.state;
        
        portCDM.getPortCallOperations(params.portCallId)
            .then(result => (result.json()) )
            .then(result => (this.setState({operations: result})) )  
            .catch(error => console.log(`ERROR in fetching portcall operations!!, ERRORMESSAGE: ${error}`))
    }

    render() {
        const {operations} = this.state;
        return(
            <View style={styles.container}>
                <TimeLine
                    data={operations.map(this.fromOperationToTimeLine)}
                    circleSize={20}
                    circleColor = '#89bdd3'
                    lineColor = '#89bdd3'
                    timeContainerStyle ={{minWidth: 52, marginTop: -5}}
                    renderDetail={this.renderDetail}
                    timeStyle = {{textAlign: 'center', 
                        backgroundColor: '#89bdd3', 
                        color: 'white', 
                        fontWeight: 'bold',
                        padding: 5, 
                        borderRadius: 13, 
                        minWidth: 60
                    }}
                    detailContainerStyle = {{
                        paddingTop: 0
                    }}
                />
            </View>
        );
    }
}

class Operation extends Component {
    
    state = {
        at: {}
    }

    componentWillMount() {
        portCDM.getLocation(this.props.operation.at)
            .then(result => result.json())
            .then(result => this.setState({at: result}))
            .catch(error => console.log(error));
    }

    render() {
        const {operation} = this.props;
        const {statements} = operation;
        const {at} = this.state;

        // let arrivals = [{}, {}];
        // let departure = [{}] 
        let a = {};
        // {
        //     ArrivalVesselBerth: [{}, {}],
        //     DepartureVesselBerth: [{}]

        // }
        // for(let i = 0; i < statements.length; i++) {
        //     const statement = statements[i];
        //     console.log(statement.stateDefinition);
        //     console.log(!statement.stateDefinition);
        //     console.log(a.stateDefinition);
        //     if(!a[statement.stateDefinition]) {
        //         const statementAsArray = new Array();
        //         statementAsArray.push(statement)
        //         a = {...a, [statement.stateDefinition] : statementAsArray };
        //     } else {
        //         // a[statements[i]].push(statements[0]);
        //     }            
        // }      

        return( 
            <View style = {styles.operationContainer}>
                <Text style = {styles.operationHeader}>{operation.definitionId} at {at.shortName} </Text>
                <FlatList
                    data={operation.statements}
                    renderItem={({item}) => <StatementRow statement={item} />}
                    keyExtractor = {(item, index) => item.messageId}
                />
            
            </View>
        );
    }
}

class StatementRow extends Component {
    render() {
        const {statement} = this.props; 
        return(
            <View style={styles.statementContainer}>
                <Text>{statement.stateDefinition}</Text>  
                

                <View style = {styles.timeRow}>
                    <Text> { new Date(statement.time).toLocaleTimeString().slice(0,5)  } </Text>
                    {statement.timeType === 'ACTUAL' && <Text>A</Text>}
                    {statement.timeType === 'ESTIMATED' && <Text>E</Text>}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40,
        backgroundColor: '#e3e3e3'
    },
    operationContainer: {
        paddingTop: 0,
        backgroundColor: 'white'
    },
    statementContainer:{
        flex: 1,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#89bdd3',
        marginBottom: 10,
        height: 60
    },
    operationHeader: {
        fontWeight: 'bold'
    },
        operationDescription: {
        fontStyle: 'italic'
    },
    statement: {
        borderWidth: 1,
        marginBottom: 10
    },
    timeRow: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'center'
    }

});


// Colors: 
// #c9c9c9 Dark grey
// #e3e3e3 Light grey
// #9ad3de Light blue
// #89bdd3 Dark blue