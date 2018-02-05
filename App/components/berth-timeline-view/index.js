import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    View,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Text,
} from 'react-native';

import Orientation from 'react-native-orientation';

import BerthSideMenu from './sections/BerthSideMenu';
import EventView from './sections/EventView';
import BerthHeader from './sections/BerthHeader';

import { fetchEventsForLocation } from '../../actions';
import colorScheme from '../../config/colors';

class BerthTimeLine extends Component {

    componentDidMount() {
        Orientation.lockToLandscape();
        this.props.fetchEventsForLocation("urn:mrn:stm:location:SEGOT:BERTH:skarvik520", this.props.date)
            .then(() => {
                if(this.props.error.hasError) {
                    this.props.navigation.navigate('Error');
                }
            });
    }

    componentWillUnmount() {
        Orientation.unlockAllOrientations();
    }

    render() {

        const { berth, events, fetchingEvents, date } = this.props;

        // console.log(JSON.stringify(events));
        console.log(JSON.stringify(berth));
        
        return(
            <View style={styles.container}>
                <BerthSideMenu 
                
                />
                { fetchingEvents && 
                    <ActivityIndicator
                        animating = {fetchingEvents}
                        size = 'large'
                        style={{alignSelf: 'center', marginHorizontal: 50}}
                    />
                }
                <View style={styles.rightSideContainer}>
                    {/* <BerthHeader location={berth}/> */}
                    { !fetchingEvents &&
                        <ScrollView horizontal style={{alignSelf: 'center',}}>
                            <ScrollView>
                                <EventView 
                                    events={events}
                                    startTime={date}
                                />
                            </ScrollView>
                        </ScrollView>
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    rightSideContainer: {
        flex: 1,
        flexDirection: 'column'
    }
});

function mapStateToProps (state) {
    return {
        berth: state.berths.selectedLocation,
        events: state.berths.events,
        fetchingEvents: state.berths.fetchingEvents,
        date: state.berths.fetchForDate,
        error: state.error,
    };
}

export default connect(mapStateToProps, { fetchEventsForLocation })(BerthTimeLine);