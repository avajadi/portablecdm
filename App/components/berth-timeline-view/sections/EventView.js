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


import { getDateString } from '../../../util/timeservices';
import colorScheme from '../../../config/colors';

import EventBar from './EventBar';
import TimeHeader from './TimeHeader';

const renderDayLines = (events, displayRatio, chosenDate) => {
    const days = [];

    const firstDay = new Date(events.earliestTime);
    firstDay.setDate(firstDay.getDate() + 1);
    firstDay.setHours(0, 0, 0, 0);

    const lastDay = new Date(events.latestTime);
    lastDay.setHours(0, 0, 0, 0);

    days.push(firstDay);
    let i = 1;
    let newDay = new Date(days[i-1]);
    newDay.setDate(newDay.getDate() + 1);

    while((lastDay - newDay) > 0) {
        newDay = new Date(days[i-1]);
        newDay.setDate(newDay.getDate() + 1);
        days.push(newDay);
        i++;
    }

    return (
        <View style={[styles.dayLinesContainer]}>
            {days.map((day, index) => {
                const leftOffset = (day - events.earliestTime) * displayRatio;
                let color = 'black';

                if(day.getTime() === chosenDate.getTime()) {
                    color = 'red';
                }
                
                return (
                    <View key={index} style={styles.dayLinesContainer}>
                        <View style={[styles.dayLine, {left: leftOffset, borderColor: color}]} />
                        <Text style={[styles.dayText, {left: leftOffset + 4}]}>{getDateString(day)}</Text>
                    </View>
                );
            })}
        </View>
    );

};

const EventView = (props) => {
    return <View style={[styles.container]}>
                <TimeHeader startTime={props.events.earliestTime} endTime={props.events.latestTime} displayRatio={props.displayRatio}/>
                {renderDayLines(props.events, props.displayRatio, props.date)}
                <View style={[styles.ganttContainer]}>
                    {props.events.map((row, index) => {
                        return <View key={index} style={[styles.rowContainer]}>
                                    {row.map((event, index2) => {
                                        if(!props.showExpired && event.isExpired) {
                                            return undefined;
                                        }
                                        let prevEnd = row[index2-1] ? row[index2-1].displayEndTime : props.events.earliestTime;
                                        return (<EventBar 
                                                    key={index2} 
                                                    event={event} 
                                                    prevEndTime={prevEnd} 
                                                    displayRatio={props.displayRatio}
                                                    earliestTime={props.events.earliestTime}
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
    displayRatio: PropTypes.number,
    showExpired: PropTypes.any,
}

export default EventView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colorScheme.primaryContainerColor,
    },
    dayLinesContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    rowContainer: {
        flexDirection: 'row',
        marginVertical: 5,
        height: 65,
        alignContent: 'center',
    },
    dayLine: {
        position: 'absolute',
        borderWidth: 1,
        borderColor: 'black',
        top: 0,
        bottom: 0,
        zIndex: 10,
    },
    dayText: {
        position: 'absolute',
        color: colorScheme.primaryTextColor,
        top: 4,
        fontSize: 9,
        fontWeight: 'bold',
    },
    ganttContainer: {
        marginTop: 30
    }
});

