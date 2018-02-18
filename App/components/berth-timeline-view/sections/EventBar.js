import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    StyleSheet,
    View,
    Text,
    TouchableWithoutFeedback
} from 'react-native';

import {
    Icon
} from 'react-native-elements';

import colorScheme from '../../../config/colors';


function renderStartIndicator(event) {
    const ActualIndicator = (<View style={[styles.actualContainer]}>
        <Text style={styles.actualText}>A</Text>
     </View>);

    const EstimatedIndicator = (<View style={[styles.estimateContainer]}>
            <Text style={styles.estimateText}>E</Text>
        </View>);

    const MissingIndicator = (<View style={[styles.missingContainer]}>
                                  <Text style={styles.missingText}>?</Text>
                              </View>);

    return event.defaultedStartTime ? MissingIndicator : (event.startTimeType === 'ACTUAL' ? ActualIndicator : EstimatedIndicator);
}

function renderEndIndicator(event) {
    const ActualIndicator = (<View style={[styles.actualContainer]}>
        <Text style={styles.actualText}>A</Text>
     </View>);

    const EstimatedIndicator = (<View style={[styles.estimateContainer]}>
            <Text style={styles.estimateText}>E</Text>
        </View>);

    const MissingIndicator = (<View style={[styles.missingContainer]}>
                                  <Text style={styles.missingText}>?</Text>
                              </View>);

    return event.defaultedEndTime ? MissingIndicator : (event.endTimeType === 'ACTUAL' ? ActualIndicator : EstimatedIndicator);    
}

const EventBar = (props) => {
    const { event, prevEndTime } = props;

    const width = (event.displayEndTime - event.displayStartTime) * props.displayRatio; // Each pixel is 1/5th of a minute
    const marginLeft = prevEndTime ? (event.displayStartTime - prevEndTime) * props.displayRatio : 0;

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                console.log("Event ID: " + event.eventId);
            }}
        >
            <View style={[styles.bar, {width: width, marginLeft: marginLeft}]}>
                {renderStartIndicator(event)}
                <Text style={styles.infoText}>{event.definitionId.toLowerCase().replace(/_/g, ' ')}</Text>
                {/* <Text style={styles.infoText}>{event.defaultedStartTime.toString()} - {event.defaultedEndTime.toString()}</Text> */}
                {renderEndIndicator(event)}

            </View>
        </TouchableWithoutFeedback>
    );
};

EventBar.propTypes = {
    event: PropTypes.object.isRequired,
    prevEndTime: PropTypes.object, // The time that the previous event ended, or the first event started, for the first event in each row
}

export default EventBar;

const styles = StyleSheet.create({
    bar: {
        borderWidth: 1,
        // backgroundColor: 'white',
        backgroundColor: colorScheme.primaryColor,
        alignSelf: 'center',
        height: 20,
        borderRadius: 1,
        alignItems: 'center',
        overflow: 'hidden',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 10,
    },
    infoText: {
        fontSize: 9,
        color: colorScheme.primaryTextColor,
    },
    actualText: {
        color: colorScheme.primaryTextColor,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 12,
    },
    actualContainer: {
        backgroundColor: colorScheme.actualColor,
        width: 20,
        height: 20,
        justifyContent: 'center',
        overflow: 'hidden',
        alignItems: 'center',
        borderRadius: 8,       
    },
    estimateText: {
        color: colorScheme.primaryTextColor,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 12,
    },
    estimateContainer: {
        backgroundColor: colorScheme.estimateColor,
        width: 20,
        height: 20,
        justifyContent: 'center',
        overflow: 'hidden',
        alignItems: 'center',
        borderRadius: 8,
        
    }, 
    missingText: {
        color: colorScheme.primaryTextColor,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 12,
    },
    missingContainer: {
        backgroundColor: colorScheme.warningColor,
        width: 20,
        height: 20,
        justifyContent: 'center',
        overflow: 'hidden',
        alignItems: 'center',
        borderRadius: 8,
    }, 
});