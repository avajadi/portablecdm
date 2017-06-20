import React, {Component, PropTypes} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList
} from 'react-native';

export default class MainMenu extends Component {
  static navigationOptions = {
    title: 'Change actor choice'
  };

  constructor() {
    super();
  }

  render() {
    const { params } = this.props.navigation.state;

    return(
      <Text>This is the main menu, you are a {params.selectedActor.displayName} with key: {params.selectedActor.key}</Text>
    );
  }
}