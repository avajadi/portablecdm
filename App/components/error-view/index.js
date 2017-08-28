import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  View,
} from 'react-native';

import {
  Text,
} from 'react-native-elements';

import TopHeader from '../top-header-view';
import colorScheme from '../../config/colors';

export default class ErrorView extends Component {
  render() {
    return(
      <View style={styles.container}>
        <TopHeader
          title="Error"
          firstPage
        />
        <View>
          <Text h3>We're sorry :(</Text>
        </View>
      </View>
    );
  }
}