import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    StyleSheet,
    View,
    Text,
    TouchableWithoutFeedback,
    Modal,
    ScrollView,
} from 'react-native';

import {
    Icon,
    Button
} from 'react-native-elements';

import StatementDetails from './StatementDetails';

import { getDateTimeString, getDateString, getTimeString } from '../../../util/timeservices';
import colorScheme from '../../../config/colors';


const sortStatements = (statements) => {
    const statementsCopy = JSON.parse(JSON.stringify(statements)); // kanske ska göra det här?

    // First order by time
    statementsCopy.sort((a, b) => {
        let aTime = new Date(a.time);
        let bTime = new Date(b.time);

        return bTime - aTime;
    });

    // Then bubble up actuals
    statementsCopy.sort((a, b) => {
  
        if(b.timeType === 'ACTUAL') {
            return 1;
        }
  
        if(a.timeType === 'ACTUAL') {
            return -1;
        }

  

        return 0;
    });


    return statementsCopy;
}


const EventDetails = (props) => {
    const { event } = props;

    const actualIcon = (<View style={[styles.actualContainer]}>
                            <Text style={styles.actualText}>A</Text>
                        </View>);

    const estimateIcon = (<View style={[styles.estimateContainer]}>
                            <Text style={styles.estimateText}>E</Text>
                          </View>);

    return(
        <Modal
            visible={props.isVisible}
            onRequestClose={props.onClose}
            animationType='fade'
            transparent={true}
        >
            {/* Fix the background stuff */}
            <View style={styles.outerContainer}>
                {/* The actual modal window */}
                <View style={styles.innerContainer}>
                    {/* Header */}
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>{event.vessel.name}</Text>
                    </View>
                    {/* Main view */}
                    <ScrollView>
                        <View style={styles.tableHeaderContainer}>
                            <Text key={-1} style={[styles.statementHeaderText]}>Arrival Vessel Berth</Text>
                        </View>
                        {sortStatements(event.arrivalStatements).map((statement, index) => <StatementDetails key={index} statement={statement} /> )}

                        <View style={styles.tableHeaderContainer}>
                            <Text key={-2} style={[styles.statementHeaderText]}>Departure Vessel Berth</Text>
                        </View>
                        {sortStatements(event.departureStatements).map((statement, index) => <StatementDetails key={index} statement={statement} /> )}
                    </ScrollView>


                    {/* Bottom row, with buttons */}
                    <View style={styles.buttonsContainer}>
                        <TouchableWithoutFeedback
                            onPress={() => props.onViewPortCall(event.portCallId)}
                        >
                            <View style={[styles.button, {borderBottomLeftRadius: 10}]}>
                                <Text style={styles.headerText}>View portcall details</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback
                            onPress={props.onClose}
                        >
                            <View style={[styles.button, {borderBottomRightRadius: 10, marginLeft: 5}]}>
                                <Text style={styles.headerText}>Ok</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

EventDetails.propTypes = {
    event: PropTypes.object.isRequired,
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onViewPortCall: PropTypes.func.isRequired,
}

export default EventDetails;

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#00000080',
    },
    innerContainer: {
        flexDirection: 'column',
        borderRadius: 10,
        width: 400,
        height: 300,
        backgroundColor: colorScheme.primaryContainerColor,
        justifyContent: 'space-between',
    },
    headerContainer: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        height: 30,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: colorScheme.primaryColor,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    headerText: {
        alignSelf: 'center',
        color: colorScheme.primaryTextColor,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        height: 40,
        backgroundColor: colorScheme.primaryColor,
    },
    statementHeaderText: {
        fontSize: 15,
        fontStyle: 'italic',
        flex: 1,
        marginHorizontal: 7,
        textAlign: 'left', 
        marginLeft: 10,
    },
    tableHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomWidth: 1,
        borderColor: 'black',
        marginHorizontal: 5,
        marginBottom: 10,
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

});