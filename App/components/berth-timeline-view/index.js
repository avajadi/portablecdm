import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    View,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Text,
    InteractionManager,
    Button,
    Dimensions
} from 'react-native';

import Orientation from 'react-native-orientation';

import DateTimePicker from 'react-native-modal-datetime-picker';

import BerthSideMenu from './sections/BerthSideMenu';
import EventView from './sections/EventView';
import BerthHeader from './sections/BerthHeader';

import { 
    fetchEventsForLocation,
    selectNewDate,
} from '../../actions';
import colorScheme from '../../config/colors';

class BerthTimeLine extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showDateTimePicker: false,
        }
    }

    scrollToRedLine = () => {
        const windowWidth = Dimensions.get('screen').width;
        InteractionManager.runAfterInteractions(() => {
            setTimeout(() => { // Fattar inte varför man behöver en timeout här?? Inte jag heller! // P
                if (this.horizontalScroll) {
                    this.horizontalScroll.scrollTo({
                        x: (this.props.date - this.props.events.earliestStartTime) * this.props.displayRatio + 50 - windowWidth/2, // the +50 is a little arbitrary...
                        y: 0,
                        animated: true
                    });
                } else {
                    console.log('Johan needs to solve this. :>');
                }
            });
        }, 5); 
    };

    componentDidMount() {
        Orientation.lockToLandscape();
        this.props.fetchEventsForLocation("urn:mrn:stm:location:SEGOT:BERTH:skarvik520", this.props.date)
        .then(() => {
            if(this.props.error.hasError) {
                this.props.navigation.navigate('Error');
            }
        })
        .then(() => {
            this.scrollToRedLine();
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.events !== this.props.events && this.horizontalScroll) {
            this.scrollToRedLine();
        }
    }

    componentWillUnmount() {
        Orientation.unlockAllOrientations();
    }

    render() {

        const { berth, events, fetchingEvents, date, displayRatio } = this.props;
        
        return(
            <View style={styles.container}>
                <BerthSideMenu
                    onMenuPress={this._onMenuPress}
                    onSearchPress={this._onSearchPress}
                />
                
                <View style={styles.rightSideContainer}>
                    <BerthHeader location={berth}/>
                    { fetchingEvents &&
                        <ActivityIndicator
                            animating={fetchingEvents}
                            large
                            color={colorScheme.primaryColor}
                            style={{alignSelf: 'center'}}
                        />
                    }
                    { !fetchingEvents &&
                        <ScrollView>
                            <ScrollView
                                horizontal
                                ref={(ref) => this.horizontalScroll = ref}
                            >
                                <EventView 
                                    events={events}
                                    date={date}
                                    displayRatio={displayRatio}
                                />
                            </ScrollView>
                        </ScrollView>
                    }
                    <DateTimePicker
                        isVisible={this.state.showDateTimePicker}
                        onConfirm={this._handleDateTimePicked}
                        onCancel={this._hideDateTimePicker}
                        mode="datetime"
                    />
                </View>
            </View>
        );
    }

    _onMenuPress = () => {
        this.props.navigation.navigate('DrawerOpen');
    }

    _onSearchPress = () => {
        this._showDateTimePicker();
    }

    _showDateTimePicker = () => this.setState({showDateTimePicker: true});
    _hideDateTimePicker = () => this.setState({showDateTimePicker: false});
    _handleDateTimePicked = (date) => {
      this.props.selectNewDate(date)
      this._hideDateTimePicker();
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
    },
    timeIndicatorLine: {
        alignItems: 'stretch',
        position: 'absolute',
        borderWidth: 1,
        borderColor: 'red',
        top: -40,
        backgroundColor: 'red',
        zIndex: 10,
    }
});

function mapStateToProps (state) {
    return {
        berth: state.berths.selectedLocation,
        events: state.berths.events,
        fetchingEvents: state.berths.fetchingEvents,
        date: state.berths.fetchForDate,
        error: state.error,
        displayRatio: state.berths.displayRatio,
    };
}

export default connect(mapStateToProps, { fetchEventsForLocation, selectNewDate })(BerthTimeLine);