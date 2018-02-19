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

import { changeUser } from '../../actions';

const unsupportedAndroidMessage = 'You are running on Android version 7.0.0 which is currently not supported. Please update to at least 7.1.1 to use https.'

class ErrorView extends Component {

  constructor(props) {
    super(); 

    this.returnFromError = this.returnFromError.bind(this);
  }

  createDescription() {
    if(Platform.Version === 24) {
      return 
    }
  }

  returnFromError() {
    this.props.changeUser('','', false);
    this.props.navigation.navigate('LoginView', {}, {
        type: "Navigation/NAVIGATE",
        routeName: "LoginView",
        params: { fromError: true }
      });
  }


  render() {
    return(
      <View style={styles.containers.centralizer}>
        <Text h2 style={{color: colorScheme.primaryColor}}>We're sorry :(</Text>
        <Text h3 style={{marginTop: 100, marginLeft: 20, marginRight: 20, textAlign: 'center'}}>{this.props.error.error.title}</Text>
        <Text style={{marginTop: 30, marginBottom: 70, marginLeft: 20, marginRight: 20, textAlign: 'center'}}>{Platform.Version === 24 && this.props.host.startsWith('https')
        ? unsupportedAndroidMessage : this.props.error.error.description}</Text>
        <TouchableHighlight onPress={() => this.returnFromError()}>
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

export default connect (mapStateToProps, { changeUser })(ErrorView);