import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    StyleSheet,
    View,
    Text,
    Dimensions
} from 'react-native';

import {
    Icon
} from 'react-native-elements';



import colorScheme from '../../../config/colors';

import EventBar from './EventBar';
import TimeHeader from './TimeHeader';

const EventView = (props) => {

    const lineLeftMargin = (props.date - props.events.earliestStartTime) * props.displayRatio;

    return <View style={[styles.container]}>
                <TimeHeader />
                <View style={[styles.timeIndicatorLine, {left: lineLeftMargin}]}></View>
                <View style={[styles.ganttContainer]}>
                    {props.events.map((row, index) => {
                        return <View key={index} style={[styles.rowContainer]}>
                                    {row.map((event, index2) => {
                                        let prevEnd = row[index2-1] ? row[index2-1].displayEndTime : props.events.earliestStartTime;
                                        return (<EventBar 
                                                    key={index2} 
                                                    event={event} 
                                                    prevEndTime={prevEnd} 
                                                    displayRatio={props.displayRatio}
                                        />);
                                    })}
                        </View>
                    })}
                </View>
                
    </View>
};

EventView.propTypes = {
    events: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
    date: PropTypes.object.isRequired,
}

export default EventView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colorScheme.primaryContainerColor,
        alignSelf: 'center',
        marginLeft: 10,
    },
    rowContainer: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    timeIndicatorLine: {
        position: 'absolute',
        borderWidth: 1,
        borderColor: 'red',
        top: 20,
        bottom: 0,
        backgroundColor: 'red',
        zIndex: 10,
    },
    ganttContainer: {
        marginTop: 30
    }
});

