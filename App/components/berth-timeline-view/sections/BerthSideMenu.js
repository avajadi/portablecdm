import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    StyleSheet,
    View,
    Text
} from 'react-native';

import {
    Icon
} from 'react-native-elements';

import colorScheme from '../../../config/colors';

const BerthSideMenu = (props) => (
    <View style={styles.container}>
    </View>
);

BerthSideMenu.propTypes = {

}

export default BerthSideMenu;


const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: colorScheme.primaryColor,
        width: 40,
    }
});