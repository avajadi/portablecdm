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


import { getDateString, getTimeString } from '../../../util/timeservices';
import { cleanURN } from '../../../util/stringUtils';
import colorScheme from '../../../config/colors';

import EventBar from './EventBar';
import TimeHeader from './TimeHeader';
import EventDetails from './EventDetails';



class EventView extends Component {

    state = {
        showEventDetailsModal: false,
        eventDetails: {}
    }

    isValidSource(event, acceptedSources) {
        // Empty accepted sources means accept all
        if(acceptedSources.length <= 0) {
            return true;
        }
        else {
            const { arrivalStatements, departureStatements } = event;

            const arrival = arrivalStatements.some(statement => acceptedSources.includes(cleanURN(statement.reportedBy).toLowerCase()))
            const departure = departureStatements.some(statement => acceptedSources.includes(cleanURN(statement.reportedBy).toLowerCase()))
                
            return arrival && departure;
        }
    }

    render() {

        const { events, displayRatio, date, showExpired } = this.props;


        return <View style={[styles.container]}>
                    <TimeHeader startTime={events.earliestTime} endTime={events.latestTime} displayRatio={displayRatio}/>
                    {this.renderDayLines(events, displayRatio, date)}
                    <View style={[styles.ganttContainer]}>
                        {events.map((row, index) => {
                            return <View key={index} style={[styles.rowContainer]}>
                                        {row.map((event, index2) => {
                                            if((!showExpired && event.isExpired) || !this.isValidSource(event, this.props.acceptSources)) {
                                                return undefined;
                                            }
                                            let prevEnd = row[index2-1] ? row[index2-1].displayEndTime : events.earliestTime;
                                            return (<EventBar 
                                                        key={index2} 
                                                        event={event} 
                                                        displayRatio={displayRatio}
                                                        earliestTime={events.earliestTime}
                                                        onClick={() => {
                                                            this.setState({showEventDetailsModal: !this.state.showEventDetailsModal, eventDetails: event})
                                                        }}
                                            />);
                                        })}
                            </View>
                        })}
                    </View>
                    {this.state.showEventDetailsModal && <EventDetails
                        isVisible={this.state.showEventDetailsModal}
                        event={this.state.eventDetails}
                        onClose={() => this.setState({showEventDetailsModal: false, eventDetails: {}})}
                        onViewPortCall={this.props.onViewPortCall}
                    />}
                       
        </View>
    }

    renderDayLines = (events, displayRatio, chosenDate) => {
        const days = [];
    
        const firstDay = new Date(events.earliestTime);
        firstDay.setDate(firstDay.getDate());
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

        const now = new Date();
        if(now.getTime() > firstDay.getTime() && now.getTime() < lastDay.getTime()) { // do we want to draw a line for right now?
            days.push(now);
        }
    
        return (
            <View style={[styles.dayLinesContainer]}>
                {days.map((day, index) => {
                    const leftOffset = (day - events.earliestTime) * displayRatio;
                    let color = 'darkgrey';
    
                    const isNow = day === now;
                    let additionalStyles = {};
                    if(isNow){
                        color = 'darkred';
                        additionalStyles = styles.nowText;
                    } else if(day.getTime() === chosenDate.getTime()) {
                        color = 'black';
                    }
                    
                    return (
                        <View key={index} style={styles.dayLinesContainer}>
                            <View style={[styles.dot, {left: leftOffset - 2, backgroundColor: color}]} />
                            <View style={[styles.dayLine, {left: leftOffset, borderColor: color}]} />
                            <Text style={[styles.dayText, additionalStyles, {left: leftOffset + 6}]}>{isNow ? getTimeString(day) : getDateString(day)}</Text>
                        </View>
                    );
                })}
            </View>
        );
    
    };
}

EventView.propTypes = {
    events: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
    date: PropTypes.object.isRequired,
    displayRatio: PropTypes.number.isRequired,
    showExpired: PropTypes.any.isRequired,
    onViewPortCall: PropTypes.func.isRequired,
    acceptSources: PropTypes.arrayOf(PropTypes.string).isRequired,
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
        fontSize: 12,
        fontWeight: 'bold',
        zIndex: 15,
    },
    nowText: {
        color: 'darkred',
        top: 18,

    },
    ganttContainer: {
        marginTop: 30
    },
    dot: {
        position: 'absolute',
        width: 6,
        height: 6,
        top: 0,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

