import React, { Component } from 'react';
import { Text } from 'react-native';


export default class ActorListView extends Component {
  static navigationOptions = {
    title: 'Choose your actor'
  };

  render() {
    return(
      <Text>Vi är på en ny skärm</Text>
    );
  }
}