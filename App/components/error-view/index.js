import React, { Component } from 'react';
import { connect } from 'react-redux';

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

class ErrorView extends Component {
  render() {
    const { navigate } = this.props.navigation;

    return(
      <View style={styles.containers.centralizer}>
        <Text h2 style={{color: colorScheme.primaryColor}}>We're sorry :(</Text>
        <Text h3 style={{marginTop: 100}}>{this.props.error.error.title}</Text>
        <Text h4 style={{marginTop: 30, marginBottom: 70}}>{this.props.error.error.description}</Text>
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
    }
}

export default connect (mapStateToProps)(ErrorView);