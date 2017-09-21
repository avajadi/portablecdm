import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform } from 'react-native';

import {
  View,
  ScrollView,
  TouchableHighlight,
} from 'react-native';

import {
  Text,
  Button,
} from 'react-native-elements';

import TopHeader from '../top-header-view';
import colorScheme from '../../config/colors';
import styles from '../../config/styles';

const unsupportedAndroidMessage = 'You are running on Android version 7.0.0 which is currently not supported. Please update to at least 7.1.1 to use https.'

class ErrorView extends Component {

  createDescription() {
    if(Platform.Version === 24) {
      return 
    }
  }

  render() {
    return(
      <View style={styles.containers.centralizer}>
        <Text h2 style={{color: colorScheme.primaryColor}}>We're sorry :(</Text>
        <Text h3 style={{marginTop: 100, marginLeft: 20, marginRight: 20}}>{this.props.error.error.title}</Text>
        <Text style={{marginTop: 30, marginBottom: 70, marginLeft: 20, marginRight: 20}}>{Platform.Version === 24 && this.props.host.startsWith('https')
          ? unsupportedAndroidMessage : this.props.error.error.description}</Text>
        <TouchableHighlight onPress={() => navigate('LoginKeyCloak')}>
        <View style={styles.containers.subContainer}>
            <Text h4 style={styles.fonts.white}>RETURN</Text>
        </View>
        </TouchableHighlight>
        </View>
    );
  }
}

function mapStateToProps(state) {
    return {
        error: state.error,
        host: state.settings.connection.host,
    }
}

export default connect (mapStateToProps)(ErrorView);