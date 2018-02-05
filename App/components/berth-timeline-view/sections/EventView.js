import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    StyleSheet,
    View,
    Text
} from 'react-native';

import {
    Icon
} from 'react-native-elements';

import colorScheme from '../../../config/colors';

import EventBar from './EventBar';

const EventView = (props) => {

    return <View style={[styles.container]}>
                {props.events.map((row, index) => {
                    return <View key={index} style={[styles.rowContainer]}>
                                {row.map((event, index2) => {
                                    let prevEnd = row[index2-1] ? row[index2-1].displayEndTime : props.events.earliestStartTime;
                                    return (<EventBar key={index2} event={event} prevEndTime={prevEnd} />);
                                })}
                    </View>
                })}
    </View>
};

EventView.propTypes = {
    events: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
    startTime: PropTypes.object.isRequired,
}

export default EventView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colorScheme.primaryContainerColor,
        alignSelf: 'center',
        marginLeft: 10,
        marginTop: 40,
    },
    rowContainer: {
        flexDirection: 'row',
        marginVertical: 10,
    }
});

