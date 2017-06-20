import React from 'react';
import { StyleSheet, Text, View, AppRegistry } from 'react-native';
import { StackNavigator } from 'react-navigation';

import { MainRouter } from './config/router';

export default class App extends React.Component {
  render() {
    return (
        <MainRouter />
    );
  }
}