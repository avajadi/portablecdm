import React, {Component} from 'react';

import { connect } from 'react-redux';

import { 
    View,
    StyleSheet,
    ScrollView,
    TouchableWithoutFeedback,
    Dimensions,
} from 'react-native';

import {
    Text,
    Button,
    List,
    ListItem,
    Divider,
    Icon,
    Avatar,
} from 'react-native-elements';

import Collapsible from 'react-native-collapsible';

import colorScheme from '../../../config/colors';
import TopHeader from '../../top-header-view';
import {getDateTimeString} from '../../../util/timeservices';

function removeStringReportedBy(string) {
    return string.replace('urn:mrn:legacy:user:', '')
}

class StateDetails extends Component {
    constructor(props) {
        super(props);

        const {operation, statements} = props.navigation.state.params;
        this.state = {
            operation: operation,
            statements: statements
        }
        this.gotoReportPortCall = this.gotoReportPortCall.bind(this);
    }

    

    gotoReportPortCall = (operation, statements) => {
        this.props.navigation.navigate('SendPortCall', {
            stateId: statements[0].stateDefinition, 
            atLocation: operation.atLocation, 
            fromLocation: operation.fromLocation, 
            toLocation: operation.toLocation
        });
    }

    render () {
        const { operation, statements } = this.state;
        const { vessel, portCall, getStateDefinition } = this.props;
        const stateDef = getStateDefinition(statements[0].stateDefinition);

        return(
            
        <View style= {styles.container} >
            <TopHeader title = 'Details' navigation={this.props.navigation} rightIconFunction={() => this.gotoReportPortCall(operation, statements)}/>
                {/* Vessel Name and Operation subtitle */}
                <View style={styles.headerContainer} >
                   {/* Vessel Name and avatar */}
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.headerTitleText}> {vessel.name} </Text>
                    </View>
                    {/* Operation subtitle */}
                        { operation.atLocation &&  <Text style={styles.headerSubText}> {operation.definitionId.replace(/_/g,' ')} at {operation.atLocation.name}</Text>}
                        { operation.fromLocation &&  <Text style={styles.headerSubText}> {operation.definitionId.replace(/_/g,' ')} from {operation.fromLocation.name}</Text>}
                        { operation.toLocation &&  <Text style={styles.headerSubText}> {operation.definitionId.replace(/_/g,' ')} to {operation.toLocation.name}</Text>}
                        
                </View>
            {/* State List of this state */}
            <ScrollView style={styles.container}>

                {/*Warnings*/}
                {statements.warnings &&
                    statements.warnings.map((warning, index) => {
                    return (
                        <View style={styles.warningContainer} key={index}>
                            <Icon name='warning' color={colorScheme.warningColor} size={24} paddingLeft={0}/>
                            <Text style={styles.warningText} >Warning: {warning.message}</Text>
                        </View>
                    );
                })} 


                {/*StateView*/}
                {statements.map( statement => {
                    return(
                        <View style={styles.stateContainer}
                            key={statement.messageId}> 
                            {/*TitleView*/}
                            <View style={styles.titleContainer}> 
                                {stateDef && <Text style={styles.stateTitleText}> {stateDef.Name} </Text>  }
                                {!stateDef && <Text style={styles.stateTitleText}> {statement.stateDefinition} </Text>  }
                            </View>

                            {/*Dividers that change colors*/}
                            {statement.timeType === 'ACTUAL' && 
                                <Divider style={{height: 5 , backgroundColor: colorScheme.actualColor}}/> }
                            {statement.timeType === 'ESTIMATED' &&  
                                <Divider style={{height: 5, backgroundColor: colorScheme.estimateColor}}/> } 
                            {!statement.timeType &&
                                <Divider style={{height: 5 , backgroundColor: colorScheme.secondaryColor}}/>}

                            {/*DetailContainer*/}
                            <View style={styles.detailContainer}>
                                <View style={styles.detailView}> 
                                    <Text style={styles.stateSubTitleText}>TIME: </Text> 
                                    <Text style={styles.detailText}>{getDateTimeString(new Date(statement.time))}  </Text>
                                    {statement.timeType === 'ACTUAL' && 
                                        <View style={styles.actualContainer}>
                                            <Text style={styles.actualText}>A</Text>
                                        </View>  }
                                    {statement.timeType === 'ESTIMATED' && 
                                        <View style={styles.estimateContainer}>
                                            <Text style={styles.estimateText}>E</Text>
                                        </View>}
                                </View>

                                {operation.atLocation && 
                                <View style={styles.detailView}> 
                                    <Text style={styles.stateSubTitleText}>AT: </Text>
                                    <Text style={styles.detailText}>{operation.atLocation.name}</Text>
                                </View>}
                                {operation.fromLocation && 
                                <View style={styles.detailView}> 
                                    <Text style={styles.stateSubTitleText}>FROM: </Text>
                                    <Text style={styles.detailText}>{operation.fromLocation.name}</Text>        
                                </View>}
                                {operation.toLocation && 
                                <View style={styles.detailView}> 
                                    <Text style={styles.stateSubTitleText}>TO: </Text>
                                    <Text style={styles.detailText}>{operation.toLocation.name}</Text>        
                                </View>}
                                
                                <View style={styles.detailView}> 
                                    <Text style={styles.stateSubTitleText}>REPORTED BY: </Text>
                                    <Text style={styles.detailText}>{removeStringReportedBy(statement.reportedBy)} </Text>  
                                </View>
                                <View style={styles.detailView}> 
                                    <Text style={styles.stateSubTitleText}>REPORTED AT: </Text>  
                                    <Text style={styles.detailText}>{getDateTimeString(new Date(statement.reportedAt))}</Text>        
                                </View>
                                
                                {/* Reliability for the message, and reliability changes  */}
                                {!!statement.reliabilityChanges &&
                                <View style={styles.detailView}> 
                                    <Text style={styles.stateSubTitleText}>RELIABILITY: </Text>  
                                    <Text style={styles.detailText}>{statement.reliability}%</Text>        
                                </View>
                                }
                                {!!statement.reliabilityChanges && statement.reliabilityChanges
                                        .sort((a, b) => a.reliability - b.reliability)
                                        .map((change, i) => (
                                            <Text 
                                                key={i}
                                                style={styles.reliabilityChangeText}
                                            >
                                                {Math.floor(change.reliability*100)}% : {change.reason}
                                            </Text>
                                ))}
                            </View>     
                        </View>
                    )
                } )} 
            </ScrollView>
        </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: colorScheme.backgroundColor,
        flex: 1,
    },
    headerContainer: {
        backgroundColor: colorScheme.primaryColor,
        alignItems: 'center',
    },
    headerTitleText: {
        textAlign: 'center',
        color: colorScheme.primaryTextColor,
        fontSize: 20,
    },
    headerSubText: {
        textAlign: 'center',
        color: colorScheme.secondaryContainerColor,
        fontSize: 12,
        paddingBottom: 10,
    },
    stateContainer: {
        backgroundColor: colorScheme.primaryContainerColor,
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 0,
        borderColor: colorScheme.sidebarColor,
        borderWidth: 1,
        borderRadius: 10,
    },
    stateTitleText: {
        fontWeight: 'bold',
        color: colorScheme.quaternaryTextColor,
        fontSize: 14,
        textAlign: 'center',
    },
    stateSubTitleText: {
        fontWeight: 'bold',
        color: colorScheme.quaternaryTextColor,
        fontSize: 12,
        paddingLeft: 5,
    },
    stateSubTitleTextDisabled: {
        fontWeight: 'bold',
        color: colorScheme.tertiaryTextColor,
        fontSize: 12,
        paddingLeft: 5,
    },
    detailText: {
        color: colorScheme.quaternaryTextColor, 
        fontSize: 12,
        paddingLeft: 5,
    },
    titleContainer: {
        backgroundColor: colorScheme.primaryContainerColor,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
    },
    detailContainer: {
        backgroundColor: colorScheme.primaryContainerColor,
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
    },
    actualText: {
        color: colorScheme.primaryTextColor,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 12,
    },
    actualContainer: {
        backgroundColor: colorScheme.actualColor,
        borderRadius: 9,
        width: 18,
        height: 18,
        justifyContent: 'center',
        overflow: 'hidden',
        alignItems: 'center',
    },
    estimateText: {
        color: colorScheme.primaryTextColor,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 12,
    },
    estimateContainer: {
        backgroundColor: colorScheme.estimateColor,
        borderRadius: 9,
        width: 18,
        height: 18,
        justifyContent: 'center',
        overflow: 'hidden',
        alignItems: 'center',
    },  
    detailView: {
        backgroundColor: colorScheme.primaryContainerColor,
        flexDirection: 'row',
        alignItems: 'center',
     //   justifyContent: 'space-between',
    },
    warningContainer: {
        backgroundColor: colorScheme.primaryContainerColor, 
        flexDirection: 'row',
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 0, 
        borderColor: colorScheme.warningColor,
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
        alignItems: 'center',
       // justifyContent: 'center',
        paddingRight: 10,
    },
    warningText: {
        paddingLeft: 10, 
        color: colorScheme.quaternaryTextColor,
        fontSize: 12,
     //   paddingRight: 10,
    },
    reliabilityChangeText: {
        fontSize: 10,
        marginLeft: 10
    }

});

function mapStateToProps (state) {
    return {
        vessel: state.portCalls.vessel,
        portCall: state.portCalls.selectedPortCall,
        getStateDefinition: state.states.stateById
    }
}

export default connect(mapStateToProps)(StateDetails);