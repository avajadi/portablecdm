import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    View,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from 'react-native';

import {
    Text,
    SearchBar,
    List,
    ListItem
} from 'react-native-elements';

import { selectBerthLocation } from '../../actions';

import TopHeader from '../top-header-view';
import colorScheme from '../../config/colors';

export default class Calculator extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { selectLocationFor, selectLocation, navigation, onBackPress, locations } = this.props;

        return (
            <View style={styles.container}>
                <TopHeader
                    navigation={navigation}
                    title="Calculator"
                />
                <View style={styles.headerContainer} >
                  <Text style={styles.headerSubText}>{'Calculate Estimated Time for Cargo Operations'}</Text>
                </View>
                <ScrollView>

                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
      backgroundColor: colorScheme.primaryColor,
      alignItems: 'center',
      flexDirection: 'column',
      },
    headerSubText: {
      textAlign: 'center',
      color: colorScheme.primaryTextColor,
      fontSize: 18,
      fontWeight: 'bold',
    },
    searchBarContainer: {
        backgroundColor: colorScheme.primaryColor,
        marginRight: 0,
        borderBottomWidth: 0,
        borderTopWidth: 0,
    },
    subtitle: {
        fontSize: 10,
    }
});
