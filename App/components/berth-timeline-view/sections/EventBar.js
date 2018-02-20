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

import { getTimeString } from '../../../util/timeservices';
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
    const { event, earliestTime } = props;

    const width = Math.max((event.displayEndTime - event.displayStartTime) * props.displayRatio, 0); 
    const marginLeft = earliestTime ? (event.displayStartTime - earliestTime) * props.displayRatio : 0;

    return (
        <TouchableWithoutFeedback
            onPress={props.onClick}
        >
            <View style={[styles.bar, {width: width, left: marginLeft}]}>
                <View style={styles.startEndContainer}>
                    {renderStartIndicator(event)}
                    <Text style={styles.timeText}>{getTimeString(new Date(event.startTime))}</Text>
                </View>
                <Text style={styles.infoText}>{event.vessel.name}</Text>
                <View style={styles.startEndContainer}>
                    <Text style={styles.timeText}>{getTimeString(new Date(event.endTime))}</Text>
                    {renderEndIndicator(event)}
                </View>

            </View>
        </TouchableWithoutFeedback>
    );
};

EventBar.propTypes = {
    event: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
}

export default EventBar;

const styles = StyleSheet.create({
    bar: {
        position: 'absolute',
        top: 0,
        borderWidth: 1,
        backgroundColor: colorScheme.tertiaryColor,
        alignSelf: 'center',
        height: 60,
        borderRadius: 1,
        alignItems: 'center',
        overflow: 'hidden',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 10,
    },
    timeText: {
        fontSize: 8,
        fontWeight: 'bold',
        color: colorScheme.primaryTextColor
    },
    startEndContainer: {
        alignItems: 'center',
        flexDirection: 'row',
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