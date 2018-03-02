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

import { getTimeString } from '../../../util/timeservices';
import colorScheme from '../../../config/colors';


const EventDetails = (props) => {
    const { event } = props;

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
                        <Text key={-1} style={[styles.statementHeaderText, {textAlign: 'left'}]}>Arrival Vessel Berth</Text>
                        {event.arrivalStatements.map((statement, index) => {
                            if('arrival_vessel_berth' !== statement.stateDefinition.toLowerCase()) {
                                console.log('wrong state definition in arrivalStatements!');
                            }
                            return <StatementDetails key={index} statement={statement} />;
                        })}

                        <Text key={-2} style={[styles.statementHeaderText, {textAlign: 'right'}]}>Departure Vessel Berth</Text>
                        {event.departureStatements.map((statement, index) => {
                            if('departure_vessel_berth' !== statement.stateDefinition.toLowerCase()) {
                                console.log('wrong state definition in departureStatements!');
                            }
                            return <StatementDetails key={index} statement={statement} />;
                        })}
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
        alignSelf: 'stretch',
        height: 30,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: colorScheme.primaryColor,
        justifyContent: 'center',
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
        marginHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: 'black'
    },

});