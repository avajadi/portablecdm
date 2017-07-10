import React from 'react';
import { StyleSheet, Text, View, AppRegistry } from 'react-native';
import { StackNavigator } from 'react-navigation';

import {AppNavigator, StackNav} from './navigators/appnavigator';

import SendPortcall from './components/send-portcall-view';
import TimeLineView from './components/timeline-view';

export default class App extends React.Component {
  render() {
    return (
        <StackNav />
    );
  }
}