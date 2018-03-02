import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableWithoutFeedback,
    ScrollView,
} from 'react-native';

import {
    Slider,
} from 'react-native-elements';

import colorScheme from '../../../config/colors';

const BerthSettings = (props) => {
    console.log(props.settings.lookAheadDays)
    console.log(props.settings.lookBehindDays)

    return (
        <Modal
            visible={props.isVisible}
            onRequestClose={props.onClose}
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

                    <ScrollView>
                        <Slider
                            value={props.settings.lookAheadDays}
                            onValueChange={props.onLookAheadDaysChange}
                            minimumValue={0}
                            maximumValue={31}
                            step={1}
                            thumbTintColor={colorScheme.primaryColor}
                        />
                        <Text style={{ fontWeight: 'bold', paddingLeft: 10, marginBottom: 10, }}>
                                View {props.settings.lookAheadDays} days into the future.
                        </Text>
                        <Slider
                            value={props.settings.lookBehindDays}
                            onValueChange={props.onLookBehindDaysChange}
                            minimumValue={0}
                            maximumValue={31}
                            step={1}
                            thumbTintColor={colorScheme.primaryColor}
                        />
                        <Text style={{ fontWeight: 'bold', paddingLeft: 10, marginBottom: 10, }}>
                                View {props.settings.lookBehindDays} days into the past.
                        </Text>

                    </ScrollView>

                {/* Bottom row, with buttons */}
                <View style={styles.buttonsContainer}>
                    <TouchableWithoutFeedback
                        onPress={() => props.onClose(true)}
                    >
                        <View style={[styles.button, {borderBottomLeftRadius: 10}]}>
                            <Text style={styles.headerText}>Ok</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={() => props.onClose(false)}
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
};

BerthSettings.propTypes = {
    onClose: PropTypes.func.isRequired,
    isVisible: PropTypes.bool.isRequired,
    settings: PropTypes.object.isRequired,
    onLookAheadDaysChange: PropTypes.func.isRequired,
    onLookBehindDaysChange: PropTypes.func.isRequired,    
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
});