import React from 'react';
import { StyleSheet, Text, View, AppRegistry } from 'react-native';
import { StackNavigator } from 'react-navigation';

import { MainRouter } from './config/router';

import SendPortcall from './components/send-portcall-view';

export default class App extends React.Component {
  render() {
    return (
        // <SendPortcall />
        <MainRouter />
    );
  }
}