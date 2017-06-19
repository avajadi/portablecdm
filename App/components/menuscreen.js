import React, {Component, PropTypes} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList
} from 'react-native';

export default class MenuScreen extends Component {
    static navigationOptions = {
    title: 'Change actor choice'
  };

  render() {
    return(
      <Text>This is the main menu</Text>
    );
  }
}