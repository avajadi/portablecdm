import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableWithoutFeedback,
    ScrollView,
    TextInput,
    Dimensions,
} from 'react-native';

import {
    Slider,
    FormInput,
    Icon,
} from 'react-native-elements';

import ModalDropdown from 'react-native-modal-dropdown';

import colorScheme from '../../../config/colors';

const dimensions = Dimensions.get('window');

class BerthSettings extends Component {

    state = {
        showDropdown: false,
    }

    toggleDropdown() {

        if (this.state.showDropdown) {
            this.dropdown.hide();
        } else {
            this.dropdown.show();
        }
        this.setState({showDropdown: !this.state.showDropdown});

    }


    render() {
        return (
            <Modal
                visible={this.props.isVisible}
                onRequestClose={this.props.onClose}
                animationType='fade'
                transparent={true}
            >
                {/* Darker background everywhere else */}
                <View style={styles.outerContainer}>
                    {/* The actual modal window */}
                    <View style={styles.innerContainer}>
                        {/* Header */}
                        <View style={styles.headerContainer}>
                            <Text style={styles.headerText}>Quay Settings</Text>
                        </View>
    
                        {/* Main (settings) part */}
                        <ScrollView>

                            <Text style={styles.sectionHeaderText}>Time window</Text>
                            {/* How many days ahead should we look? */}
                            <Slider
                                value={this.props.settings.lookAheadDays}
                                onValueChange={this.props.onLookAheadDaysChange}
                                minimumValue={0}
                                maximumValue={31}
                                step={1}
                                thumbTintColor={colorScheme.primaryColor}
                            />
                            <Text style={styles.sliderText}>
                                    View {this.props.settings.lookAheadDays} days into the future.
                            </Text>

                            {/* How many days behind should we look? */}
                            <Slider
                                value={this.props.settings.lookBehindDays}
                                onValueChange={this.props.onLookBehindDaysChange}
                                minimumValue={0}
                                maximumValue={31}
                                step={1}
                                thumbTintColor={colorScheme.primaryColor}
                            />
                            <Text style={styles.sliderText}>
                                    View {this.props.settings.lookBehindDays} days into the past.
                            </Text>
    
                            {/* What source must agree on the start/endTime of the event itself for us to show it? */}
                            <Text style={styles.sectionHeaderText}>Filter on source</Text>
                            <View style={{flexDirection: 'row'}}>
                                <FormInput
                                    placeholder="User name..."
                                    value={this.props.settings.filterOnSources[0] ? this.props.settings.filterOnSources[0] : ""}
                                    onChangeText={this.props.onFilterOnSourceChange}
                                    containerStyle={{borderBottomColor: colorScheme.primaryColor, width: 280, borderRadius: 10, marginHorizontal: 10}}
                                    autoCorrect={false}
                                    autoCapitalize='none'
                                />
                                 <Icon
                                    type='evilicon'
                                    name='close-o'
                                    color='darkred'
                                    onPress={() => this.props.onFilterOnSourceChange("")}
                                />
                            </View>
                            
    
                        </ScrollView>
    
                    {/* Bottom row, with buttons */}
                    <View style={styles.buttonsContainer}>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.onClose(true)}
                        >
                            <View style={[styles.button, {borderBottomLeftRadius: 10}]}>
                                <Text style={styles.headerText}>Ok</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.onClose(false)}
                        >
                            <View style={[styles.button, {borderBottomRightRadius: 10, marginLeft: 5}]}>
                                <Text style={styles.headerText}>Cancel</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    </View>
                </View>
            </Modal>
        );
    }
};

BerthSettings.propTypes = {
    onClose: PropTypes.func.isRequired,
    isVisible: PropTypes.bool.isRequired,
    settings: PropTypes.object.isRequired,
    onLookAheadDaysChange: PropTypes.func.isRequired,
    onLookBehindDaysChange: PropTypes.func.isRequired,
    onFilterOnSourceChange: PropTypes.func.isRequired,
}

export default BerthSettings;

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
        alignItems: 'center',
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
    sliderText: {
        paddingLeft: 10, 
        marginBottom: 5, 
        fontSize: 9
    },
    sectionHeaderText: {
        fontSize: 13, 
        alignSelf: 'center'
    },
});