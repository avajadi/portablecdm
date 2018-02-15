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
        <Icon
            name= 'menu'
            color= {colorScheme.primaryContainerColor}
            size= {40}
            underlayColor='transparent'
            onPress={props.onMenuPress}
        />
        <Icon
            name='search'
            color={colorScheme.primaryTextColor}
            size={40}
            onPress={props.onSearchPress}
        />
    </View>
);

BerthSideMenu.propTypes = {
    onMenuPress: PropTypes.func.isRequired,
    onSearchPress: PropTypes.func.isRequired,
}

export default BerthSideMenu;


const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: colorScheme.primaryColor,
        width: 60,
        justifyContent: 'center'
    }
});