import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import colorScheme from '../../../config/colors';

const BerthHeader = (props) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Events for {props.location.name}</Text>
        </View>
    );
};

BerthHeader.propTypes = {
    location: PropTypes.object,
}

export default BerthHeader;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1a3047',
        paddingTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: colorScheme.primaryTextColor,
    }
});