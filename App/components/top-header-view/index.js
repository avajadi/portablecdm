import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

import {
} from 'react-native-elements';

import colorScheme from '../../config/colors';

export default class TopHeader extends Component {
  render() {
    const {title} = this.props;

    return(
      <View style={styles.container}>
        <Text>{title}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    backgroundColor: colorScheme.primaryColor,
  }
});


