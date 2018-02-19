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

class BerthSideMenu extends Component {

    render() {

        const { selectorIcon, onSearchPress, onBackPress} = this.props;

        return (
            <View style={styles.container}>
                <Icon
                    name= 'arrow-back'
                    color= {colorScheme.primaryContainerColor}
                    size= {40}
                    underlayColor='transparent'
                    onPress={onBackPress}
                />
                <Icon
                    name='search'
                    color={colorScheme.primaryTextColor}
                    size={40}
                    onPress={onSearchPress}
                />
                {!!selectorIcon &&
                    <Icon
                        name={selectorIcon.name}
                        color={selectorIcon.color}
                        onPress={selectorIcon.onPress}
                        size={40}
                    />
                }
            </View>
        );
    }
}



BerthSideMenu.propTypes = {
    onBackPress: PropTypes.func.isRequired,
    onSearchPress: PropTypes.func.isRequired,
    selectorIcon: PropTypes.object.isRequired,
}

export default BerthSideMenu;


const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        flexDirection: 'column',
        backgroundColor: colorScheme.primaryColor,
        width: 60,
        justifyContent: 'space-between'
    }
});