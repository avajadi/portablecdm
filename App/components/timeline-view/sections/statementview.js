import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    View,
    Text,
    StyleSheet,
    Alert,
} from 'react-native';

import {
    Icon,
    Divider,
} from 'react-native-elements';

import {
    withdrawStatement,
} from '../../../actions';

import {getDateTimeString} from '../../../util/timeservices';
import { cleanURN } from '../../../util/stringUtils';

import colorScheme from '../../../config/colors';

class StatementView extends Component {

    constructor(props) {
        super(props);

        this.statementReportedByMe = this.statementReportedByMe.bind(this);
        this.handleWithdrawStatement = this.handleWithdrawStatement.bind(this);
    }

    // need to be revisited if/when supporting keycloak
    statementReportedByMe = (username) => {
        return this.props.loggedinUserName === cleanURN(username);
    }

    handleWithdrawStatement = (statement) => {
        Alert.alert(
            'Confirmation',
            'Are you sure you wish to withdraw this statement?',
            [
                {text: 'No'},
                {text: 'Yes', onPress: () => {
                    this.props.withdrawStatement(statement)
                        .then(err => {
                            if(err) {
                                console.log(JSON.stringify(err));
                                Alert.alert(
                                    'Failed withdrawing statement',
                                    err[0].message,
                                    [{text: 'Ok'}]
                                )
                            } else {
                                Alert.alert(
                                    'Statement withdrawn',
                                    null,
                                    [{text: 'Ok', onPress: () => {
                                        this.props.navigation.goBack();
                                    }}]
                                )
                            }
                        })
                }}
            ]
        );
    };

    render() {
        const withdrawSupported = this.props.instanceInfo.hasWithdraw;
        const { statement, stateDef } = this.props;
        const withdrawn = (withdrawSupported && statement.isWithdrawn);
        const additionalStyles = withdrawn ? styles.withdrawn : {};
        // let additionalStyles = {};
        
        return (
            <View style={[styles.stateContainer, additionalStyles]}
                key={statement.messageId}> 
                {/*TitleView*/}
                <View style={[styles.titleContainer, additionalStyles]}> 
                    {stateDef && <Text style={styles.stateTitleText}> {stateDef.Name.replace(/_/g, ' ')} </Text>  }
                    {!stateDef && <Text style={styles.stateTitleText}> {statement.stateDefinition.replace(/_/g, ' ')} </Text>  }
                </View>

                {/*Dividers that change colors*/}
                {statement.timeType === 'ACTUAL' && 
                    <Divider style={{height: 5 , backgroundColor: withdrawn ? 'grey' : colorScheme.actualColor}}/> }
                {statement.timeType === 'ESTIMATED' &&  
                    <Divider style={{height: 5, backgroundColor: withdrawn ? 'grey' : colorScheme.estimateColor}}/> } 
                {!statement.timeType &&
                    <Divider style={{height: 5 , backgroundColor: withdrawn ? 'grey' : colorScheme.secondaryColor}}/>}


                <View style={{flexDirection: 'row'}}>
                    {/*DetailContainer*/}
                    <View style={[styles.detailContainer, {flex: 4}, additionalStyles]}>
                        <View style={[styles.detailView, additionalStyles]}> 
                            <Text style={styles.stateSubTitleText}>TIME: </Text> 
                            <Text style={styles.detailText}>{getDateTimeString(new Date(statement.time))}  </Text>
                            {statement.timeType === 'ACTUAL' && 
                                <View style={[styles.actualContainer]}>
                                    <Text style={styles.actualText}>A</Text>
                                </View>  }
                            {statement.timeType === 'ESTIMATED' && 
                                <View style={[styles.estimateContainer]}>
                                    <Text style={styles.estimateText}>E</Text>
                                </View>}
                        </View>

                        {statement.atLocation && 
                        <View style={[styles.detailView, additionalStyles]}> 
                            <Text style={styles.stateSubTitleText}>AT: </Text>
                            <Text style={styles.detailText}>{statement.atLocation.name}</Text>
                        </View>}
                        {statement.fromLocation && 
                        <View style={[styles.detailView, additionalStyles]}> 
                            <Text style={styles.stateSubTitleText}>FROM: </Text>
                            <Text style={styles.detailText}>{statement.fromLocation.name}</Text>        
                        </View>}
                        {statement.toLocation && 
                        <View style={[styles.detailView, additionalStyles]}> 
                            <Text style={styles.stateSubTitleText}>TO: </Text>
                            <Text style={styles.detailText}>{statement.toLocation.name}</Text>        
                        </View>}
                        
                        <View style={[styles.detailView, additionalStyles]}> 
                            <Text style={styles.stateSubTitleText}>REPORTED BY: </Text>
                            <Text style={styles.detailText}>{cleanURN(statement.reportedBy)} </Text>  
                        </View>
                        <View style={[styles.detailView, additionalStyles]}> 
                            <Text style={styles.stateSubTitleText}>REPORTED AT: </Text>  
                            <Text style={styles.detailText}>{getDateTimeString(new Date(statement.reportedAt))}</Text>        
                        </View>
                        {!!statement.comment && <View style={[styles.detailView, additionalStyles]}> 
                            <Text style={styles.stateSubTitleText}>COMMENT: </Text>  
                            <Text style={styles.detailText}>{statement.comment}</Text>        
                        </View>
                        }
                        
                        {/* Reliability for the message, and reliability changes  */}
                        {!!statement.reliabilityChanges &&
                        <View style={[styles.detailView, additionalStyles]}> 
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
                        {!!withdrawn && <View style={[styles.detailView, additionalStyles]}>
                                <Text style={[styles.stateSubTitleText, styles.withdrawnText]}>Withdrawn</Text>
                            </View>
                        }

                    </View>
                    {!!withdrawSupported && this.statementReportedByMe(statement.reportedBy) && <View style={styles.withdrawIconContainer}>
                        <Icon
                            name='minus-circle'
                            type='font-awesome'
                            color='red'
                            iconStyle={{alignSelf: 'center'}}
                            onPress={() => this.handleWithdrawStatement(statement)}
                        />
                    </View>}
                </View>     
            </View>
        )
    }

}

StatementView.propTypes = {
    statement: PropTypes.object.isRequired,
    stateDef: PropTypes.object,
}

            /*
            container
            headerContainer
            headerTitleText
            headerSubText
            warningContainer
            warningText
            */

const styles = StyleSheet.create({
    withdrawIconContainer: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center'
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
    },
    withdrawn: {
        backgroundColor: 'grey'
    },
    withdrawnText: {
        color: 'red'        
    }

});

function mapStateToProps (state) {
    return {
        instanceInfo: state.settings.instance,
        loggedinUserName: state.settings.connection.username,
    }
}

export default connect(mapStateToProps, {withdrawStatement})(StatementView);