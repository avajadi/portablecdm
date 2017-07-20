import React, { Component } from 'react';
import {Text} from 'react-native';
import { StackNavigator, DrawerNavigator, TabNavigator, TabBarBottom } from 'react-navigation';


import ActorList    from '../components/actor-list-view';
import Home         from '../components/home-view';
import MainMenu     from '../components/main-menu-view';
import SendPortCall from '../components/send-portcall-view';
import StateList    from '../components/state-list-view';
import PortCallList from '../components/portcall-list-view';
import TimeLineView from '../components/timeline-view';
import FilterMenu   from '../components/portcall-list-view/sections/filterMenu';
import StateDetails from '../components/timeline-view/sections/statedetails';


export const PortCallNavigator = StackNavigator({
  PortCallList: { screen: PortCallList},
  TimeLineDetails: {screen: TimeLineView},
  //FilterMenu: {screen: FilterMenu},  
  StateDetails: { screen: StateDetails}, 
  StateList: { screen: StateList },
}, {
  navigationOptions: {
    gesturesEnabled: false
  },
  headerMode: 'none'
});

// export const TabBarNavigator = TabNavigator({
//   TimeLineDetails: {screen: TimeLineView},
//   Home: { screen: Home },  
//   ActorSelection: { screen: ActorList },  
  
// }, {   
//   tabBarOptions: {
//     activeTintColor: '#e91e63',
//   }, 
//   tabBarComponent: TabBarBottom,
//   tabBarPosition: 'bottom',
// },
// );

export const AppNavigator = DrawerNavigator({
  PortCalls: { screen: PortCallNavigator }, 
 // TabBar: {screen: TabBarNavigator},
  Home: { screen: Home },  
  MainMenu: { screen: MainMenu },
  SendPortCall: { screen: SendPortCall },
  FilterMenu: {screen: FilterMenu},

}, {
  headerMode: 'none'
});

// }, 
// // {
// // navigationOptions: {
// //   gesturesEnabled: true
// // },
// // }
// );


