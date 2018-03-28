import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import colorScheme from '../../../config/colors';

const TimeHeader = (props) => {
    const width = (props.endTime - props.startTime) * props.displayRatio;
    return (
        <View style={[styles.container, {width: width}]}>
        </View>
    );
};

TimeHeader.propTypes = {
    startTime: PropTypes.object,
    endTime: PropTypes.object,
}

export default TimeHeader;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1a3047',
        alignItems: 'center',
        justifyContent: 'center',
        height: 20,
    },
    text: {
        color: colorScheme.primaryTextColor,
    }
});