import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    Text,
} from 'react-native';
import PropTypes from 'prop-types';

import {
    ListItem,
    Icon,
} from 'react-native-elements';

import colorScheme from '../../../config/colors';
import { getTimeString, getTimeDifferenceString } from '../../../util/timeservices'
import { cleanURN } from '../../../util/stringUtils';

class RelevantStatementView extends Component {

    render() {

        const {
            allOfTheseStatements, 
            mostRelevantStatement, 
            displayOnTimeProbabilityTreshold, 
            stateDef,
            operation,
            navigate,
        } = this.props;
        const { warnings } = allOfTheseStatements;
        const stateToDisplay = mostRelevantStatement;
        const reportedTimeAgo = getTimeDifferenceString(new Date(stateToDisplay.reportedAt));


        let stateCount = 0;
        if (stateToDisplay.timeType === 'ACTUAL') {
          stateCount = allOfTheseStatements.filter((statement)=> statement.timeType === 'ACTUAL').length;
        }
        else if (stateToDisplay.timeType === 'ESTIMATED') {
          stateCount = allOfTheseStatements.filter((statement)=> statement.timeType === 'ESTIMATED').length;
        }
        else {
          stateCount = allOfTheseStatements.length;
        }


        return (
            <ListItem
                containerStyle = {{
                borderTopWidth: 0,
                borderBottomWidth: 0,
                }}
                
                rightIcon = { <Icon
                                color = {colorScheme.primaryColor}
                                name='add-circle'
                                size={35}
                                onPress={() => this.props.plusFunction(stateToDisplay.stateDefinition, stateToDisplay)}
                                />
                }
                title = {
                    <TouchableWithoutFeedback 
                        style={{flexDirection:'column'}}
                        onPress={ () => navigate('StateDetails', {operation: operation, statements: allOfTheseStatements} ) }
                    >
                    <View>  
                        <View style={{flexDirection: 'row'}}>
                            {!stateDef && <Text style={styles.stateDisplayTitle} >{stateToDisplay.stateDefinition}</Text>}
                            {stateDef && <Text style={styles.stateDisplayTitle} >{stateDef.Name}</Text>}

                            {!!warnings && <Icon name='warning' color={colorScheme.warningColor} size={16} />} 
                        </View>
                        <View style= {{flexDirection: 'row'}} >
                            <Text style = {{color: colorScheme.tertiaryColor, fontWeight: 'bold'}} >{getTimeString(new Date(stateToDisplay.time))} </Text>
                            {stateToDisplay.timeType === 'ACTUAL' && <View style={styles.actualContainer}>
                                                                            <Text style={styles.actualText}>A</Text>
                                                                    </View>
                            }
                            {stateToDisplay.timeType === 'ESTIMATED' && <View style={styles.estimateContainer}>
                                                                            <Text style={styles.estimateText}>E</Text>
                                                                        </View>
                            }
                            {stateToDisplay.timeType === 'TARGET' && <View style={styles.targetContainer}>
                                                                            <Text style={styles.estimateText}>T</Text>
                                                                    </View>
                            }
                            {stateToDisplay.timeType === 'RECOMMENDED' && <View style={styles.recommendedContainer}>
                                                                            <Text style={styles.estimateText}>R</Text>
                                                                    </View>
                            }
                        </View>
                    </View>
                    </TouchableWithoutFeedback>
                }
                subtitle = {
                    <View style={{flexDirection: 'column'}} >
                        {stateToDisplay.atLocation && <Text style={{fontSize: 9}}>
                        <Text style = {styles.stateDisplaySubTitle}>AT: </Text>{stateToDisplay.atLocation.name}</Text>}
                        {stateToDisplay.fromLocation && <Text style={{fontSize: 9}}>
                        <Text style = {styles.stateDisplaySubTitle} >FROM: </Text>{stateToDisplay.fromLocation.name}</Text>}
                        {stateToDisplay.toLocation && <Text style={{fontSize: 9}}>
                        <Text style = {styles.stateDisplaySubTitle}>TO: </Text>{stateToDisplay.toLocation.name}</Text>}
                        <Text style={{fontSize: 9}}>
                        {/*Doesnt work!*/}
                        <Text style= {styles.stateDisplaySubTitle}>REPORTED BY: </Text>{cleanURN(stateToDisplay.reportedBy)} 
                        <Text style= {{color: colorScheme.tertiaryColor}} > {reportedTimeAgo} ago</Text> </Text>
                        {(stateToDisplay.reliability >= 0) && <Text style={{fontSize: 9}}>
                        <Text style = {styles.stateDisplaySubTitle}>RELIABILITY: </Text>{stateToDisplay.reliability}%</Text> }
                        
                        {(!!allOfTheseStatements.onTimeProbability && allOfTheseStatements.onTimeProbability.accuracy > displayOnTimeProbabilityTreshold) && 
                            <View>
                            <Text style={{fontSize: 9}}>
                                <Text style = {styles.stateDisplaySubTitle}>ON TIME PROBABILITY: </Text>{allOfTheseStatements.onTimeProbability.probability}%
                            </Text>
                            <Text style={{fontSize: 9, marginLeft: 10}}>
                                <Text style={styles.stateDisplaySubTitle}>REASON: </Text>{allOfTheseStatements.onTimeProbability.reason}
                            </Text>
                            <Text style={{fontSize: 9, marginLeft: 10}}>
                                <Text style={styles.stateDisplaySubTitle}>ACCURACY: </Text>{allOfTheseStatements.onTimeProbability.accuracy}%
                            </Text>
                            </View>
                        }
                            
                    </View>
                }
                badge = {
                {value: stateCount, textStyle: {color: 'black', fontSize: 10, fontWeight: 'bold'}, 
                containerStyle: {backgroundColor: colorScheme.backgroundColor} , // 30
                wrapperStyle: {justifyContent: 'center'},
                }
                }
            />
        )
    }
}

RelevantStatementView.propTypes = {
    plusFunction: PropTypes.func.isRequired,
    
};


export default RelevantStatementView;

const styles = StyleSheet.create({
    actualText: {
        color: colorScheme.primaryTextColor,
        textAlign: 'center',
        fontWeight: 'bold',
      },
        actualContainer: {
        backgroundColor: colorScheme.actualColor,
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        overflow: 'hidden',
        alignItems: 'center',
      },
      estimateText: {
        color: colorScheme.primaryTextColor,
        textAlign: 'center',
        fontWeight: 'bold',
      },
      estimateContainer: {
        backgroundColor: colorScheme.estimateColor,
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        overflow: 'hidden',
        alignItems: 'center',
      },
      stateDisplayTitle: {
        fontWeight: 'bold', 
        color: colorScheme.quaternaryTextColor,
      },
      stateDisplaySubTitle: {
        fontWeight: 'bold',
        color: colorScheme.quaternaryTextColor,
        fontSize: 9,
      }, 
});