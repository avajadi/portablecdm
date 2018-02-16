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
        </View>
    );
};

BerthHeader.propTypes = {
    location: PropTypes.object,
}

export default BerthHeader;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colorScheme.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        height: 20,
    },
    text: {
        color: colorScheme.primaryTextColor,
    }
});