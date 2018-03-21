import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScreenOrientation } from 'expo';

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

import DateTimePicker from 'react-native-modal-datetime-picker';

import BerthSideMenu from './sections/BerthSideMenu';
import EventView from './sections/EventView';
import BerthHeader from './sections/BerthHeader';
import BerthSettings from './sections/BerthSettings';

import { 
    fetchEventsForLocation,
    selectNewDate,
    fetchPortCall,
    selectPortCall,
    changeLookAheadDays,
    changeLookBehindDays,
    setFilterOnSources,
} from '../../actions';
import colorScheme from '../../config/colors';

class BerthTimeLine extends Component {

    constructor(props) {
        super(props);

        this.initialSettings = {
            lookBehindDays: props.lookBehindDays,
            lookAheadDays: props.lookAheadDays,
            filterOnSources: props.filterOnSources,
            previousFilters: props.previousFilters,
        }

        this.state = {
            showDateTimePicker: false,
            showExpiredEvents: false,
            showSettingsModal: false,
            settings: this.initialSettings,
        }
    }

    

    scrollToSelectedTime = () => {
        const windowWidth = Dimensions.get('screen').width;
        InteractionManager.runAfterInteractions(() => {
            setTimeout(() => { // Fattar inte varför man behöver en timeout här?? Inte jag heller! // P
                if (this.horizontalScroll) {
                    let earliestStartDate = new Date(this.props.date.getTime());
                    earliestStartDate.setDate(earliestStartDate.getDate() - this.props.lookBehindDays);
                    const x = (this.props.date - earliestStartDate) * this.props.displayRatio - windowWidth/2 + 140;
                    this.horizontalScroll.scrollTo({
                        x: x,
                        y: 0,
                        animated: true
                    });
                } else {
                    console.log('This should never happend, unless there is a server problem (scrollToSelectedTime in berth-timeline-view)');
                }
            });
        }, 5); 
    };

    fetchEvents() {
        this.props.fetchEventsForLocation(this.props.berth.URN, this.props.date)
        .then(() => {
            if(this.props.error.hasError) {
                this.props.navigation.navigate('Error');
            }
        })
        .then(() => {
            this.scrollToSelectedTime();
        });
    }

    createShowHideExpiredIcon() {
        return {
            name: this.state.showExpiredEvents ? 'remove-red-eye' : 'visibility-off',
            color: 'white',
            onPress: this._onExpiredPress
        };
    }

    componentDidMount() {
        ScreenOrientation.allow('LANDSCAPE');
        this.fetchEvents();
    }

    componentDidUpdate(prevProps, prevState) {

        if(prevProps.lookAheadDays !== this.props.lookAheadDays || prevProps.lookBehindDays !== this.props.lookBehindDays) {
            this.fetchEvents();
        }

        if(prevProps.events !== this.props.events && this.horizontalScroll) {
            this.scrollToSelectedTime();
        }
    }

    componentWillUnmount() {
        ScreenOrientation.allow('ALL');
    }

    render() {

        const { berth, events, fetchingEvents, date, displayRatio } = this.props;
        
        return(
            <View style={styles.container}>
                <BerthSideMenu
                    onBackPress={this._onBackPress}
                    onSearchPress={this._onSearchPress}
                    onSettingsPress={this._toggleSettings}
                    selectorIcon={this.createShowHideExpiredIcon()}
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
                        <ScrollView
                            horizontal
                            ref={(ref) => this.horizontalScroll = ref}
                            style={{alignSelf: 'stretch'}}
                        >
                            <EventView 
                                events={events}
                                date={date}
                                displayRatio={displayRatio}
                                showExpired={this.state.showExpiredEvents}
                                onViewPortCall={this._onViewPortCall}
                                acceptSources={this.props.filterOnSources}
                            />
                        </ScrollView>
                    }
                    { this.state.showSettingsModal &&
                        <BerthSettings
                            onClose={this._onCloseSettings}
                            isVisible={this.state.showSettingsModal}
                            onLookAheadDaysChange={this._onLookAheadDaysChange}
                            onLookBehindDaysChange={this._onLookBehindDaysChange}
                            onFilterOnSourceChange={this._onFilterOnSourceChange}
                            settings={this.state.settings}
                        />

                    }

                    <DateTimePicker
                        isVisible={this.state.showDateTimePicker}
                        onConfirm={this._handleDateTimePicked}
                        onCancel={this._hideDateTimePicker}
                        mode="date"
                    />
                </View>
            </View>
        );
    }

    _onFilterOnSourceChange = (filterOnSource) => {
        if(filterOnSource !== "") {
            this.setState({settings: {...this.state.settings, filterOnSources: [filterOnSource]}});
        } else {
            this.setState({settings: { ...this.state.settings, filterOnSources: []}});
        }
    }

    _onLookAheadDaysChange = (days) => {
        this.setState({settings: {...this.state.settings, lookAheadDays: days}});
    }

    _onLookBehindDaysChange = (days) => {
        this.setState({settings: {...this.state.settings, lookBehindDays: days}});
    }

    _onBackPress = () => {
        this.props.navigation.goBack();
    }

    _onSearchPress = () => {
        this._showDateTimePicker();
    }

    _toggleSettings = () => {
        this.setState({showSettingsModal: !this.state.showSettingsModal});
    }

    _onCloseSettings = (shouldWeSave) => {
        if(shouldWeSave) {
            this.initialSettings = this.state.settings;
            this.props.changeLookAheadDays(this.state.settings.lookAheadDays);
            this.props.changeLookBehindDays(this.state.settings.lookBehindDays);
            this.props.setFilterOnSources(this.state.settings.filterOnSources);
        } else {
            this.setState({settings: this.initialSettings});
        }

        this._toggleSettings();
    }

    _onExpiredPress = () => {
        this.setState({showExpiredEvents: !this.state.showExpiredEvents})
    }

    _onViewPortCall = (portCallId) => {
        this.props.fetchPortCall(portCallId)
            .then(this.props.selectPortCall)
            .then(() => this.props.navigation.navigate('TimeLine'))
    }

    _showDateTimePicker = () => this.setState({showDateTimePicker: true});
    _hideDateTimePicker = () => this.setState({showDateTimePicker: false});
    _handleDateTimePicked = (date) => {
        date.setHours(0, 0, 0, 0);
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
        flexDirection: 'column',
        justifyContent: 'flex-start',
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
        lookBehindDays: state.berths.lookBehindDays,
        lookAheadDays: state.berths.lookAheadDays,
        filterOnSources: state.berths.filterOnSources,
        previousFilters: state.berths.previousFilters,
    };
}

export default connect(mapStateToProps, { 
    fetchEventsForLocation, 
    selectNewDate,
    fetchPortCall,
    selectPortCall,
    changeLookAheadDays,
    changeLookBehindDays,
    setFilterOnSources, 
})(BerthTimeLine);