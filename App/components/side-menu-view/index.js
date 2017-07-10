import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';

import {

} from 'react-native-elements';

import colorScheme from '../../config/colors';

export default class SideMenu extends Component {
  render() {
    return(
      <View style={styles.container}>
        <Text>Det här är en sidomeny!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorScheme.primaryColor,
  },
})
