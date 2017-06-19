import React from 'react';
import { StyleSheet, Text, View, AppRegistry } from 'react-native';
import { StackNavigator } from 'react-navigation';

import StartButton from './components/startbutton';
import ActorListView from './components/actorlistview';

import { StackNav } from './config/router';

export default class App extends React.Component {
  render() {
    // const { navigate } = this.props.navigation;
    return (
        <StackNav />
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });