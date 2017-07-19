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
import colorScheme from '../../../config/colors';
import TopHeader from '../../top-header-view';
import {getDateTimeString} from '../../../util/timeservices';
import {removeStringReportedBy, removeStringAtLocation} from '../../../util/stringutils';


class StateDetails extends Component {
    static navigationOptions = {
        header: <TopHeader title = 'Details' />
    }

 
    render () {
        const operation = this.props.navigation.state.params.operation;
        const { vessel, portCall} = this.props;
        const statements = this.props.navigation.state.params.statements;

        return(
            
        <View style= {styles.container} >
                {/* Vessel Name and Operation subtitle */}
                <View style={styles.headerContainer} >
                   {/* Vessel Name and avatar */}
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.headerTitleText}> {vessel.name} </Text>
                    </View>
                    {/* Operation subtitle */}
                        { operation.atLocation &&  <Text style={styles.headerSubText}> {operation.definitionId.replace('_',' ')} at {operation.atLocation.name} </Text>}
                        { operation.fromLocation &&  <Text style={styles.headerSubText}> {operation.definitionId.replace('_',' ')} from {operation.fromLocation.name} </Text>}
                        { operation.toLocation &&  <Text style={styles.headerSubText}> {operation.definitionId.replace('_',' ')} to {operation.toLocation.name} </Text>}
                        
                </View>
            {/* State List of this state */}
            <ScrollView style={styles.container}>
 

                {/*Warnings*/}
                {statements.warnings &&
                    statements.warnings.map(warning => {
                    return (
                        <View style={styles.warningContainer}>
                            <Icon name='warning' color={colorScheme.warningColor} size={24} paddingLeft={0}/>
                            <Text style={styles.warningText} >Warning: {warning.message}</Text>
                        </View>
                    );
                })} 


                {/*StateView*/}

                {statements.map( statement => {
                    return(
                        <View style={styles.stateContainer}> 
                            {/*TitleView*/}
                            <View style={styles.titleContainer}> 
                                <Text style={styles.stateTitleText}> {statements[0].stateDefinition} </Text>  

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
                                
                                <Text style={styles.stateSubTitleTextDisabled}>RELIABILITY: {statement.reliability}%</Text>

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
        color: colorScheme.primaryTextColor,
        fontSize: 14,
       
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

});

function mapStateToProps (state) {
    return {
        vessel: state.portCalls.vessel,
        portCall: state.portCalls.selectedPortCall,
    }
}

export default connect(mapStateToProps)(StateDetails);







                // <Button
                //     title='See more'
                //     onPress={() => this.props.navigation.navigate('DrawerOpen')}  
                // />